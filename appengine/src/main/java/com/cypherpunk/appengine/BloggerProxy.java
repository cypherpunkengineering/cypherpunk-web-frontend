package com.cypherpunk.appengine;

// {{{ imports
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

import java.net.HttpURLConnection;
import java.net.URL;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cypherpunk.appengine.beans.BackendResponse;

import static com.google.appengine.api.urlfetch.FetchOptions.Builder.withDefaults;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.URLFetchService;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;
import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.utils.SystemProperty;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
// }}}

@SuppressWarnings("serial")
public class BloggerProxy extends HttpServlet
{
	private final String key = "AIzaSyBbjWAJoDWKxZ7R8DbIhf3mT595m1f5Tfs";
	private final String blogId = "4561014629041381755";
	private final String blogUrl = "https://www.googleapis.com/blogger/v3/blogs";

	@Override
	public final void doGet(final HttpServletRequest req, final HttpServletResponse res) throws IOException
	{
		String path = req.getRequestURI().substring(req.getContextPath().length()).toLowerCase();
		//System.out.println(path);
		BackendResponse backendJson = new BackendResponse();
		Gson gson = new Gson();
		res.setContentType("application/json");
		res.setCharacterEncoding("UTF-8");

		try
		{
			if (path.equals("/api/v0/blog/posts"))
			{
				String pageToken = req.getParameter("pageToken");

				if (pageToken != null && !pageToken.isEmpty())
				{
					getDataFromBlogger(req, res, blogUrl + "/" + blogId + "/posts?key=" + key + "&fetchBodies=true&fetchImages=true&view=reader&pageToken=" + pageToken);
				}
				else
				{
					getDataFromBlogger(req, res, blogUrl + "/" + blogId + "/posts?key=" + key + "&fetchBodies=true&fetchImages=true&view=reader");
				}
			}
			else if (path.equals("/api/v0/blog/search"))
			{
				String query = req.getParameter("q");
				getDataFromBlogger(req, res, "https://www.googleapis.com/blogger/v3/blogs/" + blogId + "/posts/search?q="+ query +"&fetchBodies=true&fetchImages=true&key=" + key);
			}
			else if (path.startsWith("/api/v0/blog/post/"))
			{
				String postId = path.substring(18);
				getDataFromBlogger(req, res, blogUrl + "/" + blogId + "/posts/"+ postId +"?key=" + key + "&fetchBodies=true&fetchImages=true&view=reader");
			}
			else if (path.startsWith("/api/v0/blog/comments/"))
			{
				String postId = path.substring(22);
				getDataFromBlogger(req, res, blogUrl + "/" + blogId + "/posts/"+ postId +"/comments?key=" + key);
			}
			else
			{
				res.setStatus(404);
				return;
			}
		}
		catch (Exception e)
		{
			PrintWriter out = res.getWriter();

			backendJson.status = "500";
			backendJson.message = e.getMessage();

			out.print(gson.toJson(backendJson));

			out.close();
		}
	}

	private void getDataFromBlogger(HttpServletRequest req, HttpServletResponse res, String backendUrlString) throws IOException, UnsupportedEncodingException
	{
		URL backendURL;
		backendURL = new URL(backendUrlString);

		URLFetchService urlFetchService = URLFetchServiceFactory.getURLFetchService();
		HTTPRequest request = new HTTPRequest(backendURL, HTTPMethod.GET, withDefaults().setDeadline(5.0));
		HTTPResponse response = null;

		response = urlFetchService.fetch(request);

		if (response != null && response.getResponseCode() == HttpURLConnection.HTTP_OK)
		{
			String result = null;
			result = new String(response.getContent(),"UTF-8");
			result = result.replaceAll("\\\"http://([^\\.]*)\\.bp\\.blogspot.com([^\"]*)\\\"", "\\\"https://$1.bp.blogspot.com$2\\\"");
			res.getWriter().print(result);
		}
	}
}
