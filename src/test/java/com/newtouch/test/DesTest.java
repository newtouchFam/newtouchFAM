package com.newtouch.test;

import com.newtouch.cloud.common.encrypt.TripleDesUtil;

/**
 * 三重DES加密解密测试
 */
public class DesTest
{
	public static void main(String[] params) throws Exception
	{
		String password = "aaaaaa";
		System.out.println(password);

		String mw = TripleDesUtil.Encode(password, "a", "a", "a");
		System.out.println(mw);

		System.out.println(TripleDesUtil.Encode(password, "a", "a", "a"));
		System.out.println(TripleDesUtil.Encode(password, "a", "a", "a"));
		System.out.println(TripleDesUtil.Encode(password, "a", "a", "a"));

		System.out.println(TripleDesUtil.Decode(mw, "a", "a", "a"));

		int[] bt = TripleDesUtil.strToBt(password);
		System.out.println(TripleDesUtil.bt64ToHex(bt));
	}
}
