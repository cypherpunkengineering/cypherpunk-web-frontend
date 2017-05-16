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

	public ZendeskTicket
	(
		String requesterName,
		String requesterEmail,
		String subject,
		String commentBody
	)
	{
		this.ticket = new Ticket();
		this.ticket.requester.name = requesterName;
		this.ticket.requester.email = requesterEmail;
		this.ticket.subject = subject;
		this.ticket.comment.body = commentBody;
	}
}
