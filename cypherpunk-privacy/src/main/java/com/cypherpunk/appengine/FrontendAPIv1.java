package com.cypherpunk.appengine;

// {{{ import
import static com.google.appengine.api.urlfetch.FetchOptions.Builder.*;

import com.cypherpunk.appengine.beans.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Transaction;

import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheService.SetPolicy;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

import com.google.appengine.api.utils.SystemProperty;
import com.google.appengine.api.urlfetch.HTTPHeader;
import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.URLFetchService;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.JsonParseException;
// }}}

@SuppressWarnings("serial")
public class FrontendAPIv1 extends HttpServlet
{
	// {{{ get appengine API instances
	private static final DatastoreService DS = DatastoreServiceFactory.getDatastoreService();
	private static final MemcacheService mc = MemcacheServiceFactory.getMemcacheService();
	private static final Logger LOG = Logger.getLogger(FrontendAPIv1.class.getName());
	// }}}
	// {{{ static constants
	private static final int LOCATION_LIST_CACHE_PERIOD = 90;
	private static final int REGION_MAP_CACHE_PERIOD = (86400 * 7);
	private static final String BACKEND_HOSTNAME_PRODUCTION = "https://red-dragon.cypherpunk.network";
	private static final String BACKEND_HOSTNAME_DEVELOPMENT = "https://red-dragon.cypherpunk.network";
	// }}}

	private static final class BackendResponseCache // {{{
	{
		private static final String KIND = "BackendResponseCache";
		private static final String BACKEND_URL = "backend_url";
		private static final String BACKEND_RESPONSE = "backend_response";
	} // }}}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		// {{{ init
		// init gson
		Gson gson = new Gson();

		// autodetect locale from Accept-Language http request header
		Locale langLocale = req.getLocale();

		// get appengine IP based geo-location 2 letter country code
		GeoLocationDB ipdb = new GeoLocationDB();
		String reqIP = req.getRemoteAddr();
		String geoCountryCode = ipdb.getCountry(reqIP);
		if (geoCountryCode == null || geoCountryCode == "ZZ")
			geoCountryCode = "IS";

		// set content type
		res.setContentType("application/json; charset=UTF-8");

		// get response writer
		PrintWriter out = res.getWriter();

		// get request URL
		String reqURI = req.getRequestURI().toString();

		boolean forceUpdate = false;
		if (req.getParameter("forceUpdate") != null)
			forceUpdate = true;

		// get URI after /api/v1 for apiMethod
		String apiMethod = reqURI.substring( "/api/v1".length(), reqURI.length() );
		LOG.log(Level.WARNING, "reqURI is "+reqURI);
		LOG.log(Level.WARNING, "apiMethod is "+apiMethod);
		// }}}
		if (apiMethod.startsWith("/location/list")) // {{{
		{
			String frontendJsonString;
			Map<String,Object> backendResponse = getBackendData(apiMethod, LOCATION_LIST_CACHE_PERIOD, forceUpdate);

			if (backendResponse == null)
			{
				res.sendError(res.SC_NOT_FOUND);
				return;
			}

			frontendJsonString = gson.toJson(backendResponse);

			out.println(frontendJsonString);
		} //}}}
	/*
		else if (apiMethod.compareTo("foo2") == 0) // {{{
		{
			// use requested country, or if none specified, default to user's geo-located IP address country
			String countryCode = req.getParameter("country");
			if (countryCode == null)
				countryCode = geoCountryCode;

			// {{{ fetch first data
			Map<String,Object> backendResponse = getBackendData("/api/foo2/first/" + countryCode, BUY_FOO_CACHE_PERIOD, forceUpdate);
			String sponsoredListing = null;

			if (backendResponse != null)
			{
				try
				{
					Map firstResults = (Map)backendResponse.get("data");
					sponsoredListing = (String)firstResults.get(countryCode);
				}
				catch (Exception ignored)
				{
					sponsoredListing = "";
				}
			} // }}}
			// {{{ fetch second data
			backendResponse = getBackendData("/api/foo2/secondsByType/" + countryCode, BUY_FOO_CACHE_PERIOD, forceUpdate);
			ArrayList localListings = null;

			if (backendResponse != null)
			{
				try
				{
					localListings = (ArrayList)backendResponse.get(countryCode);
				}
				catch (Exception ignored)
				{
				}
			} // }}}

			Foo1FrontendResponse frontendResponse = new Foo1FrontendResponse();
			frontendResponse.setSponsoredListing(sponsoredListing);
			frontendResponse.setLocalListings(localListings);

			// combine language code + location country to get localized country name
			Locale countryLocale = new Locale(langLocale.getLanguage(), countryCode);
			String localizedCountryName = countryLocale.getDisplayCountry(langLocale);
			if (localizedCountryName != null && countryCode != null)
				frontendResponse.setLocation(localizedCountryName, countryCode);

			out.println(gson.toJson(frontendResponse));
		} // }}}
		else if (apiMethod.compareTo("foo3") == 0) // {{{
		{
			// {{{ fetch first data
			Map<String,Object> backendResponse = getBackendData("/api/foo3/first", MINE_FOO_CACHE_PERIOD, forceUpdate);
			Map sponsoredListingMap = null;

			if (backendResponse != null)
			{
				try
				{
					sponsoredListingMap = (Map)backendResponse.get("data");
				}
				catch (Exception ignored)
				{
				}
			} // }}}
			// {{{ fetch second data
			backendResponse = getBackendData("/api/foo3/secondsAll", MINE_FOO_CACHE_PERIOD, forceUpdate);
			Foo2FrontendResponse frontendResponse = new Foo2FrontendResponse();
			Map secondMap = null;

			if (backendResponse != null)
			{
				try
				{
					secondMap = backendResponse;
				}
				catch (Exception ignored)
				{

				}
			} // }}}
			frontendResponse.setSponsoredListingMap(sponsoredListingMap);
			frontendResponse.setListingMap(secondMap);
			out.println(gson.toJson(frontendResponse));
		} // }}}
		else if (apiMethod.compareTo("foo4") == 0) // {{{
		{
			Map countries = new HashMap();

			// create map of localized country name for each country code
			for (String countryCode : Locale.getISOCountries())
			{
				Locale loc = new Locale(langLocale.getLanguage(), countryCode);
				String localizedCountryName = loc.getDisplayCountry(langLocale);
				countries.put(countryCode, localizedCountryName);
			}

			// sort by value
			countries = MapUtil.sortByValue(countries);

			// convert to json and output
			out.println(gson.toJson(countries));
		} // }}}
		else if (apiMethod.compareTo("foo5") == 0) // {{{
		{
			FooListing fooListing = new FooListing();
			String frontendJsonString = "";
			Map<String,Object> backendResponse = getBackendData("/api/foo5", REGION_MAP_CACHE_PERIOD, forceUpdate);

			if (backendResponse != null)
				frontendJsonString = gson.toJson(backendResponse);

			out.println(frontendJsonString);
		} //}}}
		else if (apiMethod.compareTo("secretGeoDatabaseInit") == 0) // {{{
		{
			String chunk = req.getParameter("chunk");
			ipdb.initDatabase(chunk);
			out.println("ok");
		} //}}}
		else if (apiMethod.compareTo("secretGeoDatabaseTest") == 0) // {{{
		{
			String ip = req.getParameter("ip");
			String countryCode = ipdb.getCountry(ip);
			out.println(countryCode);
		} //}}}
	*/
		else // {{{
		{
			res.sendError(res.SC_NOT_FOUND);
		} // }}}
	}
	private Map<String,Object> getBackendData(String apiURI, int secondsToMemcache, boolean forceUpdate) // {{{
	{
		String backendResponse = null;
		String apiURL = "/api/v0" + apiURI;
		Map<String,Object> backendData = null;
		boolean inMemcache = false;
		boolean inDatastore = false;

		// {{{ first check memcache, use apiURL as key
		backendResponse = (String)mc.get(apiURL);
		if (!forceUpdate && backendResponse != null)
		{
			backendData = parseBackendData(backendResponse);
			if (backendData == null)
				LOG.log(Level.WARNING, "Failed parsing memcache backend response for "+apiURL);
			else
				inMemcache = true;
		}
		// }}}
		// {{{ if not in memcache, try querying the datastore
		if (!forceUpdate && backendData == null)
		{
			Key entityKey = KeyFactory.createKey(BackendResponseCache.KIND, apiURL);
			Filter backendURLFilter = new FilterPredicate(Entity.KEY_RESERVED_PROPERTY, FilterOperator.EQUAL, entityKey);
			backendResponse = null;
			Entity result = null;
			try
			{
				Query query = new Query(BackendResponseCache.KIND)
					.setFilter(backendURLFilter);
				PreparedQuery pq = DS.prepare(query);
				result = pq.asSingleEntity();
			}
			catch (Exception e)
			{
				LOG.log(Level.WARNING, e.toString(), e);
				return null;
			}
			if (result != null)
			{
				Text backendResponseText = (Text)result.getProperty(BackendResponseCache.BACKEND_RESPONSE);
				backendResponse = (String)backendResponseText.getValue();
				backendData = parseBackendData(backendResponse);
				if (backendData == null)
					LOG.log(Level.WARNING, "Failed parsing datastore backend response for "+apiURL);
				else
					inDatastore = true;
			}
		}
		//}}}
		// {{{ if not in datastore, try fetch it from backend
		if (backendData == null)
		{
			LOG.log(Level.WARNING, "Fetching data from backend for "+apiURL);
			backendResponse = fetchBackendData(apiURL);
			if (backendResponse != null)
			{
				backendData = parseBackendData(backendResponse);
				if (backendData == null)
					LOG.log(Level.WARNING, "Failed parsing fetched backend response for "+apiURL);
			}
		}
		// }}}
		// {{{ store in memcache for next time
		if (backendResponse != null && backendData != null)
		{
			if (!inMemcache)
			{
				if (forceUpdate)
					mc.put(apiURL, backendResponse, Expiration.byDeltaSeconds(secondsToMemcache), SetPolicy.SET_ALWAYS);
				else
					mc.put(apiURL, backendResponse, Expiration.byDeltaSeconds(secondsToMemcache), SetPolicy.ADD_ONLY_IF_NOT_PRESENT);
			}
			if (!inDatastore)
			{
				Key cacheKey = KeyFactory.createKey(BackendResponseCache.KIND, apiURL);
				Transaction tx = DS.beginTransaction();
				Entity cache = new Entity(cacheKey);
				try
				{
					cache.setProperty(BackendResponseCache.BACKEND_URL, apiURL);
					Text backendResponseText = new Text(backendResponse);
					cache.setProperty(BackendResponseCache.BACKEND_RESPONSE, backendResponseText);
					DS.put(tx, cache);
					tx.commit();
				}
				catch (Exception e)
				{
					LOG.log(Level.WARNING, e.toString(), e);
				}
				finally
				{
					if (tx.isActive())
					{
						tx.rollback();
					}
				}
			}
		}
		// }}}
		return backendData;
	} // }}}
	private Map<String,Object> parseBackendData(String backendResponse) // {{{
	{
		Map<String,Object> backendResponseData = null;
		try // {{{ parse as Json
		{
			backendResponseData = new Gson().fromJson(backendResponse, Map.class);
		}
		catch (JsonSyntaxException e)
		{
			LOG.log(Level.WARNING, e.toString(), e);
			backendResponseData = null;
		} // }}}
		return backendResponseData;
	} // }}}
	private String fetchBackendData(String apiURL) // {{{
	{
		String backendResponse = null;
		// {{{ build URL
		URL backendURL = null;

		// do use TLS in production
		String backendBaseURL = BACKEND_HOSTNAME_PRODUCTION;

		// don't use TLS when using appengine devserver
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			backendBaseURL = BACKEND_HOSTNAME_DEVELOPMENT;
		// return backendURL
		try
		{
			backendURL = new URL(backendBaseURL + apiURL);
		}
		catch (MalformedURLException e)
		{
			backendURL = null;
		}
		// }}}
		// {{{ fetch URL
		URLFetchService urlFetchService = URLFetchServiceFactory.getURLFetchService();
		HTTPRequest request = new HTTPRequest(backendURL, HTTPMethod.GET, withDefaults().setDeadline(9.0));
		HTTPResponse response = null;

		try
		{
			response = urlFetchService.fetch(request);
		}
		catch (Exception e)
		{
			// TODO log error fetching backend
			response = null;
			LOG.log(Level.WARNING, e.toString(), e);
		}
		// }}}
		// {{{ if we got response, convert to UTF-8 string
		if (response != null && response.getResponseCode() == HttpURLConnection.HTTP_OK)
		{
			try
			{
				backendResponse = new String(response.getContent(), "UTF-8");
			}
			catch (UnsupportedEncodingException e)
			{
				LOG.log(Level.WARNING, e.toString(), e);
				backendResponse = null;
			}
		}
		// }}}
		return backendResponse;
	} // }}}
}

// vim: foldmethod=marker wrap
