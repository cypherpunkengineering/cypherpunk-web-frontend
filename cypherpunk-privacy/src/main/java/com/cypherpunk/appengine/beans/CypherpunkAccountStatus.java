package com.cypherpunk.appengine.beans;

public class CypherpunkAccountStatus
{
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
		private String confirmed;
	}

	private static class Subscription
	{
		private String renewal;
		private String expiration;
	}

	private String secret;
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
