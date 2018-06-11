package com.newtouch.test.common;

public class ExceptionUtil
{
	private ExceptionUtil()
	{
		
	}

	public static void throwException()
	{
		throw new RuntimeException("my exception");
	}
}
