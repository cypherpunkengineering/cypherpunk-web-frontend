package com.cypherpunk.appengine.beans;

public class CypherpunkPricingPlans
{
	private static class PricingGroup
	{
		private String price;
		private String paypalPlanId;
		private String bitpayPlanId;
	}

	private PricingGroup monthly;
	private PricingGroup semiannually;
	private PricingGroup annually;

	public CypherpunkPricingPlans ()
	{
		this.monthly = new PricingGroup();
		this.semiannually = new PricingGroup();
		this.annually = new PricingGroup();
	}
}
