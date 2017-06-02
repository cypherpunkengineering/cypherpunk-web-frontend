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
public class AppAPI extends HttpServlet
{
	// {{{ get appengine API instances
	private static final DatastoreService DS = DatastoreServiceFactory.getDatastoreService();
	private static final Logger LOG = Logger.getLogger(AppAPI.class.getName());
	// }}}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		// {{{ init
		// init gson
		Gson gson = new GsonBuilder().disableHtmlEscaping().create();
		Date now = new Date();

		// set content type
		res.setContentType("application/json; charset=UTF-8");

		// get response writer
		PrintWriter out = res.getWriter();

		// get request URL
		String reqURL = req.getRequestURL().toString();
		LOG.log(Level.INFO, req.getPathInfo());

		// slice last word to get apiMethod
		String apiMethod = reqURL.substring(reqURL.lastIndexOf('/') + 1, reqURL.length());
		// }}}

		switch (apiMethod) {

			case "versions": { // {{{
				out.println(
				"{"
				+"\"windows\":{\"latest\":\"0.8.0-beta\",\"required\":\"0.7.0-beta\",\"description\":\"A new version is available, please update Cypherpunk Privacy from https://cypherpunk.com/download\"}"
				+",\"macos\":{\"latest\":\"0.8.0-beta\",\"required\":\"0.7.0-beta\",\"description\":\"A new version is available, please update Cypherpunk Privacy from https://cypherpunk.com/download\"}"
				+",\"debian\":{\"latest\":\"0.8.0-beta\",\"required\":\"0.7.0-beta\",\"description\":\"A new version is available, please update Cypherpunk Privacy from https://cypherpunk.com/download\"}"
				+"}");
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
