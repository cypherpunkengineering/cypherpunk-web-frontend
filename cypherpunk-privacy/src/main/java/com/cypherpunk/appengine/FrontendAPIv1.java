package com.cypherpunk.appengine;

// {{{ import
import static com.google.appengine.api.urlfetch.FetchOptions.Builder.*;

import com.cypherpunk.appengine.beans.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.MalformedURLException;
import java.util.Arrays;
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
	// google cache should be >61 seconds and < 1 week
	private static final int LOCATION_WORLD_CACHE_PERIOD = (60 * 60 * 1);
	private static final int LOCATION_LIST_CACHE_PERIOD = 69; // (60 * 10);
	private static final int APP_VERSIONS_API_CACHE_PERIOD = 69; // (60 * 2);
	private static final int BLOGGER_API_CACHE_PERIOD = 69; // (60 * 2);
	private static final int PRICING_PLANS_CACHE_PERIOD = 69; // (60 * 10);

	private static final double REQUEST_DEADLINE = 15.0;

	private static final String FRONTEND_HOSTNAME_PRODUCTION = "cypherpunk.privacy.network";
	private static final String FRONTEND_HOSTNAME_DEVELOPMENT = "test-api.cypherpunk.engineering";

	private static final String BACKEND_HOSTNAME_PRODUCTION = "https://red-dragon.cypherpunk.network";
	private static final String BACKEND_HOSTNAME_DEVELOPMENT = "https://red-dragon.cypherpunk.engineering";
	private static final String BACKEND_HOSTNAME_DEVSERVER = "http://127.0.0.1:11080";

	private static final String ZENDESK_API_URL = "https://cypherpunk.zendesk.com";
	private static final String ZENDESK_API_USERNAME = "jmaurice@cypherpunk.com/token";
	private static final String ZENDESK_API_PASSWORD = "BoM1TUDKYVKgWpUi2O2rA6jKQ4f89jJGCkpMZJtz";

	private static final String DEFAULT_GEOIP_COUNTRY = "IS";

	private static final String BLOGGER_API_KEY = "AIzaSyBbjWAJoDWKxZ7R8DbIhf3mT595m1f5Tfs";
	private static final String BLOGGER_API_URL = "https://www.googleapis.com/blogger/v3/blogs/";
	private static final String BLOGGER_BLOG_ID = "4561014629041381755";
	private static final String BLOGGER_SUPPORT_ID = "2467816098254238300";

	// init gson
	//Gson gson = new GsonBuilder().disableHtmlEscaping().create();
	public static final Gson gson = new Gson();
	// }}}

	private static final class CypherpunkResponseCache // {{{
	{
		private static final String KIND = "CypherpunkResponseCache";
		private static final String BACKEND_URL = "cypherpunk_url";
		private static final String BACKEND_RESPONSE = "cypherpunk_response";
	} // }}}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res)
	throws IOException
	{
		// {{{ init
		// autodetect locale from Accept-Language http request header
		Locale langLocale = req.getLocale();

		// get request source IP
		String reqIP = req.getRemoteAddr();

		// get country of source IP in GeoLocationDB
		GeoLocationDB ipdb = new GeoLocationDB();
		String geoCountryCode = ipdb.getCountry(reqIP);
		if (geoCountryCode == null || geoCountryCode == "ZZ")
			geoCountryCode = DEFAULT_GEOIP_COUNTRY;

		// set default cache headers
		setResponsePrivateCacheHeaders(res, 0);

		// set content type
		res.setContentType("application/json; charset=UTF-8");

		// get request URL
		String reqURI = req.getRequestURI().toString();

		// get query string
		String queryString = req.getQueryString();

		// settings to use datastore
		boolean useCacheForCypherpunk = true;
		boolean useCacheForBlogger = false;
		boolean isDevelopment = isDevelopmentMode(req);
		if (isDevelopment)
		{
			useCacheForCypherpunk = false;
			useCacheForBlogger = false;
		}

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
			res.getWriter().println("hello");
		} // }}}
		else if (apiPath.startsWith("/app")) // {{{
		{
			String appApiPath = apiPath.substring( "/app".length(), apiPath.length() );

			if (appApiPath.startsWith("/versions")) // {{{
			{
				String versionsFlavor = "default";
				try
				{
					versionsFlavor = appApiPath.substring( "/versions/".length(), appApiPath.length() );
				}
				catch (Exception e)
				{
					versionsFlavor = "default";
				}

				CypherpunkAppVersions versions = new CypherpunkAppVersions(versionsFlavor);
				setResponsePublicCacheHeaders(res, APP_VERSIONS_API_CACHE_PERIOD);
				sendResponse(res, versions);
			} // }}}
		} // }}}
		else if (apiPath.startsWith("/account")) // {{{
		{
			String accountApiPath = apiPath.substring( "/account".length(), apiPath.length() );

			if (accountApiPath.equals("/status")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.GET, "/api/v0" + apiPath, null, CypherpunkAccountStatus.class);
			} //}}}
			else if (accountApiPath.equals("/source/list")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.GET, "/api/v0" + apiPath, null, CypherpunkAccountSourceList.class);
			} //}}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}
		} // }}}
		else if (apiPath.startsWith("/billing")) // {{{
		{
			String billingApiPath = apiPath.substring( "/billing".length(), apiPath.length() );

			if (billingApiPath.equals("/receipts")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.GET, "/api/v0" + apiPath, null, CypherpunkBillingReceipts.class);
			} //}}}
			else if (billingApiPath.equals("/source/list")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.GET, "/api/v0" + apiPath, null, CypherpunkAccountSourceList.class);
			} //}}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}
		} // }}}
		else if (apiPath.startsWith("/blog") || apiPath.startsWith("/support")) // {{{
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

			if (blogApiPath.equals("/index")) // {{{
			{
				String frontendJsonString = null;

				// parse args
				String pageToken = req.getParameter("pageToken");
				String bloggerArgs = "&fetchBodies=false&fetchImages=false&view=reader&fields=items(id,published,updated,title,labels)";

				if (pageToken != null && !pageToken.isEmpty())
				{
					bloggerArgs += "&pageToken=" + Integer.parseInt(pageToken); // parse as int to prevent injection attack
				}

				Map<String,Object> bloggerResponse = getCachedBloggerData(bloggerID, "/posts", bloggerArgs, BLOGGER_API_CACHE_PERIOD, useCacheForBlogger, forceUpdate);
				if (!forceUpdate)
					setResponsePublicCacheHeaders(res, BLOGGER_API_CACHE_PERIOD);
				frontendJsonString = gson.toJson(bloggerResponse);
				res.getWriter().println(frontendJsonString);
			} //}}}
			else if (blogApiPath.equals("/posts")) // {{{
			{
				String frontendJsonString = null;

				// parse args
				String pageToken = req.getParameter("pageToken");
				String bloggerArgs = "&fetchBodies=true&fetchImages=true&view=reader&fields=items(id,published,updated,title,content,images,labels)";

				if (pageToken != null && !pageToken.isEmpty())
				{
					bloggerArgs += "&pageToken=" + Integer.parseInt(pageToken); // parse as int to prevent injection attack
				}

				Map<String,Object> bloggerResponse = getCachedBloggerData(bloggerID, "/posts", bloggerArgs, BLOGGER_API_CACHE_PERIOD, useCacheForBlogger, forceUpdate);
				if (!forceUpdate)
					setResponsePublicCacheHeaders(res, BLOGGER_API_CACHE_PERIOD);
				frontendJsonString = gson.toJson(bloggerResponse);
				res.getWriter().println(frontendJsonString);
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
					bloggerResponse = getCachedBloggerData(bloggerID, "/posts/" + postID, bloggerArgs, BLOGGER_API_CACHE_PERIOD, useCacheForBlogger, forceUpdate);
				}

				if (bloggerResponse == null)
				{
					res.sendError(404);
					return;
				}

				if (!forceUpdate)
					setResponsePublicCacheHeaders(res, BLOGGER_API_CACHE_PERIOD);
				frontendJsonString = gson.toJson(bloggerResponse);
				res.getWriter().println(frontendJsonString);
			} //}}}
			else // {{{ 404
			{
				res.sendError(404);
			} // }}}
		} //}}}
		else if (apiPath.startsWith("/location")) // {{{
		{
			String locationApiPath = apiPath.substring( "/location".length(), apiPath.length() );

			if (locationApiPath.equals("/world")) // {{{
			{
				String frontendJsonString;
				Map<String,Object> cypherpunkResponse = getCachedCypherpunkData(req, "/api/v0"+apiPath, LOCATION_WORLD_CACHE_PERIOD, useCacheForCypherpunk, forceUpdate);
				if (cypherpunkResponse == null)
				{
					res.sendError(500);
					return;
				}

				frontendJsonString = gson.toJson(cypherpunkResponse);

				if (!forceUpdate)
					setResponsePublicCacheHeaders(res, LOCATION_WORLD_CACHE_PERIOD);
				res.getWriter().println(frontendJsonString);
			} //}}}
			else if (locationApiPath.startsWith("/list")) // {{{
			{
				String frontendJsonString;
				Map<String,Object> cypherpunkResponse = getCachedCypherpunkData(req, "/api/v0"+apiPath, LOCATION_LIST_CACHE_PERIOD, useCacheForCypherpunk, forceUpdate);

				if (cypherpunkResponse == null)
				{
					res.sendError(500);
					return;
				}

				frontendJsonString = gson.toJson(cypherpunkResponse);
				if (!forceUpdate)
					setResponsePublicCacheHeaders(res, LOCATION_LIST_CACHE_PERIOD);
				res.getWriter().println(frontendJsonString);
			} //}}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}
		} //}}}
		else if (apiPath.startsWith("/monitoring")) // {{{
		{
			String monitoringApiPath = apiPath.substring( "/monitoring".length(), apiPath.length() );

			if (monitoringApiPath.equals("/hello")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.GET, "/api/v0" + apiPath, null, CypherpunkMonitoringHello.class);
			} //}}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}
		} //}}}
		else if (apiPath.startsWith("/network")) // {{{
		{
			String networkApiPath = apiPath.substring( "/network".length(), apiPath.length() );

			if (networkApiPath.equals("/status")) // {{{
			{
				String countryCode = ipdb.getCountry(reqIP);
				res.getWriter().println("{\"ip\": \"" + reqIP + "\", \"country\": \"" + countryCode + "\"}");
			} //}}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}
		} //}}}
		else if (apiPath.startsWith("/pricing")) // {{{
		{
			String pricingApiPath = apiPath.substring( "/pricing".length(), apiPath.length() );

			if (pricingApiPath.startsWith("/plans")) // {{{
			{
				String plansApiPath = pricingApiPath.substring( "/plans".length(), pricingApiPath.length() );

				String frontendJsonString;
				Map<String,Object> cypherpunkResponse = getCachedCypherpunkData(req, "/api/v0"+apiPath, PRICING_PLANS_CACHE_PERIOD, useCacheForCypherpunk, forceUpdate);
				if (cypherpunkResponse == null)
				{
					res.sendError(500);
					return;
				}

				frontendJsonString = gson.toJson(cypherpunkResponse);

				if (!forceUpdate)
					setResponsePublicCacheHeaders(res, PRICING_PLANS_CACHE_PERIOD);
				res.getWriter().println(frontendJsonString);
			} // }}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}
		} //}}}
		else if (apiPath.startsWith("/vpn")) // {{{
		{
			String vpnApiPath = apiPath.substring( "/vpn".length(), apiPath.length() );

			if (vpnApiPath.equals("/certificate")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.GET, "/api/v0" + apiPath, null, CypherpunkVpnCertificate.class);
			} //}}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}
		} // }}}
		else if (apiPath.equals("secretGeoDatabaseInit")) // {{{
		{
			String chunk = req.getParameter("chunk");
			ipdb.initDatabase(chunk);
			res.getWriter().println("ok");
		} //}}}
		else if (apiPath.equals("secretGeoDatabaseTest")) // {{{
		{
			String ip = req.getParameter("ip");
			String countryCode = ipdb.getCountry(ip);
			res.getWriter().println(countryCode);
		} //}}}
		else // {{{ 404
		{
			res.sendError(404);
		} // }}}
	}

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	throws IOException
	{
		// {{{ init
		// autodetect locale from Accept-Language http request header
		Locale langLocale = req.getLocale();

		// get appengine IP based geo-location 2 letter country code
		GeoLocationDB ipdb = new GeoLocationDB();
		String reqIP = req.getRemoteAddr();
		String geoCountryCode = ipdb.getCountry(reqIP);
		if (geoCountryCode == null || geoCountryCode == "ZZ")
			geoCountryCode = DEFAULT_GEOIP_COUNTRY;

		// set default cache headers
		setResponsePrivateCacheHeaders(res, 0);

		// set content type
		res.setContentType("application/json; charset=UTF-8");

		// get request URL
		String reqURI = req.getRequestURI().toString();

		// settings to use datastore
		boolean useCacheForCypherpunk = true;
		boolean useCacheForBlogger = false;
		boolean isDevelopment = isDevelopmentMode(req);
		if (isDevelopment)
		{
			useCacheForCypherpunk = false;
			useCacheForBlogger = false;
		}

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
			res.getWriter().println("hello");
		} // }}}
		else if (apiPath.startsWith("/account")) // {{{
		{
			String accountApiPath = apiPath.substring( "/account".length(), apiPath.length() );

			if (accountApiPath.equals("/identify/email")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountIdentifyEmail.class, null);
			} //}}}
			else if (accountApiPath.equals("/authenticate/password")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountAuthenticatePassword.class, CypherpunkAccountStatus.class);
			} //}}}
			else if (accountApiPath.equals("/authenticate/userpasswd")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountAuthenticateUserpasswd.class, CypherpunkAccountStatus.class);
			} //}}}

			else if (accountApiPath.equals("/confirm/email")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountConfirmEmail.class, CypherpunkAccountStatus.class);
			} // }}}
			else if (accountApiPath.equals("/confirm/emailChange")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountConfirmEmail.class, CypherpunkAccountStatus.class);
			} // }}}
			else if (accountApiPath.equals("/confirm/resend")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountRecoverEmail.class, null);
			} // }}}

			else if (accountApiPath.equals("/change/email")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountChangeEmail.class, CypherpunkAccountStatus.class);
			} //}}}
			else if (accountApiPath.equals("/change/password")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountChangePassword.class, CypherpunkAccountStatus.class);
			} //}}}

			else if (accountApiPath.equals("/recover/email")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountRecoverEmail.class, null);
			} // }}}
			else if (accountApiPath.equals("/recover/reset")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountRecoverReset.class, null);
			} // }}}

			else if (accountApiPath.equals("/register/signup")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountRegisterSignup.class, CypherpunkAccountStatus.class);
			} // }}}
			else if (accountApiPath.equals("/register/teaser")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountRegisterTeaser.class, null);
			} // }}}

			else if (accountApiPath.equals("/source/add")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountSourceAdd.class, CypherpunkAccountSourceList.class);
			} // }}}
			else if (accountApiPath.equals("/source/default")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountSourceDefault.class, CypherpunkAccountSourceList.class);
			} // }}}

			else if (accountApiPath.equals("/purchase/stripe")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountPurchaseStripe.class, CypherpunkAccountStatus.class);
			} // }}}
			else if (accountApiPath.equals("/purchase/amazon")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountPurchaseAmazon.class, CypherpunkAccountStatus.class);
			} // }}}

			else if (accountApiPath.equals("/upgrade/stripe")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountUpgradeStripe.class, CypherpunkAccountStatus.class);
			} // }}}
			else if (accountApiPath.equals("/upgrade/amazon")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountUpgradeAmazon.class, CypherpunkAccountStatus.class);
			} // }}}
			else if (accountApiPath.equals("/upgrade/google")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountUpgradeGoogle.class, CypherpunkAccountStatus.class);
			} // }}}
			else if (accountApiPath.equals("/upgrade/apple")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, CypherpunkAccountUpgradeApple.class, CypherpunkAccountStatus.class);
			} // }}}

		else if (accountApiPath.equals("/logout")) // {{{
		{
			proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, null, null);
		} // }}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}

		} //}}}
		else if (apiPath.startsWith("/ipn")) // {{{
		{
			String ipnApiPath = apiPath.substring( "/ipn".length(), apiPath.length() );

			if (ipnApiPath.equals("/amazon")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, Map.class, null);
			} //}}}
			else if (ipnApiPath.equals("/bitpay")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, Map.class, null);
			} //}}}
			else if (ipnApiPath.equals("/paypal")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, Map.class, null);
			} //}}}
			else if (ipnApiPath.equals("/stripe")) // {{{
			{
				proxyRequestToCypherpunkBackend(req, res, HTTPMethod.POST, "/api/v0" + apiPath, Map.class, null);
			} //}}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}
		} //}}}
		else if (apiPath.startsWith("/support")) // {{{
		{
			String networkApiPath = apiPath.substring( "/support".length(), apiPath.length() );

			if (networkApiPath.equals("/request/new")) // {{{
			{
				// {{{ notes
				// curl -i https://cypherpunk.zendesk.com/api/v2/tickets.json -X POST -d '{"ticket": {"requester": {"name": "Test Customer", "email": "test18278@wiz.biz"}, "subject": "My printer is on fire!", "comment": { "body": "The smoke is very colorful." } } }' -H 'Content-type: application/json' -u 'jmaurice@cypherpunk.com/token:BoM1TUDKYVKgWpUi2O2rA6jKQ4f89jJGCkpMZJtz'

				// Billing 33432807
				// Business Development 42228188
				// Customer Support 32425127

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
				// }}}
				CypherpunkZendeskRequest zendeskRequestIn = null;
				ZendeskTicket zendeskRequestOut = null;

				try // parse json body as CypherpunkZendeskRequest
				{
					String reqBody = getBodyFromRequest(req);
					zendeskRequestIn = gson.fromJson(reqBody, CypherpunkZendeskRequest.class);
					zendeskRequestOut = new ZendeskTicket(zendeskRequestIn);
				}
				catch (Exception e)
				{
					LOG.log(Level.WARNING, "Unable to parse CypherpunkZendeskRequest");
					e.printStackTrace();
					res.sendError(400);
					return;
				}

				String authString = ZENDESK_API_USERNAME + ":" + ZENDESK_API_PASSWORD;
				byte[] authBase64 = Base64.encodeBase64(authString.getBytes("UTF-8"));
				String authBase64String = new String(authBase64);

				List<HTTPHeader> zendeskAuthHeader = new ArrayList<HTTPHeader>();
				zendeskAuthHeader.add(new HTTPHeader("Authorization", "Basic " + authBase64String));

				String zendeskURI = "/api/v2/tickets.json";
				String zendeskTicketBody = gson.toJson(zendeskRequestOut);
				String zendeskResponse = requestZendeskData(HTTPMethod.POST, zendeskURI, zendeskAuthHeader, zendeskTicketBody);

				// don't send response unless debugging
				// res.getWriter().println(zendeskResponse);
			} // }}}
			else // {{{ 404
			{
				res.sendError(404);
			} //}}}

		} // }}}
		else // {{{ 404
		{
			res.sendError(404);
		} // }}}
	}

	private boolean isDevelopmentMode(HttpServletRequest req) // {{{
	{
		boolean dev = false;

		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			dev = true;
		if (req.getServerName().equals(FRONTEND_HOSTNAME_DEVELOPMENT))
			dev = true;

		return dev;
	} // }}}

	private void proxyRequestToCypherpunkBackend(HttpServletRequest req, HttpServletResponse res, HTTPMethod reqMethod, String cypherpunkURI, Class incomingRequestBean, Class outgoingRequestResponseBean) // {{{
	throws IOException
	{
		// sanitize json bodies by parsing to JSON bean objects
		Object incomingRequestData = null;
		Object outgoingRequestResponseData = null;
		String sanitizedReqBody = null;
		String queryString = req.getQueryString();
		String reqBody = null;

		if (incomingRequestBean != null)
		{
			try // parse json body of incoming request
			{
				reqBody = getBodyFromRequest(req);
				//LOG.log(Level.WARNING, "Got body: "+reqBody);
				incomingRequestData = gson.fromJson(reqBody, incomingRequestBean);
			}
			catch (Exception e)
			{
				LOG.log(Level.WARNING, "Unable to parse body of incoming request");
				e.printStackTrace();
				res.sendError(400);
				// TODO: send json body as error response
				return;
			}

			// convert sanitized request body back to json and send in outgoing request to backend
			sanitizedReqBody = gson.toJson(incomingRequestData);
		}

		if (reqMethod == HTTPMethod.POST && incomingRequestBean != null && incomingRequestData == null)
		{
			if (req.getHeader("Content-Encoding") != null)
				LOG.log(Level.WARNING, "Content-Encoding is "+req.getHeader("Content-Encoding"));
			if (req.getHeader("Content-Type") != null)
				LOG.log(Level.WARNING, "Content-Type is "+req.getHeader("Content-Type"));
			if (req.getHeader("Content-Length") != null)
				LOG.log(Level.WARNING, "Content-Length is "+req.getHeader("Content-Length"));
			LOG.log(Level.WARNING, "incomingRequestData is null!");
			res.sendError(400);
			return;
		}

		String reqURI = null;
		// TODO: sanitize query string?
		if (queryString != null)
			reqURI = cypherpunkURI + "?" + queryString;
		else
			reqURI = cypherpunkURI;

		HTTPResponse cypherpunkResponse = null;
		if (incomingRequestBean == Map.class)
		{
			// pass original raw body to outgoing request
			cypherpunkResponse = requestData(reqMethod, buildCypherpunkURL(req, reqURI), getSafeHeadersFromRequest(req), reqBody);
		}
		else
		{
			// pass sanitized body to outgoing request
			cypherpunkResponse = requestData(reqMethod, buildCypherpunkURL(req, reqURI), getSafeHeadersFromRequest(req), sanitizedReqBody);
		}

		if (cypherpunkResponse == null) // request failed
		{
			res.sendError(503);
			return;
		}

		// get response code of outgoing request, set on incoming request response
		Integer resCode = cypherpunkResponse.getResponseCode();
		res.setStatus(resCode);

		// pass outgoing request's response's headers
		setResponseHeadersFromBackendResponse(res, cypherpunkResponse);

		String cypherpunkResponseBody = null;
		try // parse json body of outgoing request's response
		{
			if (resCode >= 400)
			{
				cypherpunkResponseBody = getBodyFromResponse(cypherpunkResponse);
				outgoingRequestResponseData = new CypherpunkErrorResponse(resCode, null, cypherpunkResponseBody);
			}
			else if (outgoingRequestResponseBean != null)
			{
				cypherpunkResponseBody = getBodyFromResponse(cypherpunkResponse);
				outgoingRequestResponseData = gson.fromJson(cypherpunkResponseBody, outgoingRequestResponseBean);
			}
		}
		catch (Exception e)
		{
			LOG.log(Level.WARNING, "Unable to parse outgoing request's response json body: "+e.toString());
			LOG.log(Level.WARNING, "Response body: "+cypherpunkResponseBody);
			e.printStackTrace();
			res.sendError(500);
			// TODO: send json body as error response
			return;
		}

		// send default empty response object if no body
		if (outgoingRequestResponseData == null)
			outgoingRequestResponseData = new CypherpunkErrorResponse(resCode);

		// pass sanitized body to incoming request's response
		sendResponse(res, outgoingRequestResponseData);
	} //}}}

	private void sendResponse(HttpServletResponse res, Object nugget) // {{{
	throws IOException
	{
		String jsonString = gson.toJson(nugget);
		res.getWriter().println(jsonString);
		// FIXME unescape JSON encoded HTML entities? ie. & is getting sent as \u0026
	} // }}}
	private void sendResponse(HttpServletResponse res, String str) // {{{
	throws IOException
	{
		res.getWriter().println(str);
	} // }}}

	private Map<String, String> getQueryMap(String query) // {{{
	{
		String[] params = query.split("&");
		Map<String, String> map = new HashMap<String, String>();
		for (String param : params)
		{
			String name = param.split("=")[0];
			String value = param.split("=")[1];
			map.put(name, value);
		}
		return map;
	} // }}}
	private String getBodyFromRequest(HttpServletRequest req) // {{{
	{
		String contentType = req.getHeader("Content-Type");

		if (contentType.equals("application/x-www-form-urlencoded"))
		{
			LOG.log(Level.WARNING, "Parsing as application/x-www-form-urlencoded");
			try // convert to json string
			{
				Map<String, String> map = new HashMap<String,String>();
				Map<String, String[]> parameters = req.getParameterMap();
				for (String key : parameters.keySet())
				{
					String[] values = req.getParameterValues(key);
					if (values != null)
					map.put(key, values[0]);
				}
				String jsonString = gson.toJson(map);
				LOG.log(Level.INFO, "Got json string: "+jsonString);
				return jsonString;
			}
			catch (Exception e)
			{
				e.printStackTrace();
				return null;
			}
		}

		// read request body
		StringBuffer sb = new StringBuffer();
		InputStream inputStream = null;
		BufferedReader reader = null;

		String line = null;
		try
		{
			inputStream = req.getInputStream();
			if (inputStream != null)
			{
				reader = new BufferedReader(new InputStreamReader(inputStream));
				char[] charBuffer = new char[65535];
				int bytesRead = -1;
				while ((bytesRead = reader.read(charBuffer)) > 0)
				{
					sb.append(charBuffer, 0, bytesRead);
				}
			}
			else
			{
				sb.append("");
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			if (reader != null)
			{
				try
				{
					reader.close();
				}
				catch (IOException e)
				{
					LOG.log(Level.WARNING, "Unable to read request body");
					e.printStackTrace();
					return null;
				}
			}
		}

		// convert payload bytes to string
		String reqBody = sb.toString();
		//if (reqBody != null && !reqBody.isEmpty())
		//LOG.log(Level.WARNING, "got payload: "+reqBody);

		return reqBody;
	} // }}}
	private String getBodyFromResponse(HTTPResponse response) // {{{
	{
		String str = null;

		try // if we got response, convert to UTF-8 string
		{
			str = new String(response.getContent(), "UTF-8");
		}
		catch (UnsupportedEncodingException e)
		{
			LOG.log(Level.WARNING, e.toString(), e);
			str = null;
		}
		return str;
	} // }}}

	private List<HTTPHeader> getSafeHeadersFromRequest(HttpServletRequest req) // {{{
	{
		List<HTTPHeader> headers = new ArrayList<HTTPHeader>();
		String safeHeaders[] = {
			"Cookie"
			,"User-Agent"
			,"Stripe-Signature"
		};

		// copy headers in "safe" list above
		for (String headerName : safeHeaders)
			if (req.getHeader(headerName) != null)
				headers.add(new HTTPHeader(headerName, req.getHeader(headerName)));

		// add original IP header
		String reqIP = req.getRemoteAddr();
		HTTPHeader headerOriginalIP = new HTTPHeader("X-Original-IP", reqIP);
		headers.add(headerOriginalIP);

		// get country of source IP in GeoLocationDB
		GeoLocationDB ipdb = new GeoLocationDB();
		String geoCountryCode = ipdb.getCountry(reqIP);
		if (geoCountryCode == null || geoCountryCode == "ZZ")
			geoCountryCode = DEFAULT_GEOIP_COUNTRY;
		HTTPHeader headerGeoLocationCountry = new HTTPHeader("X-GeoLocation-Country", geoCountryCode);
		headers.add(headerGeoLocationCountry);

		return headers;
	} // }}}
	private void setResponseHeadersFromBackendResponse(HttpServletResponse res1, HTTPResponse res2) // {{{
	{
		List<HTTPHeader> headers = res2.getHeaders();
		String safeHeaders[] = {
			"Set-Cookie"
		};

		for (HTTPHeader header : headers)
			if (Arrays.asList(safeHeaders).contains(header.getName()))
				res1.setHeader(header.getName(), header.getValue());
	} // }}}

	private void setResponsePublicCacheHeaders(HttpServletResponse res, int seconds) // {{{
	{
		res.setDateHeader("Expires", System.currentTimeMillis() + (1000 * seconds) );
		res.setHeader("Cache-Control", "public, max-age="+seconds);
	} // }}}
	private void setResponsePrivateCacheHeaders(HttpServletResponse res, int seconds) // {{{
	{
		res.setDateHeader("Expires", System.currentTimeMillis() + (1000 * seconds) );
		res.setHeader("Cache-Control", "private, max-age="+seconds);
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
	private URL buildCypherpunkURL(HttpServletRequest req, String cypherpunkURI) // {{{
	{
		URL cypherpunkURL = null;

		try // build cypherpunkURL
		{
			// determine API endpoint
			String cypherpunkBaseURL = null;

			if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			{
				// for local devserver - don't use TLS
				cypherpunkBaseURL = BACKEND_HOSTNAME_DEVSERVER;
			}
			else if (req.getServerName().equals(FRONTEND_HOSTNAME_DEVELOPMENT)) // cloud development
			{
				cypherpunkBaseURL = BACKEND_HOSTNAME_DEVELOPMENT;
			}
			else // cloud production
			{
				cypherpunkBaseURL = BACKEND_HOSTNAME_PRODUCTION;
			}

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

	private Map<String,Object> getCachedBloggerData(String bloggerID, String bloggerURI, String bloggerArgs, int secondsToMemcache, boolean useCache, boolean forceUpdate) // {{{
	{
		URL bloggerURL = buildBloggerURL(bloggerID, bloggerURI, bloggerArgs);
		return getCachedData(bloggerURL.toString(), secondsToMemcache, useCache, forceUpdate);
	} // }}}
	private Map<String,Object> getCachedCypherpunkData(HttpServletRequest req, String cypherpunkURI, int secondsToMemcache, boolean useCache, boolean forceUpdate) // {{{
	{
		URL cypherpunkURL = buildCypherpunkURL(req, cypherpunkURI);
		return getCachedData(cypherpunkURL.toString(), secondsToMemcache, useCache, forceUpdate);
	} // }}}
	private Map<String,Object> getCachedZendeskData(String zendeskURI, int secondsToMemcache, boolean useCache, boolean forceUpdate) // {{{
	{
		URL zendeskURL = buildZendeskURL(zendeskURI);
		return getCachedData(zendeskURL.toString(), secondsToMemcache, useCache, forceUpdate);
	} // }}}
	private Map<String,Object> getCachedData(String apiURL, int secondsToMemcache, boolean useCache, boolean forceUpdate) // {{{
	{
		String response = null;
		Map<String,Object> responseData = null;
		boolean inMemcache = false;
		boolean inDatastore = false;

		// {{{ first check memcache, use apiURL as key
		if (useCache)
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
		if (useCache && !forceUpdate && responseData == null)
		{
			Key entityKey = KeyFactory.createKey(CypherpunkResponseCache.KIND, apiURL);
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

			try
			{
				response = requestDataAsString(HTTPMethod.GET, new URL(apiURL), null, null);
			}
			catch (Exception e)
			{
				response = null;
			}
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
			if (useCache && !inMemcache)
			{
				if (forceUpdate)
					mc.put(apiURL, response, Expiration.byDeltaSeconds(secondsToMemcache), SetPolicy.SET_ALWAYS);
				else
					mc.put(apiURL, response, Expiration.byDeltaSeconds(secondsToMemcache), SetPolicy.ADD_ONLY_IF_NOT_PRESENT);
			}
			if (useCache && !inDatastore)
			{
				Key cacheKey = KeyFactory.createKey(CypherpunkResponseCache.KIND, apiURL);
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

	private String requestBloggerData(String bloggerURI, List<HTTPHeader> headers, String body) // {{{
	{
		//URL bloggerURL = buildBloggerURL(bloggerURI);
		//return requestDataAsString(requestMethod, bloggerURL, headers, body);
		return ""; // FIXME
	} // }}}
	private String requestCypherpunkData(HttpServletRequest req, HTTPMethod requestMethod, String cypherpunkURI, List<HTTPHeader> headers, String body) // {{{
	{
		URL cypherpunkURL = buildCypherpunkURL(req, cypherpunkURI);
		return requestDataAsString(requestMethod, cypherpunkURL, headers, body);
	} // }}}
	private String requestZendeskData(HTTPMethod requestMethod, String zendeskURI, List<HTTPHeader> headers, String body) // {{{
	{
		URL zendeskURL = buildZendeskURL(zendeskURI);
		String zendeskResponse = null;
		HTTPResponse response = requestData(requestMethod, zendeskURL, headers, body);
		//LOG.log(Level.WARNING, "zendesk request body: " + body);
		LOG.log(Level.WARNING, "zendesk response code: " + response.getResponseCode());
		if (response != null)
			zendeskResponse = getBodyFromResponse(response);
		return zendeskResponse;
	} // }}}

	private String requestDataAsString(HTTPMethod requestMethod, URL cypherpunkURL, List<HTTPHeader> headers, String body) // {{{
	{
		String cypherpunkResponse = null;
		HTTPResponse response = requestData(requestMethod, cypherpunkURL, headers, body);
		if (response != null && (response.getResponseCode() == HttpURLConnection.HTTP_OK || response.getResponseCode() == HttpURLConnection.HTTP_CREATED))
			cypherpunkResponse = getBodyFromResponse(response);
		return cypherpunkResponse;
	} // }}}

	private HTTPResponse requestData(HTTPMethod requestMethod, URL cypherpunkURL, List<HTTPHeader> headers, String body) // {{{
	//throws IOException, UnsupportedEncodingException
	{
		URLFetchService urlFetchService = URLFetchServiceFactory.getURLFetchService();
		HTTPRequest request = new HTTPRequest(cypherpunkURL, requestMethod, withDefaults().setDeadline(REQUEST_DEADLINE));

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
