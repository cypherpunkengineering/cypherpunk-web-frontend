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

	public CypherpunkAppVersions()
	{
		this.windows = new Platform(
			"0.8.0-beta", // latest
			"0.8.0-beta", // required
			"A new update is available.", // description
			"https://download.cypherpunk.com/builds/windows/cypherpunk-privacy-windows-0.8.0-beta-01404.exe"
		);

		this.macos = new Platform(
			"0.8.0-beta", // latest
			"0.8.0-beta", // required
			"A new update is available.", // description
			"https://download.cypherpunk.com/builds/macos/cypherpunk-privacy-macos-0.8.0-beta-01404.zip"
		);

		this.debian = new Platform(
			"0.8.0-beta", // latest
			"0.8.0-beta", // required
			"A new update is available.", // description
			"https://download.cypherpunk.com/builds/debian/cypherpunk-privacy-linux-0.8.0-beta-01404.deb"
		);
	}
}
