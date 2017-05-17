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

import org.apache.commons.codec.binary.Base64;

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
	private static final int LOCATION_WORLD_CACHE_PERIOD = (86400 * 7);
	private static final int BLOGGER_API_CACHE_PERIOD = 2; // (60 * 1);

	private static final String BACKEND_HOSTNAME_PRODUCTION = "https://red-dragon.cypherpunk.network";
	private static final String BACKEND_HOSTNAME_DEVELOPMENT = "https://red-dragon.cypherpunk.network";

	private static final String ZENDESK_API_URL = "https://cypherpunk.zendesk.com";
	private static final String ZENDESK_API_USERNAME = "jmaurice@cypherpunk.com/token";
	private static final String ZENDESK_API_PASSWORD = "BoM1TUDKYVKgWpUi2O2rA6jKQ4f89jJGCkpMZJtz";

	private static final String DEFAULT_GEOIP_COUNTRY = "IS";

	private static final String BLOGGER_API_KEY = "AIzaSyBbjWAJoDWKxZ7R8DbIhf3mT595m1f5Tfs";
	private static final String BLOGGER_API_URL = "https://www.googleapis.com/blogger/v3/blogs/";
	private static final String BLOGGER_BLOG_ID = "4561014629041381755";
	private static final String BLOGGER_SUPPORT_ID = "2467816098254238300";
	// }}}

	private static final class CypherpunkResponseCache // {{{
	{
		private static final String KIND = "CypherpunkResponseCache";
		private static final String BACKEND_URL = "cypherpunk_url";
		private static final String BACKEND_RESPONSE = "cypherpunk_response";
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
		boolean useDatastoreForCypherpunk = true;
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

		if (apiPath.equals("/hello")) // {{{
		{
			out.println("hello");
		} // }}}

		else if (apiPath.startsWith("/account/")) // {{{
		{
			String accountApiPath = apiPath.substring( "/account".length(), apiPath.length() );

			if (accountApiPath.equals("/status")) // {{{
			{
				String frontendJsonString;
				String cypherpunkResponse = requestCypherpunkData(HTTPMethod.GET, reqURI, getSafeHeadersFromRequest(req), null);

				if (cypherpunkResponse == null)
				{
					res.sendError(500);
					return;
				}

				frontendJsonString = gson.toJson(cypherpunkResponse);

				out.println(frontendJsonString);
			} //}}}
			else if (accountApiPath.equals("/logout")) // {{{
			{
				res.sendError(500);
			} // }}}
		} // }}}

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
				String bloggerArgs = "&fetchBodies=true&fetchImages=true&view=reader&fields=items(id,published,updated,title,content,images,labels)";

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
				Map<String,Object> bloggerResponse = null;
				String bloggerArgs = "&fetchBodies=true&fetchImages=true&view=reader&fields=id,published,updated,title,content,images,labels";

				// get post ID from request URL
				String postID = blogApiPath.substring( "/post/".length(), blogApiPath.length() );

				if (postID != null && !postID.isEmpty())
				{
					bloggerResponse = getBloggerData(bloggerID, "/posts/" + postID, bloggerArgs, BLOGGER_API_CACHE_PERIOD, useDatastoreForBlogger, forceUpdate);
				}

				if (bloggerResponse == null)
				{
					res.sendError(res.SC_NOT_FOUND);
					return;
				}

				frontendJsonString = gson.toJson(bloggerResponse);
				out.println(frontendJsonString);
			} //}}}
		} //}}}

		else if (apiPath.startsWith("/location/")) // {{{
		{
			String locationApiPath = apiPath.substring( "/location".length(), apiPath.length() );

			if (locationApiPath.equals("/world")) // {{{
			{
				String frontendJsonString;
				Map<String,Object> cypherpunkResponse = getCypherpunkData("/api/v0"+apiPath, LOCATION_WORLD_CACHE_PERIOD, useDatastoreForCypherpunk, forceUpdate);

				if (cypherpunkResponse == null)
				{
					res.sendError(500);
					return;
				}

				frontendJsonString = gson.toJson(cypherpunkResponse);

				out.println(frontendJsonString);
			} //}}}
			else if (locationApiPath.startsWith("/list")) // {{{
			{
				String frontendJsonString;
				Map<String,Object> cypherpunkResponse = getCypherpunkData("/api/v0"+apiPath, LOCATION_LIST_CACHE_PERIOD, useDatastoreForCypherpunk, forceUpdate);

				if (cypherpunkResponse == null)
				{
					res.sendError(500);
					return;
				}

				frontendJsonString = gson.toJson(cypherpunkResponse);

				out.println(frontendJsonString);
			} //}}}
		} //}}}

		else if (apiPath.startsWith("/network/")) // {{{
		{
			String networkApiPath = apiPath.substring( "/network".length(), apiPath.length() );

			if (networkApiPath.equals("/status")) // {{{
			{
				String countryCode = ipdb.getCountry(reqIP);
				out.println("{\"ip\": \"" + reqIP + "\", \"country\": \"" + countryCode + "\"}");
			} //}}}
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

		if (apiPath.startsWith("/hello")) // {{{
		{
			out.println("hello");
		} // }}}

		else if (apiPath.startsWith("/account/")) // {{{
		{
			String accountApiPath = apiPath.substring( "/account".length(), apiPath.length() );

			if (accountApiPath.equals("/authenticate/password")) // {{{
			{
				String frontendJsonString;
				String cypherpunkResponse = requestCypherpunkData(HTTPMethod.POST, reqURI, null, null);

				if (cypherpunkResponse == null)
				{
					res.sendError(500);
					return;
				}

				frontendJsonString = gson.toJson(cypherpunkResponse);

				out.println(frontendJsonString);
			} //}}}
			else if (accountApiPath.equals("/authenticate/userpasswd")) // {{{
			{
				String frontendJsonString;
				String cypherpunkResponse = requestCypherpunkData(HTTPMethod.POST, reqURI, null, null);

				if (cypherpunkResponse == null)
				{
					res.sendError(500);
					return;
				}

				frontendJsonString = gson.toJson(cypherpunkResponse);

				out.println(frontendJsonString);
			} //}}}

			else if (accountApiPath.equals("/confirm/email")) // {{{
			{
				res.sendError(500);
			} // }}}

			else if (accountApiPath.equals("/register/signup")) // {{{
			{
				res.sendError(500);
			} // }}}

			else if (accountApiPath.equals("/source/add")) // {{{
			{
				res.sendError(500);
			} // }}}
			else if (accountApiPath.equals("/source/default")) // {{{
			{
				res.sendError(500);
			} // }}}

			else if (accountApiPath.equals("/purchase/stripe")) // {{{
			{
				res.sendError(500);
			} // }}}
			else if (accountApiPath.equals("/purchase/amazon")) // {{{
			{
				res.sendError(500);
			} // }}}
			else if (accountApiPath.equals("/purchase/stripe")) // {{{
			{
				res.sendError(500);
			} // }}}
			else if (accountApiPath.equals("/purchase/stripe")) // {{{
			{
				res.sendError(500);
			} // }}}

		} //}}}

		else if (apiPath.startsWith("/zendesk/")) // {{{
		{
			String networkApiPath = apiPath.substring( "/zendesk".length(), apiPath.length() );

			if (networkApiPath.equals("/request/new")) // {{{
			{
				// curl -i https://cypherpunk.zendesk.com/api/v2/tickets.json -X POST -d '{"ticket": {"requester": {"name": "Test Customer", "email": "test18278@wiz.biz"}, "subject": "My printer is on fire!", "comment": { "body": "The smoke is very colorful." } } }' -H 'Content-type: application/json' -u 'jmaurice@cypherpunk.com/token:BoM1TUDKYVKgWpUi2O2rA6jKQ4f89jJGCkpMZJtz'

				// Billing https://cypherpunk.zendesk.com/groups/33432807
				// Business Development https://cypherpunk.zendesk.com/groups/42228188
				// Customer Support https://cypherpunk.zendesk.com/groups/32425127

				/*
				{
				  "ticket": {
				    "requester": {
				      "name": "The Customer",
				      "email": "thecustomer@domain.com"
				    },
				    "subject": "My printer is on fire!",
				    "comment": {
				      "body": "The smoke is very colorful."
				    }
				  }
				}
				*/

				ZendeskTicket ticket = new ZendeskTicket("test cust", "4518237@wiz.biz", "test ticket", "this is a test ticket request in the zendesk api");

				String authString = ZENDESK_API_USERNAME + ":" + ZENDESK_API_PASSWORD;
				byte[] authBase64 = Base64.encodeBase64(authString.getBytes("utf-8"));
				String authBase64String = new String(authBase64);

				List<HTTPHeader> zendeskAuthHeader = new ArrayList<HTTPHeader>();
				zendeskAuthHeader.add(new HTTPHeader("Authorization", "Basic " + authBase64String));

				String zendeskURI = "/api/v2/tickets.json";
				String zendeskTicketBody = gson.toJson(ticket);
				String zendeskResponse = requestZendeskData(HTTPMethod.POST, zendeskURI, zendeskAuthHeader, zendeskTicketBody);

				out.println(zendeskResponse);
			} // }}}

		} // }}}

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
	private URL buildCypherpunkURL(String cypherpunkURI) // {{{
	{
		URL cypherpunkURL = null;

		try // build cypherpunkURL
		{
			// do use TLS in production
			String cypherpunkBaseURL = BACKEND_HOSTNAME_PRODUCTION;

			// don't use TLS when using appengine devserver
			if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
				cypherpunkBaseURL = BACKEND_HOSTNAME_DEVELOPMENT;

			cypherpunkURL = new URL(cypherpunkBaseURL + cypherpunkURI);
		}
		catch (MalformedURLException e)
		{
			cypherpunkURL = null;
		}
		return cypherpunkURL;
	} // }}}
	private URL buildZendeskURL(String zendeskURI) // {{{
	{
		URL zendeskURL = null;

		try // build zendeskURL
		{
			String zendeskBaseURL = ZENDESK_API_URL;
			zendeskURL = new URL(zendeskBaseURL + zendeskURI);
		}
		catch (MalformedURLException e)
		{
			zendeskURL = null;
		}
		return zendeskURL;
	} // }}}

	private Map<String,Object> getBloggerData(String bloggerID, String bloggerURI, String bloggerArgs, int secondsToMemcache, boolean useDatastore, boolean forceUpdate) // {{{
	{
		URL bloggerURL = buildBloggerURL(bloggerID, bloggerURI, bloggerArgs);
		return getData(bloggerURL, secondsToMemcache, useDatastore, forceUpdate);
	} // }}}
	private Map<String,Object> getCypherpunkData(String cypherpunkURI, int secondsToMemcache, boolean useDatastore, boolean forceUpdate) // {{{
	{
		URL cypherpunkURL = buildCypherpunkURL(cypherpunkURI);
		return getData(cypherpunkURL, secondsToMemcache, useDatastore, forceUpdate);
	} // }}}
	private Map<String,Object> getZendeskData(String zendeskURI, int secondsToMemcache, boolean useDatastore, boolean forceUpdate) // {{{
	{
		URL zendeskURL = buildZendeskURL(zendeskURI);
		return getData(zendeskURL, secondsToMemcache, useDatastore, forceUpdate);
	} // }}}

	private Map<String,Object> getData(URL apiURL, int secondsToMemcache, boolean useDatastore, boolean forceUpdate) // {{{
	{
		String response = null;
		Map<String,Object> responseData = null;
		boolean inMemcache = false;
		boolean inDatastore = false;

		// {{{ first check memcache, use apiURL as key
		response = (String)mc.get(apiURL);
		if (!forceUpdate && response != null)
		{
			responseData = parseJsonData(response);
			if (responseData == null)
				LOG.log(Level.WARNING, "Failed parsing memcache cypherpunk response for "+apiURL);
			else
				inMemcache = true;
		}
		// }}}
		// {{{ if not in memcache, try querying the datastore
		if (useDatastore && !forceUpdate && responseData == null)
		{
			Key entityKey = KeyFactory.createKey(CypherpunkResponseCache.KIND, apiURL.toString());
			Filter cypherpunkURLFilter = new FilterPredicate(Entity.KEY_RESERVED_PROPERTY, FilterOperator.EQUAL, entityKey);
			response = null;
			Entity result = null;
			try
			{
				Query query = new Query(CypherpunkResponseCache.KIND)
					.setFilter(cypherpunkURLFilter);
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
				Text responseText = (Text)result.getProperty(CypherpunkResponseCache.BACKEND_RESPONSE);
				response = (String)responseText.getValue();
				responseData = parseJsonData(response);
				if (responseData == null)
					LOG.log(Level.WARNING, "Failed parsing datastore cypherpunk response for "+apiURL);
				else
					inDatastore = true;
			}
		}
		//}}}
		// {{{ if not in datastore, try request it from cypherpunk
		if (responseData == null)
		{
			LOG.log(Level.WARNING, "Fetching data from cypherpunk for "+apiURL);

			response = requestDataAsString(HTTPMethod.GET, apiURL, null, null);
			if (response != null)
			{
				responseData = parseJsonData(response);
				if (responseData == null)
					LOG.log(Level.WARNING, "Failed parsing requested cypherpunk response for "+apiURL);
			}
		}
		// }}}
		// {{{ store in memcache/datastore for next time
		if (response != null && responseData != null)
		{
			if (!inMemcache)
			{
				if (forceUpdate)
					mc.put(apiURL, response, Expiration.byDeltaSeconds(secondsToMemcache), SetPolicy.SET_ALWAYS);
				else
					mc.put(apiURL, response, Expiration.byDeltaSeconds(secondsToMemcache), SetPolicy.ADD_ONLY_IF_NOT_PRESENT);
			}
			if (useDatastore && !inDatastore)
			{
				Key cacheKey = KeyFactory.createKey(CypherpunkResponseCache.KIND, apiURL.toString());
				Transaction tx = DS.beginTransaction();
				Entity cache = new Entity(cacheKey);
				try
				{
					cache.setProperty(CypherpunkResponseCache.BACKEND_URL, apiURL);
					Text responseText = new Text(response);
					cache.setProperty(CypherpunkResponseCache.BACKEND_RESPONSE, responseText);
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

		return responseData;
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

	private String requestBloggerData(HTTPMethod requestMethod, String bloggerURI, List<HTTPHeader> headers, String body) // {{{
	{
		URL bloggerURL = buildCypherpunkURL(bloggerURI);
		return requestDataAsString(requestMethod, bloggerURL, headers, body);
	} // }}}
	private String requestCypherpunkData(HTTPMethod requestMethod, String cypherpunkURI, List<HTTPHeader> headers, String body) // {{{
	{
		URL cypherpunkURL = buildCypherpunkURL(cypherpunkURI);
		return requestDataAsString(requestMethod, cypherpunkURL, headers, body);
	} // }}}
	private String requestZendeskData(HTTPMethod requestMethod, String zendeskURI, List<HTTPHeader> headers, String body) // {{{
	{
		URL zendeskURL = buildZendeskURL(zendeskURI);
		String zendeskResponse = null;
		HTTPResponse response = requestData(requestMethod, zendeskURL, headers, body);
		//LOG.log(Level.WARNING, "zendesk request body: " + body);
		LOG.log(Level.WARNING, "zendesk response code: " + response.getResponseCode());
		// {{{ if we got response, convert to UTF-8 string
		if (response != null)
		{
			try
			{
				zendeskResponse = new String(response.getContent(), "UTF-8");
			}
			catch (UnsupportedEncodingException e)
			{
				LOG.log(Level.WARNING, e.toString(), e);
				zendeskResponse = null;
			}
		}
		// }}}
		return zendeskResponse;
	} // }}}

	private String requestDataAsString(HTTPMethod requestMethod, URL cypherpunkURL, List<HTTPHeader> headers, String body) // {{{
	{
		String cypherpunkResponse = null;
		HTTPResponse response = requestData(requestMethod, cypherpunkURL, headers, body);
		// {{{ if we got response, convert to UTF-8 string
		if (response != null && (response.getResponseCode() == HttpURLConnection.HTTP_OK || response.getResponseCode() == HttpURLConnection.HTTP_CREATED))
		{
			try
			{
				cypherpunkResponse = new String(response.getContent(), "UTF-8");
			}
			catch (UnsupportedEncodingException e)
			{
				LOG.log(Level.WARNING, e.toString(), e);
				cypherpunkResponse = null;
			}
		}
		// }}}
		return cypherpunkResponse;
	} // }}}
	private HTTPResponse requestData(HTTPMethod requestMethod, URL cypherpunkURL, List<HTTPHeader> headers, String body) // {{{
	//throws IOException, UnsupportedEncodingException
	{
		URLFetchService urlFetchService = URLFetchServiceFactory.getURLFetchService();
		HTTPRequest request = new HTTPRequest(cypherpunkURL, requestMethod, withDefaults().setDeadline(9.0));

		HTTPResponse response = null;

		try
		{
			if (headers != null)
				for (HTTPHeader header : headers)
					request.setHeader(header);

			if (body != null)
			{
				request.setHeader(new HTTPHeader("Content-type", "application/json"));
				request.setPayload(body.getBytes("UTF-8"));
			}

			response = urlFetchService.fetch(request);
		}
		catch (Exception e)
		{
			// TODO log error requesting
			response = null;
			LOG.log(Level.WARNING, e.toString(), e);
		}
		return response;
	} // }}}

}

// vim: foldmethod=marker wrap
