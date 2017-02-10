package com.cypherpunk.download;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class BuildsListing extends HttpServlet
{
	private static final String BUCKET_NAME = "builds.cypherpunk.com";

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		// set content type
		res.setContentType("text/html; charset=UTF-8");

		// get response writer
		PrintWriter writer = res.getWriter();

		// get bucket directory listing as xml
		String content, out = "";
		try
		{
			BucketInterface bucket = new BucketInterface(BUCKET_NAME);
			String what = "";
			try
			{
				// get 3rd thing /api/builds/foo
				what = req.getRequestURI().split("/")[3];
			}
			catch (Exception e)
			{
				what = "";
			}
			out = bucket.list(req, res, "builds/" + what + "/");
			writer.println(out);
			//out = bucket.list(req, res, "/builds/android/");
			//writer.println(out);
		}
		catch (IOException e)
		{
			System.err.println(e.getMessage());
			res.sendError(500);
		}
		catch (Throwable t)
		{
			t.printStackTrace();
			res.sendError(500);
		}
		//writer.println(out);
	}
}

// vim: foldmethod=marker wrap
