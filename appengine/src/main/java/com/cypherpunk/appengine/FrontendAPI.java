package com.cypherpunk.appengine;

// {{{ imports
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.utils.SystemProperty;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
// }}}

@SuppressWarnings("serial")
public class FrontendAPI extends HttpServlet
{
	// {{{ get appengine API instances
	private static final DatastoreService DS = DatastoreServiceFactory.getDatastoreService();
	private static final Logger LOG = Logger.getLogger(FrontendAPI.class.getName());
	// }}}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		// {{{ init
		// init gson
		Gson gson = new GsonBuilder().disableHtmlEscaping().create();

		Date now = new Date();

		// autodetect locale from Accept-Language http request header
		Locale langLocale = req.getLocale();

		String reqIP = req.getRemoteAddr();
		String geoCountryCode = null;

		// TODO: Enable if we want the geo-lookup to be cached in the user's browser
		final boolean cacheGeoLookupInCookie = false;

		if (cacheGeoLookupInCookie) {
			Map<String, Cookie> cookies = new HashMap<String, Cookie>();
			if (req.getCookies() != null) {
				for (Cookie cookie : req.getCookies()) {
					cookies.put(cookie.getName(), cookie);
				}
				Cookie countryCookie = cookies.get("country");
				if (countryCookie != null) {
					geoCountryCode = countryCookie.getValue();
				}
			}
		}

		GeoLocationDB ipdb = new GeoLocationDB();
		if (geoCountryCode == null) {
			// get appengine IP based geo-location 2 letter country code
			geoCountryCode = ipdb.getCountry(reqIP);
			if (geoCountryCode == null || geoCountryCode == "ZZ")
				geoCountryCode = "JP";

			if (cacheGeoLookupInCookie) {
				res.addCookie(new Cookie("country", geoCountryCode));
			}
		}

		// set content type
		res.setContentType("application/json; charset=UTF-8");

		// get response writer
		PrintWriter out = res.getWriter();

		// get request URL
		String reqURL = req.getRequestURL().toString();
		LOG.log(Level.INFO, req.getPathInfo());

		boolean forceUpdate = false;
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			forceUpdate = true;
		if (req.getParameter("forceUpdate") != null)
			forceUpdate = true;

		// slice last word to get apiMethod
		String apiMethod = reqURL.substring(reqURL.lastIndexOf('/') + 1, reqURL.length());
		// }}}

		switch (apiMethod) {
			case "countryList": { // {{{
				Map<String, String> countries = new HashMap<String, String>();

				// FIXME: This should be a ready-made list in the datastore

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
			}
			break; // }}}

			case "secretGeoDatabaseInit": { // {{{
				String chunk = req.getParameter("chunk");
				ipdb.initDatabase(chunk);
				out.println("ok");
			}
			break; // }}}

			case "secretGeoDatabaseTest": { // {{{
				String ip = req.getParameter("ip");
				String countryCode = ipdb.getCountry(ip);
				out.println(countryCode);
			}
			break; // }}}

			/*
			 * Unknown API; return 404.
			 */
			default: { // {{{
				res.sendError(HttpServletResponse.SC_NOT_FOUND);
			}
			break; // }}}
		}
	}
}

// vim: foldmethod=marker wrap
