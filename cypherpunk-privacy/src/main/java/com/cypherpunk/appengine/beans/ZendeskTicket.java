package com.cypherpunk.appengine.beans;

public class ZendeskTicket
{
	private class Ticket
	{
		private class Requester
		{
			private String name;
			private String email;
		}

		private class Comment
		{
			private String body;
		}

		private Requester requester;
		private String subject;
		private Comment comment;

		Ticket()
		{
			this.requester = new Requester();
			this.comment = new Comment();
		}
	}

	private Ticket ticket;

	public ZendeskTicket (CypherpunkZendeskRequest request)
	{
		this.ticket = new Ticket();
		this.ticket.requester.name = request.getName();
		this.ticket.requester.email = request.getEmail();
		this.ticket.subject = request.getSubject();
		this.ticket.comment.body = request.getComment();
	}
}
