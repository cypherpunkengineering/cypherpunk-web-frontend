package com.cypherpunk.download;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class BuildsDownloader extends HttpServlet
{
	private static final String BUCKET_NAME = "builds.cypherpunk.com";

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		BucketInterface bucket = new BucketInterface(BUCKET_NAME);
		bucket.download(req, res, req.getRequestURI());
	}
}
