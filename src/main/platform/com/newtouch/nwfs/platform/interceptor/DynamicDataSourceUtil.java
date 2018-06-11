package com.newtouch.nwfs.platform.interceptor;

import javax.servlet.http.HttpSession;

import com.newtouch.cloud.common.datasouce.dynamic.DataSourceContextHolder;
import com.newtouch.nwfs.platform.session.M8Session;

/**
 * 账套工具类
 */
public class DynamicDataSourceUtil
{
	private DynamicDataSourceUtil()
	{
	}

	/**
	 * 切换账套
	 * @param setCode		账套代码
	 * @param httpSession
	 */
	public static void changeSet(HttpSession httpSession, String setCode)
	{
		DataSourceContextHolder.setDataSourceType(setCode);

		M8Session m8Session = new M8Session(httpSession);
		m8Session.setSetID(setCode);
	}
}