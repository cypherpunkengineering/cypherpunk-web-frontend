package com.cypherpunk.appengine;
// {{{ import

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.CompositeFilter;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.ShortBlob;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheService.SetPolicy;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import java.util.ConcurrentModificationException;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.List;
import java.util.Arrays;

import java.net.InetAddress;
import java.nio.charset.StandardCharsets;
import java.math.BigInteger;
// }}}

public class GeoLocationDB
{
	// {{{ get appengine API instances
	private static final DatastoreService DS = DatastoreServiceFactory.getDatastoreService();
	private static final MemcacheService mc = MemcacheServiceFactory.getMemcacheService();
	private static final Logger LOG = Logger.getLogger(GeoLocationDB.class.getName());
	// }}}
	// {{{ static constants
	private static final int CACHE_PERIOD = 86400; // 1 day
	// }}}
	// {{{ member variables
	private final String db_name;
	// }}}
	private static final class IPv4Range // {{{
	{
		private static final String KIND = "IPv4Range";
		private static final String RANGE_START = "range_start";
		private static final String RANGE_END = "range_end";
		private static final String COUNTRY_CODE = "country_code";
	} // }}}
	private static final class IPv6Range // {{{ TODO: implement 128 bit IPv6 support
	{
		private static final String KIND = "IPv6Range";
		private static final String RANGE_START = "range_start";
		private static final String RANGE_END = "range_end";
		private static final String COUNTRY_CODE = "country_code";
	} // }}}
	public GeoLocationDB() // {{{
	{
		db_name = "";
	} // }}}

	public final String getCountry(String reqIP) { // {{{
		// Return value immediately if memcached
		String countryCode = (String)mc.get(reqIP);
		if (countryCode != null) { return countryCode; }

		System.out.println(reqIP);
		if (reqIP.contains(":")) { countryCode = searchIPv6CountryCode(reqIP); }
		else { countryCode = searchIPv4CountryCode(reqIP); }

		return countryCode;
	} // }}}

	private String searchIPv4CountryCode(String reqIP) {
		String countryCode = "";
		long reqIPLong = convertIPv4dottedToLong(reqIP);

		// Otherwise query from datastore
		Filter IPv4RangeStartFilter = new FilterPredicate(IPv4Range.RANGE_START, FilterOperator.LESS_THAN_OR_EQUAL, reqIPLong);
		Filter IPv4RangeEndFilter = new FilterPredicate(IPv4Range.RANGE_END, FilterOperator.GREATER_THAN_OR_EQUAL, reqIPLong);
		//Filter IPv4RangeFilter = CompositeFilterOperator.and(IPv4RangeStartFilter, IPv4RangeEndFilter);

		List<Entity> result = null;
		try
		{
			Query query = new Query(IPv4Range.KIND)
				.setFilter(IPv4RangeStartFilter)
				.setFilter(IPv4RangeEndFilter);
				//.setFilter(IPv4RangeFilter)
				//.addSort(IPv4Range.RANGE_START, SortDirection.ASCENDING);
			PreparedQuery pq = DS.prepare(query);
			//result = pq.asSingleEntity();
			result = pq.asList(FetchOptions.Builder.withLimit(1));

			if (result.size() == 0)
			{
				LOG.log(Level.WARNING, "GeoIP lookup for "+reqIP+" returned empty result list!");
				return null;
			}
		}
		catch (Exception e)
		{
			LOG.log(Level.WARNING, e.toString(), e);
			return null;
		}

		// found the closest result
		if (result.size() > 0)
		{
			long IPv4RangeStart = (long)result.get(0).getProperty(IPv4Range.RANGE_START);
			long IPv4RangeEnd = (long)result.get(0).getProperty(IPv4Range.RANGE_END);

			// check if IP is in range of result
			if (reqIPLong >= IPv4RangeStart && reqIPLong <= IPv4RangeEnd)
			{
				countryCode = (String)result.get(0).getProperty(IPv4Range.COUNTRY_CODE);
				LOG.log(Level.INFO, "GeoIP lookup for "+reqIP+" matched country "+countryCode);
			}
			else
			{
				countryCode = "ZZ"; // IP not in any result range, set as unknown
				LOG.log(Level.WARNING, "GeoIP lookup for "+reqIP+" ("+reqIPLong+") didn't match check: "+IPv4RangeStart+" - "+IPv4RangeEnd);
			}
		}

		if (countryCode != null) // cache result in memcache
			mc.put(reqIP, countryCode, Expiration.byDeltaSeconds(CACHE_PERIOD), SetPolicy.ADD_ONLY_IF_NOT_PRESENT);

		return countryCode;
	}

	private String searchIPv6CountryCode(String reqIP) {
		String countryCode = "";
		ShortBlob reqIPShortBlob = convertIPv6AddrToShortBlob(reqIP);

		// Otherwise query from datastore
		Filter IPv4RangeStartFilter = new FilterPredicate(IPv6Range.RANGE_START, FilterOperator.LESS_THAN_OR_EQUAL, reqIPShortBlob);
		Filter IPv4RangeEndFilter = new FilterPredicate(IPv6Range.RANGE_END, FilterOperator.GREATER_THAN_OR_EQUAL, reqIPShortBlob);
		//Filter IPv4RangeFilter = CompositeFilterOperator.and(IPv4RangeStartFilter, IPv4RangeEndFilter);

		List<Entity> result = null;
		try
		{
			Query query = new Query(IPv6Range.KIND)
				.setFilter(IPv4RangeStartFilter)
				.setFilter(IPv4RangeEndFilter);
				//.setFilter(IPv4RangeFilter)
				//.addSort(IPv4Range.RANGE_START, SortDirection.ASCENDING);
			PreparedQuery pq = DS.prepare(query);
			//result = pq.asSingleEntity();
			result = pq.asList(FetchOptions.Builder.withLimit(1));

			if (result.size() == 0)
			{
				LOG.log(Level.WARNING, "GeoIP lookup for "+reqIP+" returned empty result list!");
				return null;
			}
		}
		catch (Exception e)
		{
			LOG.log(Level.WARNING, e.toString(), e);
			return null;
		}

		// found the closest result
		if (result.size() > 0)
		{
			ShortBlob IPv6RangeStart = (ShortBlob)result.get(0).getProperty(IPv6Range.RANGE_START);
			ShortBlob IPv6RangeEnd = (ShortBlob)result.get(0).getProperty(IPv6Range.RANGE_END);

			// check if IP is in range of result
			if (reqIPShortBlob.compareTo(IPv6RangeStart) > 0 &&
					reqIPShortBlob.compareTo(IPv6RangeEnd) < 0)
			{
				countryCode = (String)result.get(0).getProperty(IPv6Range.COUNTRY_CODE);
				LOG.log(Level.INFO, "GeoIP lookup for "+reqIP+" matched country "+countryCode);
			}
			else
			{
				countryCode = "ZZ"; // IP not in any result range, set as unknown
				LOG.log(Level.WARNING, "GeoIP lookup for "+reqIP+" ("+reqIPShortBlob+") didn't match check: "+IPv6RangeStart+" - "+IPv6RangeEnd);
			}
		}

		if (countryCode != null) // cache result in memcache
			mc.put(reqIP, countryCode, Expiration.byDeltaSeconds(CACHE_PERIOD), SetPolicy.ADD_ONLY_IF_NOT_PRESENT);

		return countryCode;
	}

	private void addIPv4Range(String id, long rangeStart, long rangeEnd, String rangeCountryCode) { // {{{ TODO: rewrite to use multiple puts in one transaction
		Key rangeKey = KeyFactory.createKey(IPv4Range.KIND, id);
		Transaction tx = DS.beginTransaction();
		Entity range = new Entity(rangeKey);
		try {
			range.setProperty(IPv4Range.RANGE_START, rangeStart);
			range.setProperty(IPv4Range.RANGE_END, rangeEnd);
			range.setProperty(IPv4Range.COUNTRY_CODE, rangeCountryCode);
			DS.put(tx, range);
			tx.commit();
		}
		catch (Exception e) { LOG.log(Level.WARNING, e.toString(), e); }
		finally {
			if (tx.isActive()) { tx.rollback(); }
		}
	} // }}}

	private void addIPv6Range(String id, ShortBlob rangeStart, ShortBlob rangeEnd, String rangeCountryCode) { // {{{ TODO: rewrite to use multiple puts in one transaction
		Key rangeKey = KeyFactory.createKey(IPv6Range.KIND, id);
		Transaction tx = DS.beginTransaction();
		Entity range = new Entity(rangeKey);
		try {
			range.setProperty(IPv6Range.RANGE_START, rangeStart);
			range.setProperty(IPv6Range.RANGE_END, rangeEnd);
			range.setProperty(IPv6Range.COUNTRY_CODE, rangeCountryCode);
			DS.put(tx, range);
			tx.commit();
		}
		catch (Exception e) { LOG.log(Level.WARNING, e.toString(), e); }
		finally {
			if (tx.isActive()) { tx.rollback(); }
		}
	} // }}}

	public void initDatabase(String chunk) // {{{
	{
		String filePath = "res/dbip-chunks/dbip-chunk-"+chunk;
		BufferedReader reader = null;
		String line;
		long lineNumber = 0;

		try {
			reader = new BufferedReader(new FileReader(filePath));
			while ((line = reader.readLine()) != null) {
				lineNumber++;

				// parse csv
				String[] country = line.replaceAll("\"", "").split(",");
				//LOG.log(Level.INFO, "got IP range: "+country[0]+" to "+country[1]+" for "+country[2]);

				// check for ipv4 or IPv6
				String id = "IP-" + country[0] + "-" + country[1];
				if (country[0].contains(":")) {
					ShortBlob rangeStart = convertIPv6AddrToShortBlob(country[0]);
					ShortBlob rangeEnd = convertIPv6AddrToShortBlob(country[1]);
					String rangeCountryCode = country[2];
					addIPv6Range(id, rangeStart, rangeEnd, rangeCountryCode);
				}
				else {
					long rangeStart = convertIPv4dottedToLong(country[0]);
					long rangeEnd = convertIPv4dottedToLong(country[1]);
					String rangeCountryCode = country[2];
					addIPv4Range(id, rangeStart, rangeEnd, rangeCountryCode);
				}
			}
		}
		catch (FileNotFoundException e) { e.printStackTrace(); }
		catch (IOException e) {
			// LOG.log(Level.WARNING, "line number "+lineNumber, e);
			e.printStackTrace();
		}
		finally {
			if (reader != null) {
				try { reader.close(); }
				catch (IOException e) { e.printStackTrace(); }
			}
		}

		LOG.log(Level.WARNING, "GeoLocationDB initialization re-initialized!");
	} // }}}

	private long convertIPv4dottedToLong(String ipAddress) // {{{
	{
		long result = 0;
		String[] ipAddressInArray = ipAddress.split("\\.");
		for (int i = 3; i >= 0; i--)
		{
			try
			{
				long ip = Long.parseLong(ipAddressInArray[3 - i]);
				//left shifting 24,16,8,0 and bitwise OR
				//1. 192 << 24
				//1. 168 << 16
				//1. 1   << 8
				//1. 2   << 0
				result |= ip << (i * 8);
			}
			catch (Exception e)
			{
				LOG.log(Level.WARNING, "unable to convert IP address "+ipAddress, e);
			}
		}
		return result;
	} // }}}

	private ShortBlob convertIPv6AddrToShortBlob(String ipAddress) { // {{{
		// create empty byte array of 16 bytes
		byte[] result = new byte[16];

		try {
			InetAddress addr = InetAddress.getByName(ipAddress);
			result = addr.getAddress();
		}
		catch (Exception e) {
			LOG.log(Level.WARNING, "unable to convert IP address " + ipAddress, e);
		}

		return new ShortBlob(result);
	} // }}}

}

// vim: foldmethod=marker wrap
