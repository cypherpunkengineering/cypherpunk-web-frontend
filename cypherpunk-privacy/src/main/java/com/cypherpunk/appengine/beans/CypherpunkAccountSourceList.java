package com.cypherpunk.appengine.beans;

import java.util.ArrayList;
import java.util.List;

public class CypherpunkAccountSourceList
{
	private static class source
	{
		private String id;
		private String brand;
		private String last4;
		private int exp_month;
		private int exp_year;
	}

	private String default_source;
	private List<source> sources;

	CypherpunkAccountSourceList()
	{
		this.sources = new ArrayList<source>();
	}
}
