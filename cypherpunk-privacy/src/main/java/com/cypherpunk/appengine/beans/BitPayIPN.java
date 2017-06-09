package com.cypherpunk.appengine.beans;
/*
{
	"amount":"11.95",
	"rate":"2818.94",
	"exceptionStatus":"false",
	"status":"confirmed",
	"action":"invoiceStatus",
	"btcPaid":"0.004239",
	"invoice_id":"91KrttU8LWiw6xPwUELWvN",
	"posData":"{\"plan\":\"annually\"}",
	"currency":"USD"
}
*/
public class BitPayIPN
{
	/*
	private String id;
	private String url;
	private String status;
	private String btcPrice;
	private Number price;
	private String currency;
	private Number invoiceTime;
	private Number expirationTime;
	private Number currentTime;
	private String btcPaid;
	private String btcDue;
	private Number rate;
	private boolean exceptionStatus;
	private BuyerFields buyerFields;

	private static class BuyerFields
	{
		private String buyerEmail;
	}
	*/

	private String invoice_id;
	private String status;
	private boolean exceptionStatus;
	private String amount;
	private String rate;
	private String action;
	private String btcPaid;
	private String currency;
	private String posData;
}
