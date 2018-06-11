package com.newtouch.nwfs.platform.session;

import javax.servlet.http.HttpSession;

public class M8Session
{
	protected HttpSession session;
	public HttpSession getSession()
	{
		return session;
	}
	public void setSession(HttpSession session)
	{
		this.session = session;
	}

	public M8Session(HttpSession session)
	{
		this.session = session;
	}

	public void setAttribute(String name, Object attr)
	{
		session.setAttribute(name, attr);
	}
	public Object getAttribute(String name)
	{
		return session.getAttribute(name);
	}
	public void setAttr(String name, String attr)
	{
		this.getSession().setAttribute(name, attr);
	}

	public String getAttr(String name)
	{
		Object o = this.getSession().getAttribute(name);
		return (o != null ? o.toString():"");
	}

	public String getSetID() 
	{
		return getAttr(M8_SETID);
	}
	public void setSetID(String setID) 
	{
		setAttr(M8_SETID, setID);
	}
	public String getUserCode() 
	{
		return getAttr(M8_USERCODE);
	}
	public void setUserCode(String userCode) 
	{
		setAttr(M8_USERCODE, userCode);
	}
	public String getCompanyName() 
	{
		return getAttr(M8_COMPANYNAME);
	}
	public void setCompanyName(String companyName) 
	{
		setAttr(M8_COMPANYNAME, companyName);
	}
	public String getCompanyCode() 
	{
		return getAttr(M8_COMPANYCODE);
	}
	public void setCompanyCode(String companyCode) 
	{
		setAttr(M8_COMPANYCODE, companyCode);
	}
	public String getCompanyID() 
	{
		return getAttr(M8_COMPANYID);
	}
	public void setCompanyID(String companyID) 
	{
		setAttr(M8_COMPANYID, companyID);
	}
	public String getUserName() 
	{
		return getAttr(M8_USERNAME);
	}
	public void setUserName(String userName) 
	{
		setAttr(M8_USERNAME, userName);
	}
	public String getUserID() 
	{
		return getAttr(M8_USERID);
	}
	public void setUserID(String userID) 
	{
		setAttr(M8_USERID, userID);
	}
	@Deprecated
	public String getUserAuth() 
	{
		return getAttr(M8_USERAUTH);
	}
	@Deprecated
	public void setUserAuth(String userAuth) 
	{
		setAttr(M8_USERAUTH, userAuth);
	}
	
	private final String M8_USERAUTH = "M8_USERAUTH";
	private final String M8_SETID = "M8_SETID";
	private final String M8_USERID = "M8_USERID";
	private final String M8_USERCODE = "M8_USERCODE";
	private final String M8_USERNAME = "M8_USERNAME";
	private final String M8_COMPANYID = "M8_COMPANYID";
	private final String M8_COMPANYCODE = "M8_COMPANYCODE";
	private final String M8_COMPANYNAME = "M8_COMPANYNAME";	
}
