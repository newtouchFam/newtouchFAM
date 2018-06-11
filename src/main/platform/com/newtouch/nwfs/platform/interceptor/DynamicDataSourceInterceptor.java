package com.newtouch.nwfs.platform.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.newtouch.cloud.common.datasouce.dynamic.DataSourceContextHolder;
import com.newtouch.nwfs.platform.session.M8Session;

/**
 * 动态多数据源切换拦截器
 * 针对每一次请求进行切换
 */
public class DynamicDataSourceInterceptor implements HandlerInterceptor
{
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception
	{
		try
		{
			if (request == null)
			{
				return true;
			}

			HttpSession httpSession = request.getSession();
			if (httpSession == null)
			{
				return true;
			}

			M8Session m8Session = new M8Session(httpSession);

			String setID = m8Session.getSetID();
			if (setID == null || setID.length() <= 0)
			{
				return true;
			}

			DataSourceContextHolder.setDataSourceType(setID);
		}
		catch(Exception ex)
		{
			return true;
		}
		
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception
	{
		// TODO Auto-generated method stub
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception
	{
		// TODO Auto-generated method stub
	}
}