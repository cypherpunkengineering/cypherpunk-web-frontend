package com.cypherpunk.appengine.beans;

public class CypherpunkAppVersions
{
	private static class Platform
	{
		private String latest;
		private String required;
		private String description;
		private String url;

		public Platform
		(
			String latest,
			String required,
			String description,
			String url
		)
		{
			this.latest = latest;
			this.required = required;
			this.description = description;
			this.url = url;
		}
	}

	private Platform windows;
	private Platform macos;
	private Platform debian;

	public CypherpunkAppVersions(String flavor)
	{
		if (flavor.equals("developer")) // {{{
		{
			this.windows = new Platform(
				"0.9.0-preview", // latest
				"0.9.0-preview", // required
				"", // description
				"https://download.cypherpunk.com/builds/windows/cypherpunk-privacy-windows-0.9.0-preview-01522.exe"
			);

			this.macos = new Platform(
				"0.9.0-preview", // latest
				"0.9.0-preview", // required
				"", // description
				"https://download.cypherpunk.com/builds/macos/cypherpunk-privacy-macos-0.9.0-preview-01522.zip"
			);

			this.debian = new Platform(
				"0.9.0-preview", // latest
				"0.9.0-preview", // required
				"", // description
				"https://download.cypherpunk.com/builds/debian/cypherpunk-privacy-linux-0.9.0-preview-01522.deb"
			);
		} // }}}
		else // {{{ default
		{
			this.windows = new Platform(
				"0.9.0-preview", // latest
				"0.9.0-preview", // required
				"", // description
				"https://download.cypherpunk.com/builds/windows/cypherpunk-privacy-windows-0.9.0-preview-01522.exe"
			);

			this.macos = new Platform(
				"0.9.0-preview", // latest
				"0.9.0-preview", // required
				"", // description
				"https://download.cypherpunk.com/builds/macos/cypherpunk-privacy-macos-0.9.0-preview-01522.zip"
			);

			this.debian = new Platform(
				"0.9.0-preview", // latest
				"0.9.0-preview", // required
				"", // description
				"https://download.cypherpunk.com/builds/debian/cypherpunk-privacy-linux-0.9.0-preview-01522.deb"
			);
		} // }}}
	}
}

// vim: foldmethod=marker wrap
