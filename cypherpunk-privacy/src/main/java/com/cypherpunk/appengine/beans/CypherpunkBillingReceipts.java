package com.cypherpunk.appengine.beans;

import java.util.ArrayList;
import java.util.List;

public class CypherpunkBillingReceipts
{
	private static class Receipt
	{
		private String id;
		private String date;
		private String description;
		private String method;
		private String currency;
		private String amount;
	}

	private List<Receipt> receipts;

	CypherpunkBillingReceipts()
	{
		this.receipts = new ArrayList<Receipt>();
	}
}
