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
				"0.8.3-beta", // latest
				"0.8.3-beta", // required
				"", // description
				"https://download.cypherpunk.com/builds/windows/cypherpunk-privacy-windows-0.8.3-beta-01442.exe"
			);

			this.macos = new Platform(
				"0.8.3-beta", // latest
				"0.8.3-beta", // required
				"", // description
				"https://download.cypherpunk.com/builds/macos/cypherpunk-privacy-macos-0.8.3-beta-01442.zip"
			);

			this.debian = new Platform(
				"0.8.3-beta", // latest
				"0.8.3-beta", // required
				"", // description
				"https://download.cypherpunk.com/builds/debian/cypherpunk-privacy-linux-0.8.3-beta-01442.deb"
			);
		} // }}}
		else // {{{ default
		{
			this.windows = new Platform(
				"0.8.3-beta", // latest
				"0.8.3-beta", // required
				"", // description
				"https://download.cypherpunk.com/builds/windows/cypherpunk-privacy-windows-0.8.3-beta-01442.exe"
			);

			this.macos = new Platform(
				"0.8.3-beta", // latest
				"0.8.3-beta", // required
				"", // description
				"https://download.cypherpunk.com/builds/macos/cypherpunk-privacy-macos-0.8.3-beta-01442.zip"
			);

			this.debian = new Platform(
				"0.8.3-beta", // latest
				"0.8.3-beta", // required
				"", // description
				"https://download.cypherpunk.com/builds/debian/cypherpunk-privacy-linux-0.8.3-beta-01442.deb"
			);
		} // }}}
	}
}

// vim: foldmethod=marker wrap
