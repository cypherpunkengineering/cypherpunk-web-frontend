package com.cypherpunk.download;

// {{{
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.blobstore.ByteRange;

import com.google.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsInputChannel;
import com.google.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.tools.cloudstorage.GcsFileMetadata;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.RetryParams;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.util.Preconditions;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.channels.Channels;
import java.util.NoSuchElementException;
import java.util.logging.Level;
import java.util.logging.Logger;

import java.lang.NullPointerException;
import java.lang.IllegalArgumentException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.PrintWriter;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.security.GeneralSecurityException;
import java.util.Collections;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import org.xml.sax.InputSource;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
// }}}

public class BucketInterface
{
	// {{{ member vars
	/** Global configuration of Google Cloud Storage OAuth 2.0 scope. */
	private final String STORAGE_SCOPE = "https://www.googleapis.com/auth/devstorage.read_write";

	/** Debug logger */
	private static final Logger LOG = Logger.getLogger(BucketInterface.class.getName());

	/** Build parameters for Google Cloud Storage service handle */
	private final GcsService gcsService = GcsServiceFactory.createGcsService(new RetryParams.Builder()
			.initialRetryDelayMillis(10)
			.retryMaxAttempts(10)
			.totalRetryPeriodMillis(15000)
			.build());

	/** our bucket name */
	private String mBucketName;

	// }}}
	/**
	 * Constructs a bucket interface.
	 */
	public BucketInterface(String bucketName) // {{{
	{
		mBucketName = bucketName;
	} // }}}

	/**
	 * Fetches the listing of the given bucket.
	 *
	 * @return the pretty printed contents of the bucket.
	 * @param path the path to list
	 * @throws IOException if there's an error communicating with Cloud Storage.
	 * @throws GeneralSecurityException for errors creating https connection.
	 */
	public String list(HttpServletRequest req, HttpServletResponse res, String path) throws IOException, GeneralSecurityException // {{{
	{
		// Build an account credential.
		GoogleCredential credential = GoogleCredential.getApplicationDefault().createScoped(Collections.singleton(STORAGE_SCOPE));

		// Set up and execute a Google Cloud Storage request.
		String uri = "https://storage.googleapis.com/" + URLEncoder.encode(mBucketName, "UTF-8") + "?delimiter=/&prefix=" + URLEncoder.encode(path, "UTF-8");

		HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
		HttpRequestFactory requestFactory = httpTransport.createRequestFactory(credential);
		GenericUrl url = new GenericUrl(uri);

		HttpRequest request = requestFactory.buildGetRequest(url);
		HttpResponse response = request.execute();

		if (1 + 1 == 2)
			return response.parseAsString();

		// transform and roll out
		String out = "";
		try
		{
			// parse xml response
			DocumentBuilder newDocumentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
			//LOG.log(Level.WARNING, response.parseAsString());
			InputSource is = new InputSource(response.getContent());
			Document parse = newDocumentBuilder.parse(is);

			// get directory name for page header
			out += parse.getFirstChild().getFirstChild().getTextContent() + "<br>\n";

			// get all "Contents" nodes
			NodeList nodeList = parse.getFirstChild().getChildNodes();
			for (int i = 0; i < nodeList.getLength(); i++)
			{
				Node currentNode = nodeList.item(i);
				//LOG.log(Level.WARNING, currentNode.getNodeName());
				if (currentNode.getNodeType() == Node.ELEMENT_NODE && currentNode.getNodeName().equals("Contents"))
				{
					NodeList contentsNodes = currentNode.getChildNodes();
					for (int j = 0; j < contentsNodes.getLength(); j++)
					{
						Node currentContentsNode = contentsNodes.item(j);
						//LOG.log(Level.WARNING, currentContentsNode.getNodeName());
						if (currentContentsNode.getNodeType() == Node.ELEMENT_NODE && currentContentsNode.getNodeName().equals("Key"))
						{
							//LOG.log(Level.WARNING, currentContentsNode.getTextContent());
							String filePath = currentContentsNode.getTextContent();
							String fileName = path.substring(path.lastIndexOf('/') + 1, path.length());
							out += "<a href='" + req.getRequestURL() + filePath + "/" + fileName + "'>" + fileName + "</a><br>\n";
						}
					}
				}
			}
			// return the pretty printed output
		}
		catch (Exception e)
		{
			//res.sendError(500);
			out = "Error parsing bucket list: "+e.toString();
		}
		return out;
	} // }}}

	/**
	 * Serves a file from bucket for download.
	 *
	 * @throws IOException if there's an error communicating with Cloud Storage.
	 */
	public void download(HttpServletRequest req, HttpServletResponse res, String fileName) throws IOException // {{{
	{
		// connect to blobservice
		BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

		// create a GcsFilename from bucket name + filename
		GcsFilename filename = new GcsFilename(mBucketName, fileName);

		// create blobstore path as a string
		String blobstorePath = "/gs/" + filename.getBucketName() + filename.getObjectName();
		//LOG.log(Level.WARNING, "blobstorePath = '" + blobstorePath + "'");

		// generate a blobKey from the blobstorePath
		BlobKey blobKey = blobstoreService.createGsBlobKey(blobstorePath);
		//LOG.log(Level.WARNING, "blobKey = '" + blobKey + "'");

		// query if valid blobkey
		//Long blobSize;
		//GcsFileMetadata metadata;
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
		{
			//res.setHeader("Location", "https://cypherpunk.com/download");
			res.setStatus(404);
			return;
		}
		//catch (NullPointerException e)
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
	} // }}}
}

// vim: foldmethod=marker wrap
