package com.newtouch.test;

import java.security.MessageDigest;

import com.newtouch.cloud.common.encrypt.SHA1;

public class CryptoTest
{
	public static void main(String[] params) throws Exception
	{
		String aaa = "47CF7FCD1C22516A97468921E5CF67415AC8B07C";
		byte[] bbb = aaa.getBytes();
		String ccc = SHA1.ByteToHex(bbb);
		System.out.println(ccc);

		String password = "BCred-45-bdA1234561111111111111111111";
		System.out.println(password);

		byte[] b1 = hash(StringToByte(password));
		for(byte a : b1)
		{
			System.out.println(a);
		}
		String s1 = ByteToString(b1);
		System.out.println(s1);
		System.out.println(byte2hex(b1));
		System.out.println(ByteToHex(b1));
		System.out.println(byteArrayToHex(b1));
		System.out.println(SHA1.ComputeHashString(password));
		System.out.println(SHA1.ComputeHashString(password));
		System.out.println(SHA1.ComputeHashString(password));
	}

	public static byte[] hash(byte[] bytSource) throws Exception
	{
		MessageDigest md = MessageDigest.getInstance("SHA-1");
		md.update(bytSource);

		return md.digest();
	}

	private static byte[] StringToByte(String strSource) throws Exception
	{
		return strSource.getBytes("ISO-8859-1");
	}

	private static String ByteToString(byte[] b) throws Exception
	{
		return new String(b, "ISO-8859-1");
	}

	public static String byte2hex(byte[] b)
	{
		String hs = "";
		String stmp = "";
		for (int n = 0; n < b.length; n++)
		{
			stmp = (java.lang.Integer.toHexString(b[n] & 0xFF));
			if (stmp.length() == 1)
				hs = hs + "0" + stmp;
			else
				hs = hs + stmp;
//			if (n < b.length - 1)
//				hs = hs + ":";
		}
		return hs.toUpperCase();
	}

	public static String ByteToHex(byte[] byteSource)
	{
		String hs = "";
		for (byte b : byteSource)
		{
			String stmp = Integer.toHexString(b & 0xFF);
			if (stmp.length() == 1)
			{
				stmp = "0" + stmp;
			}

			hs += stmp;
		}

		return hs.toUpperCase();
	}
	
	public static String byteArrayToHex(byte[] byteArray)
	{
		// 首先初始化一个字符数组，用来存放每个16进制字符
		char[] hexDigits = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };

		// new一个字符数组，这个就是用来组成结果字符串的（解释一下：一个byte是八位二进制，也就是2位十六进制字符（2的8次方等于16的2次方））
		char[] resultCharArray = new char[byteArray.length * 2];

		// 遍历字节数组，通过位运算（位运算效率高），转换成字符放到字符数组中去
		int index = 0;

		for (byte b : byteArray)
		{
			resultCharArray[index++] = hexDigits[b >>> 4 & 0xf];
			resultCharArray[index++] = hexDigits[b & 0xf];
		}

		// 字符数组组合成字符串返回
		return new String(resultCharArray);
	}
}
