package com.cypherpunk.download;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.blobstore.ByteRange;
//[START gcs_imports]
import com.google.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsInputChannel;
import com.google.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.tools.cloudstorage.GcsFileMetadata;
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

import java.lang.NullPointerException;
import java.lang.IllegalArgumentException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class BucketDownloader extends HttpServlet
{
	private static final Logger LOG = Logger.getLogger(BucketDownloader.class.getName());
	private static final String BUCKET_NAME = "download.cypherpunk.com";

	private final GcsService gcsService = GcsServiceFactory.createGcsService(new RetryParams.Builder()
			.initialRetryDelayMillis(10)
			.retryMaxAttempts(10)
			.totalRetryPeriodMillis(15000)
			.build());

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		// connect to blobservice
		BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

		// create a GcsFilename from bucket name + request URI
		GcsFilename filename = new GcsFilename(BUCKET_NAME, req.getRequestURI());

		// create blobstore path as a string
		String blobstorePath = "/gs/" + filename.getBucketName() + filename.getObjectName();
		LOG.log(Level.WARNING, "blobstorePath = '" + blobstorePath + "'");

		// generate a blobKey from the blobstorePath
		BlobKey blobKey = blobstoreService.createGsBlobKey(blobstorePath);
		LOG.log(Level.WARNING, "blobKey = '" + blobKey + "'");

		// query if valid blobkey
		//Long blobSize;
		GcsFileMetadata metadata;
		try
		{
			// https://code.google.com/p/googleappengine/issues/detail?id=4310

			// works to detect if file exists
			byte[] unused = blobstoreService.fetchData(blobKey, 0, 0);

			// doesn't work, returns null
			/*
			BlobInfoFactory blobInfoFactory = new BlobInfoFactory();
			BlobInfo blobInfo = blobInfoFactory.loadBlobInfo(blobKey);
			*/

			// doesn't work, returns null
			//blobSize = blobInfo.getSize();

			// doesn't work, returns null
			//metadata = gcsService.getMetadata(filename);
			//LOG.log(Level.WARNING, "metadata = '" + metadata + "'");

			// doesn't work, can't set headers using blobstore serve method
			/*
			res.setContentType(metadata.getOptions().getMimeType());
			res.setHeader("Content-Length", Long.toString(metadata.getLength()));
			res.setHeader("ETag", metadata.getEtag());
			res.setHeader("Cache-Control", "no-transform,public,max-age=300,s-max-age=900");
			res.setHeader("Last-Modified", dateFormatter.print(new DateTime(metadata.getLastModified().getTime())));
			*/
		}
		catch (IllegalArgumentException e) // Blob not found
		//catch (NullPointerException e)
		{
			res.setHeader("Location", "https://cypherpunk.com/download");
			res.setStatus(404);
			return;
		}
		catch (Exception e)
		{
			LOG.log(Level.WARNING, "Unhandled Exception! ", e);
			res.setStatus(500);
			return;
		}

		// hack workaround to force content-length header being sent
		//ByteRange all = new ByteRange(1);
		// serve directly from blobservice to avoid 32MB limit
		blobstoreService.serve(blobKey, res);
	}
}
