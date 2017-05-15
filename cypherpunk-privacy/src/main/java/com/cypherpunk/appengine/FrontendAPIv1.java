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
	private static final int LOCATION_LIST_CACHE_PERIOD = (60 * 10);
	private static final int REGION_MAP_CACHE_PERIOD = (86400 * 7);
	private static final int BLOGGER_API_CACHE_PERIOD = (60 * 1);

	private static final String BACKEND_HOSTNAME_PRODUCTION = "https://red-dragon.cypherpunk.network";
	private static final String BACKEND_HOSTNAME_DEVELOPMENT = "https://red-dragon.cypherpunk.network";

	private static final String DEFAULT_GEOIP_COUNTRY = "IS";

	private static final String BLOGGER_API_KEY = "AIzaSyBbjWAJoDWKxZ7R8DbIhf3mT595m1f5Tfs";
	private static final String BLOGGER_API_URL = "https://www.googleapis.com/blogger/v3/blogs/";
	private static final String BLOGGER_BLOG_ID = "4561014629041381755";
	private static final String BLOGGER_SUPPORT_ID = "2467816098254238300";
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
		//Gson gson = new GsonBuilder().disableHtmlEscaping().create();
		Gson gson = new Gson();

		// autodetect locale from Accept-Language http request header
		Locale langLocale = req.getLocale();

		// get request source IP
		String reqIP = req.getRemoteAddr();

		// get country of source IP in GeoLocationDB
		GeoLocationDB ipdb = new GeoLocationDB();
		String geoCountryCode = ipdb.getCountry(reqIP);
		if (geoCountryCode == null || geoCountryCode == "ZZ")
			geoCountryCode = DEFAULT_GEOIP_COUNTRY;

		// set content type
		res.setContentType("application/json; charset=UTF-8");

		// get response writer
		PrintWriter out = res.getWriter();

		// get request URL
		String reqURI = req.getRequestURI().toString();

		// settings to use datastore
		boolean useDatastoreForBackend = true;
		boolean useDatastoreForBlogger = false;

		// flag to force update of datastore/memcache
		boolean forceUpdate = false;
		if (req.getParameter("forceUpdate") != null)
			forceUpdate = true;

		// get URI after /api/v1 for apiPath
		String apiPath = reqURI.substring( "/api/v1".length(), reqURI.length() );
		//LOG.log(Level.WARNING, "reqURI is "+reqURI);
		//LOG.log(Level.WARNING, "apiPath is "+apiPath);
		// }}}

		if (apiPath.startsWith("/hello")) // {{{
		{
			out.println("hello");
		} // }}}

		// account
		else if (apiPath.equals("/account/status")) // {{{
		{
			String frontendJsonString;
			String backendResponse = fetchBackendData(HTTPMethod.GET, reqURI, getSafeHeadersFromRequest(req));

			if (backendResponse == null)
			{
				res.sendError(503);
				return;
			}

			frontendJsonString = gson.toJson(backendResponse);

			out.println(frontendJsonString);
		} //}}}

		// blog
		else if (apiPath.startsWith("/blog/") || apiPath.startsWith("/support/")) // {{{
		{
			// get blog content depending on request URL
			String bloggerID = "";
			String blogApiPath = "";

			if (apiPath.startsWith("/blog"))
			{
				bloggerID = BLOGGER_BLOG_ID;
				blogApiPath = apiPath.substring( "/blog".length(), apiPath.length() );
			}
			else if (apiPath.startsWith("/support"))
			{
				bloggerID = BLOGGER_SUPPORT_ID;
				blogApiPath = apiPath.substring( "/support".length(), apiPath.length() );
			}

			if (blogApiPath.equals("/posts")) // {{{
			{
				String frontendJsonString = null;

				// parse args
				String pageToken = req.getParameter("pageToken");
				String bloggerArgs = "&fetchBodies=true&fetchImages=true&view=reader";

				if (pageToken != null && !pageToken.isEmpty())
				{
					bloggerArgs += "&pageToken=" + Integer.parseInt(pageToken); // parse as int to prevent injection attack
				}

				Map<String,Object> bloggerResponse = getBloggerData(bloggerID, "/posts", bloggerArgs, BLOGGER_API_CACHE_PERIOD, useDatastoreForBlogger, forceUpdate);
				frontendJsonString = gson.toJson(bloggerResponse);
				out.println(frontendJsonString);
			} //}}}
			else if (blogApiPath.startsWith("/post/")) // {{{
			{
				String frontendJsonString = null;

				// get post ID from request URL
				String postID = blogApiPath.substring( "/post/".length(), blogApiPath.length() );

				// parse args
				String bloggerArgs = "&fetchBodies=true&fetchImages=true&view=reader";

				Map<String,Object> bloggerResponse = getBloggerData(bloggerID, "/posts/" + postID, bloggerArgs, BLOGGER_API_CACHE_PERIOD, useDatastoreForBlogger, forceUpdate);

				if (bloggerResponse == null)
				{
					res.sendError(res.SC_NOT_FOUND);
					return;
				}

				frontendJsonString = gson.toJson(bloggerResponse);
				out.println(frontendJsonString);
			} //}}}
		} //}}}

		// location
		else if (apiPath.startsWith("/location/list")) // {{{
		{
			String frontendJsonString;
			Map<String,Object> backendResponse = getBackendData(apiPath, LOCATION_LIST_CACHE_PERIOD, useDatastoreForBackend, forceUpdate);

			if (backendResponse == null)
			{
				res.sendError(res.SC_NOT_FOUND);
				return;
			}

			frontendJsonString = gson.toJson(backendResponse);

			out.println(frontendJsonString);
		} //}}}

		// network
		else if (apiPath.equals("/network/status")) // {{{
		{
			String countryCode = ipdb.getCountry(reqIP);
			out.println("{\"ip\": \"" + reqIP + "\", \"country\": \"" + countryCode + "\"}");
		} //}}}

		else if (apiPath.equals("secretGeoDatabaseInit")) // {{{
		{
			String chunk = req.getParameter("chunk");
			ipdb.initDatabase(chunk);
			out.println("ok");
		} //}}}
		else if (apiPath.equals("secretGeoDatabaseTest")) // {{{
		{
			String ip = req.getParameter("ip");
			String countryCode = ipdb.getCountry(ip);
			out.println(countryCode);
		} //}}}

		else // {{{ 404
		{
			res.sendError(res.SC_NOT_FOUND);
		} // }}}
	}

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
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
			geoCountryCode = DEFAULT_GEOIP_COUNTRY;

		// set content type
		res.setContentType("application/json; charset=UTF-8");

		// get response writer
		PrintWriter out = res.getWriter();

		// get request URL
		String reqURI = req.getRequestURI().toString();

		boolean forceUpdate = false;
		if (req.getParameter("forceUpdate") != null)
			forceUpdate = true;

		// get URI after /api/v1 for apiPath
		String apiPath = reqURI.substring( "/api/v1".length(), reqURI.length() );
		//LOG.log(Level.WARNING, "reqURI is "+reqURI);
		//LOG.log(Level.WARNING, "apiPath is "+apiPath);
		// }}}

		// account
		if (apiPath.equals("/account/authenticate/password")) // {{{
		{
			String frontendJsonString;
			String backendResponse = fetchBackendData(HTTPMethod.POST, reqURI, null);

			if (backendResponse == null)
			{
				res.sendError(res.SC_NOT_FOUND);
				return;
			}

			frontendJsonString = gson.toJson(backendResponse);

			out.println(frontendJsonString);
		} //}}}

		else // {{{ 404
		{
			res.sendError(res.SC_NOT_FOUND);
		} // }}}
	}

	private List<HTTPHeader> getSafeHeadersFromRequest(HttpServletRequest req) // {{{
	{
		List<HTTPHeader> headers = new ArrayList<HTTPHeader>();
		String safeHeaders[] = {
			"Cookie"
		};

		for (String headerName : safeHeaders)
			if (req.getHeader(headerName) != null)
				headers.add(new HTTPHeader(headerName, req.getHeader(headerName)));

		return headers;
	} // }}}

	private URL buildBloggerURL(String bloggerID, String bloggerURI, String bloggerArgs) // {{{
	{
		URL bloggerURL = null;
		String bloggerArgsBase = "?key=" + BLOGGER_API_KEY;

		try // build API request URL
		{
			bloggerURL = new URL(BLOGGER_API_URL + bloggerID + bloggerURI + bloggerArgsBase + bloggerArgs);
		}
		catch (MalformedURLException e)
		{
			bloggerURL = null;
			return null;
		}
		return bloggerURL;
	} // }}}
	private URL buildBackendURL(String backendURI) // {{{
	{
		URL backendURL = null;

		try // build backendURL
		{
			// do use TLS in production
			String backendBaseURL = BACKEND_HOSTNAME_PRODUCTION;

			// don't use TLS when using appengine devserver
			if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
				backendBaseURL = BACKEND_HOSTNAME_DEVELOPMENT;

			backendURL = new URL(backendBaseURL + backendURI);
		}
		catch (MalformedURLException e)
		{
			backendURL = null;
		}
		return backendURL;
	} // }}}

	private Map<String,Object> getBackendData(String backendURI, int secondsToMemcache, boolean useDatastore, boolean forceUpdate) // {{{
	{
		URL backendURL = buildBackendURL(backendURI);
		return getData(backendURL, secondsToMemcache, useDatastore, forceUpdate);
	} // }}}
	private Map<String,Object> getBloggerData(String bloggerID, String bloggerURI, String bloggerArgs, int secondsToMemcache, boolean useDatastore, boolean forceUpdate) // {{{
	{
		URL bloggerURL = buildBloggerURL(bloggerID, bloggerURI, bloggerArgs);
		return getData(bloggerURL, secondsToMemcache, useDatastore, forceUpdate);
	} // }}}
	private Map<String,Object> getData(URL apiURL, int secondsToMemcache, boolean useDatastore, boolean forceUpdate) // {{{
	{
		String backendResponse = null;
		Map<String,Object> backendData = null;
		boolean inMemcache = false;
		boolean inDatastore = false;

		// {{{ first check memcache, use apiURL as key
		backendResponse = (String)mc.get(apiURL);
		if (!forceUpdate && backendResponse != null)
		{
			backendData = parseJsonData(backendResponse);
			if (backendData == null)
				LOG.log(Level.WARNING, "Failed parsing memcache backend response for "+apiURL);
			else
				inMemcache = true;
		}
		// }}}
		// {{{ if not in memcache, try querying the datastore
		if (useDatastore && !forceUpdate && backendData == null)
		{
			Key entityKey = KeyFactory.createKey(BackendResponseCache.KIND, apiURL.toString());
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
				backendData = parseJsonData(backendResponse);
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

			backendResponse = fetchData(HTTPMethod.GET, apiURL, null);
			if (backendResponse != null)
			{
				backendData = parseJsonData(backendResponse);
				if (backendData == null)
					LOG.log(Level.WARNING, "Failed parsing fetched backend response for "+apiURL);
			}
		}
		// }}}
		// {{{ store in memcache/datastore for next time
		if (backendResponse != null && backendData != null)
		{
			if (!inMemcache)
			{
				if (forceUpdate)
					mc.put(apiURL, backendResponse, Expiration.byDeltaSeconds(secondsToMemcache), SetPolicy.SET_ALWAYS);
				else
					mc.put(apiURL, backendResponse, Expiration.byDeltaSeconds(secondsToMemcache), SetPolicy.ADD_ONLY_IF_NOT_PRESENT);
			}
			if (useDatastore && !inDatastore)
			{
				Key cacheKey = KeyFactory.createKey(BackendResponseCache.KIND, apiURL.toString());
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

	private Map<String,Object> parseJsonData(String jsonRaw) // {{{
	{
		Map<String,Object> jsonData = null;
		try // {{{ parse as Json
		{
			jsonData = new Gson().fromJson(jsonRaw, Map.class);
		}
		catch (JsonSyntaxException e)
		{
			LOG.log(Level.WARNING, e.toString(), e);
			jsonData = null;
		} // }}}
		return jsonData;
	} // }}}

	private String fetchBloggerData(HTTPMethod fetchMethod, String bloggerURI, List<HTTPHeader> headers) // {{{
	{
		URL bloggerURL = buildBackendURL(bloggerURI);
		return fetchData(fetchMethod, bloggerURL, headers);
	} // }}}
	private String fetchBackendData(HTTPMethod fetchMethod, String backendURI, List<HTTPHeader> headers) // {{{
	{
		URL backendURL = buildBackendURL(backendURI);
		return fetchData(fetchMethod, backendURL, headers);
	} // }}}
	private String fetchData(HTTPMethod fetchMethod, URL backendURL, List<HTTPHeader> headers) // {{{
	//throws IOException, UnsupportedEncodingException
	{
		String backendResponse = null;
		// {{{ fetch URL
		URLFetchService urlFetchService = URLFetchServiceFactory.getURLFetchService();
		HTTPRequest request = new HTTPRequest(backendURL, fetchMethod, withDefaults().setDeadline(9.0));

		if (headers != null)
			for (HTTPHeader header : headers)
				request.setHeader(header);

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
