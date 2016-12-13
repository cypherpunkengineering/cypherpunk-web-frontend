package com.cypherpunk.download;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
//[START gcs_imports]
import com.google.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsInputChannel;
import com.google.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.RetryParams;
//[END gcs_imports]
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.channels.Channels;
import java.util.NoSuchElementException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class BucketDownloader extends HttpServlet
{
	private static final Logger LOG = Logger.getLogger(BucketDownloader.class.getName());

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		// connect to blobservice
		BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

		// take everything after / as the bucket path
		BlobKey blobKey = blobstoreService.createGsBlobKey("/gs/download.cypherpunk.com" + req.getRequestURI());

		try
		{
			byte[] unused = blobstoreService.fetchData(blobKey, 0, 0);
		}
		catch (Exception e)
		{
			//LOG.log(Level.WARNING, "Fail", e);
			res.setHeader("Location", "https://cypherpunk.com/download");
			res.setStatus(302);
			return;
		}

		// serve directly from blobservice to avoid 32MB limit
		blobstoreService.serve(blobKey, res);
	}
}
