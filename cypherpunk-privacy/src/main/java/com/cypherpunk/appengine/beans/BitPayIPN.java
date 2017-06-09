package com.cypherpunk.appengine.beans;
/*
{ id: 'HxrCXSzVnoJhxeFGP6shNo',
  url: 'https://test.bitpay.com/invoice?id=HxrCfSzVeoJhxtFG36shNo',
  status: 'confirmed',
  btcPrice: '0.004371',
  price: 5,
  currency: 'EUR',
  invoiceTime: 1491831282376,
  expirationTime: 1491832182376,
  currentTime: 1491831443317,
  btcPaid: '0.004371',
  btcDue: '0.000000',
  rate: 1144.01,
  exceptionStatus: false,
  buyerFields: { buyerEmail: 'test@bitpay.com' } }
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

	private String status;
	private boolean exceptionStatus;
	private String amount;
	private String rate;
	private String action;
	private String btcPaid;
	private String currency;
	private String posData;
}
