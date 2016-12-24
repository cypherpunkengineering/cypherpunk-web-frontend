package com.cypherpunk.appengine;

import static com.google.appengine.api.urlfetch.FetchOptions.Builder.withDefaults;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;

import com.cypherpunk.appengine.beans.BackendResponse;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.URLFetchService;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;
import com.google.gson.Gson;

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
			if (path.equals("/api/blog/posts"))
			{
				getPosts(req, res);
			}
			else if (path.equals("/api/blog/search"))
			{
				getSearchResults(req, res);
			}
			else if (path.startsWith("/api/blog/post/"))
			{
				getPost(req, res);
			}
			else if (path.startsWith("/api/blog/comments/"))
			{
				getComments(req, res);
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

	private void getPost(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		String path = req.getRequestURI().substring(req.getContextPath().length()).toLowerCase();
		String postId = path.substring(15);

		getDataFromBlogger(req, res, blogUrl + "/" + blogId + "/posts/"+ postId +"?key=" + key + "&fetchBodies=true&fetchImages=true&view=reader");
	}

	private void getComments(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		String path = req.getRequestURI().substring(req.getContextPath().length()).toLowerCase();
		String postId = path.substring(19);

		getDataFromBlogger(req, res, blogUrl + "/" + blogId + "/posts/"+ postId +"/comments?key=" + key);
	}

	private void getSearchResults(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		String query = req.getParameter("q");
		getDataFromBlogger(req, res, "https://www.googleapis.com/blogger/v3/blogs/" + blogId + "/posts/search?q="+ query +"&fetchBodies=true&fetchImages=true&key=" + key);
	}

	private void getPosts(HttpServletRequest req, HttpServletResponse res) throws IOException
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
