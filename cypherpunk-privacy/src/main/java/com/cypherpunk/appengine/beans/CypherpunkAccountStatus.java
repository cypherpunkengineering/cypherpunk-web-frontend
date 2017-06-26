package com.cypherpunk.appengine.beans;

public class CypherpunkAccountStatus
{
	private String secret;

	private static class Privacy
	{
		private String username;
		private String password;
	}

	private static class Account
	{
		private String type;
		private String id;
		private String email;
		private boolean confirmed;
	}

	private static class Subscription
	{
		private boolean active;
		private boolean renews;
		private String type;
		private String expiration;
		// deprecated
		private String renewal;
	}

	private Privacy privacy;
	private Account account;
	private Subscription subscription;

	public CypherpunkAccountStatus ()
	{
		this.privacy = new Privacy();
		this.account = new Account();
		this.subscription = new Subscription();
	}
}
