package com.cypherpunk.appengine.beans;

public class CypherpunkZendeskRequest
{
	String name;
	String email;
	String subject;
	String comment;

	public String getName() { return name; }
	public String getEmail() { return email; }
	public String getSubject() { return subject; }
	public String getComment() { return comment; }
}
