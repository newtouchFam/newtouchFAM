package com.newtouch.nwfs.gl.voucherbook.nsr;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import com.newtouch.nsreport.calculator.NSRCellCalculatorFactory;

/**
 * NSR报表配置初始化加载器
 */
public class NSRInitServlet extends HttpServlet
{
	private static final long serialVersionUID = 5631901251972907850L;

	public void init() throws ServletException
	{
		try
		{
			NSRCellCalculatorFactory.loadConfig();

			System.out.println("NSR报表加载配置完成");
		}
		catch (Exception ex)
		{
			System.out.println("NSR报表加载配置失败");
			ex.printStackTrace();
		}
	}
}
