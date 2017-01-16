package com.cypherpunk.appengine;
import java.io.BufferedReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Enumeration;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.urlfetch.HTTPHeader;
import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.URLFetchService;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;
import com.google.appengine.api.urlfetch.FetchOptions;
import static com.google.appengine.api.urlfetch.FetchOptions.Builder.withDefaults;

import com.google.appengine.api.utils.SystemProperty;
import static com.google.appengine.api.utils.SystemProperty.environment;
import static com.google.appengine.api.utils.SystemProperty.Environment.Value.Development;
import static com.google.appengine.api.utils.SystemProperty.Environment.Value.Production;

@SuppressWarnings("serial")
public class BackendProxy extends HttpServlet {

	private static final String backend = "red-dragon.cypherpunk.network";

	@Override
	public final void doGet(final HttpServletRequest req, final HttpServletResponse res) throws IOException
	{
		String path = req.getRequestURI().substring(req.getContextPath().length()).toLowerCase();

		if (path.equals("") || path.equals("/"))
		{
			res.sendRedirect("/login");
		} else {
			connectToBackend(req, res, HTTPMethod.GET);
		}
	}

	@Override
	public final void doPost(final HttpServletRequest req, final HttpServletResponse res) throws IOException
	{
		connectToBackend(req, res, HTTPMethod.POST);
	}

	private void connectToBackend(final HttpServletRequest req, final HttpServletResponse res, HTTPMethod httpMethod) throws IOException
	{
		String path = req.getRequestURI().substring(req.getContextPath().length());
		String queryString = req.getQueryString();
		String domain = req.getHeader("Host");
		String reqIP = req.getRemoteAddr();

		URL backendURL;
		backendURL = new URL("https://" + backend + path + "?" + queryString);

		SystemProperty.Environment.Value env = environment.value();
		if (env == Development)
		{
			backendURL = new URL("http://127.0.0.1" + path + "?" + queryString);
		}

		URLFetchService urlFetchService = URLFetchServiceFactory.getURLFetchService();

		FetchOptions lFetchOptions = FetchOptions.Builder.withDefaults()
			.validateCertificate()
			.doNotFollowRedirects()
			.setDeadline(30.0);

		HTTPRequest request = new HTTPRequest(backendURL, httpMethod, lFetchOptions);

		// Get and set the payload
		if (httpMethod.toString().equals("POST"))
		{
			StringBuffer sb = new StringBuffer();
			String line = null;
			try {
				BufferedReader reader = req.getReader();
				while ((line = reader.readLine()) != null)
					sb.append(line);
			} catch (Exception e) {
				e.printStackTrace();
			}
			String body = sb.toString();
			if (body != null && !body.isEmpty())
			{
				request.setPayload(body.getBytes());
			}
		}

		// Grab all headers from the request
		Enumeration<String> enuHead = req.getHeaderNames();
		while (enuHead.hasMoreElements())
		{
			String headerName = enuHead.nextElement();
			HTTPHeader header = new HTTPHeader(headerName, req.getHeader(headerName));
			request.addHeader(header);
		}

		// Set the same headers to the new request to backend
		for (HTTPHeader header : request.getHeaders())
		{
			if (header.getName().equals("Referer"))
			{
				header = new HTTPHeader("Referer", header.getValue().replaceAll("(http|https)://" + domain, "https://" + backend));
				request.setHeader(header);
			} else if (header.getName().equals("Host"))
			{
				header = new HTTPHeader("Host", header.getValue().replaceAll(domain, backend + ":443"));
				request.setHeader(header);
			} else if (header.getName().equals("X-Forwarded-Host"))
			{
				header = new HTTPHeader("X-Forwarded-Host", header.getValue().replaceAll(domain, backend));
				request.setHeader(header);
			} else if (header.getName().equals("X-Forwarded-Server"))
			{
				header = new HTTPHeader("X-Forwarded-Server", header.getValue().replaceAll(domain, backend));
				request.setHeader(header);
			}
		}

		HTTPHeader headerOriginalIP = new HTTPHeader("X-Original-IP", reqIP);
		request.setHeader(headerOriginalIP);

		// Fetch the data form backend
		HTTPResponse response = urlFetchService.fetch(request);

		if (response != null)
		{
			System.out.println("Status code: " + response.getResponseCode());
			if (response.getResponseCode() > 300 && response.getResponseCode() < 308)
			{
				String newLocation = null;
				for (HTTPHeader header : response.getHeaders())
				{
					System.out.println(header.getName() + ": " + header.getValue());
					if (header.getName().toLowerCase().equals("location"))
					{
						newLocation = header.getValue().replaceAll(backend, domain);
						newLocation = newLocation.replace("http://", "https://");
					}
				}
				System.out.println("New location: " + newLocation);
				res.sendRedirect(newLocation);
			} else {
				res.setStatus(response.getResponseCode());
				for (HTTPHeader header : response.getHeaders())
				{
					if (header.getName().toLowerCase().equals("content-type"))
					{
						res.setContentType(header.getValue());
					} else if (header.getName().toLowerCase().equals("set-cookie"))
					{
						res.setHeader("Set-Cookie", header.getValue());
					} else if (header.getName().toLowerCase().equals("location"))
					{
						String newLocation = null;
						newLocation = header.getValue().replaceAll(backend, domain);
						newLocation = newLocation.replace("http://", "https://");
						res.setHeader(header.getName(), header.getValue());
					} else {
						res.setHeader(header.getName(), header.getValue());
					}
				}
				res.getOutputStream().write(response.getContent());
			}
		}
	}

}
