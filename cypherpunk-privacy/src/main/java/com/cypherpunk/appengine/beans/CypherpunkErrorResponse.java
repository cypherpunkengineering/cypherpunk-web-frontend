package com.cypherpunk.appengine.beans;

public class CypherpunkErrorResponse
{
	public Integer code;
	public String status;
	public String message;
	public Object data;

	public CypherpunkErrorResponse(Integer code)
	{
		this.code = code;
	}
	public CypherpunkErrorResponse(Integer code, String status, String message)
	{
		this.code = code;
		this.status = status;
		this.message = message;
	}
}
