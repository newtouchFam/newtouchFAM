package com.newtouch.nwfs.platform.interceptor;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.newtouch.cloud.common.ActionJSONUtil;
import com.newtouch.nwfs.platform.session.M8Session;

/**
 * 登录认证拦截器
 */
public class LoginCheckInterceptor implements HandlerInterceptor
{
	/**
	 * 过滤URL
	 */
	private String[] filteURLs;

	/**
	 * 重登录URL
	 */
	private String reloginURL;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception
	{
		try
		{
			if (request == null)
			{
				return false;
			}

			HttpSession httpSession = request.getSession();
			if (httpSession == null)
			{
				return false;
			}

			String servletPath = request.getServletPath();
			for (String filter : this.filteURLs)
			{
				if (servletPath.startsWith(filter))
				{
					return true;
				}
			}

			M8Session m8Session = new M8Session(httpSession);

			String userID = m8Session.getUserID();
			if (userID == null || userID.length() <= 0)
			{
				/* 非法请求重定向到重登录页面 */
				this.sendRedirect(request, response);

				return false;
			}

			return true;
		}
		catch (Exception ex)
		{
			ex.printStackTrace();

			response.setContentType("text/html;charset=UTF-8");
			response.getWriter().write(ActionJSONUtil.toException(ex));
			response.getWriter().close();

			return false;
		}
	}

	/**
	 * 重定向到重登录页面
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void sendRedirect(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.sendRedirect(request.getContextPath() + this.reloginURL);
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

	public String[] getFilteURLs()
	{
		return filteURLs;
	}
	public void setFilteURLs(String[] filteURLs)
	{
		this.filteURLs = filteURLs;
	}
	public String getReloginURL()
	{
		return reloginURL;
	}
	public void setReloginURL(String reloginURL)
	{
		this.reloginURL = reloginURL;
	}

}