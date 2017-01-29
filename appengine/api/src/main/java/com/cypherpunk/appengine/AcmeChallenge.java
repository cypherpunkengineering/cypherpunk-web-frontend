package com.cypherpunk.appengine;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AcmeChallenge extends HttpServlet
{
	static final long serialVersionUID = 1;

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		String path = req.getRequestURI();
		res.setContentType("text/plain");

		if (path.equals("/.well-known/acme-challenge/WGRTRL7cSgdTLKOPzp3ZuJCGX-d671-x_HBQvUXBTrk"))
		{
			res.getWriter().println("WGRTRL7cSgdTLKOPzp3ZuJCGX-d671-x_HBQvUXBTrk.8ApV0Up29g7-iby26RUYj12O_WCjixrAPSQVM7JgKUg");
			return;
		}
		else if (path.equals("/.well-known/acme-challenge/TE9vsQ-bcZpuMsgBK7vSgF31TlUOaamSgpmtfblWP0g"))
		{
			res.getWriter().println("TE9vsQ-bcZpuMsgBK7vSgF31TlUOaamSgpmtfblWP0g.8ApV0Up29g7-iby26RUYj12O_WCjixrAPSQVM7JgKUg");
			return;
		}
		else if (path.equals("/.well-known/acme-challenge/T2O5SL7CMzPifXrZofrSiHjqkB4Fpt8EkVH3_jEKtVM"))
		{
			res.getWriter().println("T2O5SL7CMzPifXrZofrSiHjqkB4Fpt8EkVH3_jEKtVM.8ApV0Up29g7-iby26RUYj12O_WCjixrAPSQVM7JgKUg");
			return;
		}
		else if (path.equals("/.well-known/acme-challenge/QqgQLQzVDDwD2PWsRNV9OaxW4J6qc6kCmwP_gKjOONI"))
		{
			res.getWriter().println("QqgQLQzVDDwD2PWsRNV9OaxW4J6qc6kCmwP_gKjOONI.8ApV0Up29g7-iby26RUYj12O_WCjixrAPSQVM7JgKUg");
			return;
		}
		else if (path.equals("/.well-known/acme-challenge/gc8o7lZbcH7E54aIDL36wSmQ9UO56NbQ6z8UxIZDJXU"))
		{
			res.getWriter().println("gc8o7lZbcH7E54aIDL36wSmQ9UO56NbQ6z8UxIZDJXU.8ApV0Up29g7-iby26RUYj12O_WCjixrAPSQVM7JgKUg");
			return;
		}
		else if (path.equals("/.well-known/acme-challenge/mSWggoTyRuyecra7BYw1K2cH63p2YWs6nzKj66pY-JM"))
		{
			res.getWriter().println("mSWggoTyRuyecra7BYw1K2cH63p2YWs6nzKj66pY-JM.8ApV0Up29g7-iby26RUYj12O_WCjixrAPSQVM7JgKUg");
			return;
		}
		else if (path.equals("/.well-known/acme-challenge/lfM3FhaGqiyAIbBpCcNwQeiuOfPE6LW_eU0X7cja8sw"))
		{
			res.getWriter().println("lfM3FhaGqiyAIbBpCcNwQeiuOfPE6LW_eU0X7cja8sw.8ApV0Up29g7-iby26RUYj12O_WCjixrAPSQVM7JgKUg");
			return;
		}
		else if (path.equals("/.well-known/acme-challenge/W0K6xO4pRDdpEzHj5Z7tTV7lwpBxeE9Cj87wW6jSuU8"))
		{
			res.getWriter().println("W0K6xO4pRDdpEzHj5Z7tTV7lwpBxeE9Cj87wW6jSuU8.8ApV0Up29g7-iby26RUYj12O_WCjixrAPSQVM7JgKUg");
			return;
		}
		else if (path.equals("/.well-known/acme-challenge/p60PN2OzvUNOYuOhAHMnmQfIzoEF3rU_RhjUta27bjg"))
		{
			res.getWriter().println("p60PN2OzvUNOYuOhAHMnmQfIzoEF3rU_RhjUta27bjg.8ApV0Up29g7-iby26RUYj12O_WCjixrAPSQVM7JgKUg");
			return;
		}
		res.getWriter().println("unknown challenge");
	}
}
