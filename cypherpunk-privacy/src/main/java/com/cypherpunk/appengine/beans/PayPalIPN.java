package com.cypherpunk.appengine.beans;
/*

from sandbox:

{ txn_type: 'subscr_signup',
  subscr_id: 'I-8CW0MKVN2BSB',
  last_name: 'buyer',
  residence_country: 'US',
  mc_currency: 'USD',
  item_name: 'Premium Access to Cypherpunk Privacy',
  business: 'paypaltest-facilitator@cypherpunk.com',
  amount3: '69.00',
  recurring: '1',
  verify_sign: 'AiKZhEEPLJjSIccz.2M.tbyW5YFwAcJXHPGEHeamGexDe37weJlYZj-.',
  payer_status: 'verified',
  test_ipn: '1',
  payer_email: 'paypaltest-buyer@cypherpunk.com',
  first_name: 'test',
  receiver_email: 'paypaltest-facilitator@cypherpunk.com',
  payer_id: 'SR5VZMWJRMJLL',
  reattempt: '1',
  item_number: 'annually6900',
  subscr_date: '06:58:55 Jun 09, 2017 PDT',
  btn_id: '3666714',
  custom: '{"id":"GPWECL42ESOTMVUWYEAPGVR56JCCIEWM5HR62GD4EHSQ35EVRQS","plan":"annually"}',
  charset: 'windows-1252',
  notify_version: '3.8',
  period3: '12 M',
  mc_amount3: '69.00',
  ipn_track_id: 'c69f42b7d3f0f' }
}

from IPN simulator:

{ payment_type: 'echeck',
  payment_date: 'Mon Jun 12 2017 17:19:01 GMT+0900 (JST)',
  payment_status: 'Pending',
  pending_reason: 'echeck',
  address_status: 'confirmed',
  payer_status: 'verified',
  first_name: 'John',
  last_name: 'Smith',
  payer_email: 'buyer@paypalsandbox.com',
  payer_id: 'TESTBUYERID01',
  address_name: 'John Smith',
  address_country: 'United States',
  address_country_code: 'US',
  address_zip: '95131',
  address_state: 'CA',
  address_city: 'San Jose',
  address_street: '123 any street',
  business: 'seller@paypalsandbox.com',
  receiver_email: 'seller@paypalsandbox.com',
  receiver_id: 'seller@paypalsandbox.com',
  residence_country: 'US',
  item_name: 'something',
  item_number: 'AK-1234',
  quantity: '1',
  shipping: '3.04',
  tax: '2.02',
  mc_currency: 'USD',
  mc_fee: '0.44',
  mc_gross: '12.34',
  mc_gross_1: '12.34',
  txn_type: 'web_accept',
  txn_id: '688366545',
  notify_version: '2.1',
  custom: 'xyz123',
  invoice: 'abc1234',
  test_ipn: '1',
  verify_sign: 'AFcWxV21C7fd0v3bYYYRCpSSRl31AJvnmOvr.AX4ZawboNWEtl2OmEft' }
*/
public class PayPalIPN
{
	private String address_city;
	private String address_country;
	private String address_country_code;
	private String address_name;
	private String address_state;
	private String address_status;
	private String address_street;
	private String address_zip;
	private String amount3;
	private String btn_id;
	private String business;
	private String charset;
	private String custom;
	private String first_name;
	private String invoice;
	private String ipn_track_id;
	private String item_name;
	private String item_number;
	private String last_name;
	private String mc_amount3;
	private String mc_currency;
	private String mc_fee;
	private String mc_gross;
	private String mc_gross_1;
	private String notify_version;
	private String payer_email;
	private String payer_id;
	private String payer_status;
	private String payment_date;
	private String payment_status;
	private String payment_type;
	private String pending_reason;
	private String period3;
	private String quantity;
	private String reattempt;
	private String receiver_email;
	private String receiver_id;
	private String recurring;
	private String residence_country;
	private String shipping;
	private String subscr_date;
	private String subscr_id;
	private String tax;
	private String test_ipn;
	private String txn_id;
	private String txn_type;
	private String verify_sign;
}
