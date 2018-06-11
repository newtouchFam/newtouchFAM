package com.newtouch.nwfs.gl.datamanger.entity;


public class LedgePeriodEntity 
{
	private String uqcompanyid;//单位ID
	private String uqglobalperiodid;//全局会计期ID
	private String uqaccountid;//会计科目ID
	private String uqledgeid;//分户ID
	private String mnydebitperiodall;//全部本期借方金额
	private String mnycreditperiodall;//全部本期贷方金额
	private String mnyfdebitperiodall;//全部本期借方外币金额
	private String mnyfcreditperiodall;//全部本期贷方外币金额
	private String mnydebitperiod;//已入账本期借方金额
	private String mnycreditperiod;//已入账本期贷方金额
	private String mnyfdebitperiod;//已入账本期借方外币金额
	private String mnyfcreditperiod;//已入账本期贷方外币金额
	private String mnydebitcashed;//已出纳本期借方金额
	private String mnycreditcashed;//已出纳本期贷方金额
	private String mnyfdebitcashed;//已出纳本期借方外币金额
	private String mnyfcreditcashed;//已出纳本期贷方外币金额
	
	public String getUqcompanyid() 
	{
		return uqcompanyid;
	}
	public void setUqcompanyid(String uqcompanyid) 
	{
		this.uqcompanyid = uqcompanyid;
	}
	public String getUqglobalperiodid()
	{
		return uqglobalperiodid;
	}
	public void setUqglobalperiodid(String uqglobalperiodid) 
	{
		this.uqglobalperiodid = uqglobalperiodid;
	}
	public String getUqaccountid() 
	{
		return uqaccountid;
	}
	public void setUqaccountid(String uqaccountid) 
	{
		this.uqaccountid = uqaccountid;
	}
	public String getUqledgeid()
	{
		return uqledgeid;
	}
	public void setUqledgeid(String uqledgeid)
	{
		this.uqledgeid = uqledgeid;
	}
	public String getMnydebitperiodall()
	{
		return mnydebitperiodall;
	}
	public void setMnydebitperiodall(String mnydebitperiodall) 
	{
		this.mnydebitperiodall = mnydebitperiodall;
	}
	public String getMnycreditperiodall()
	{
		return mnycreditperiodall;
	}
	public void setMnycreditperiodall(String mnycreditperiodall) 
	{
		this.mnycreditperiodall = mnycreditperiodall;
	}
	public String getMnyfdebitperiodall() 
	{
		return mnyfdebitperiodall;
	}
	public void setMnyfdebitperiodall(String mnyfdebitperiodall)
	{
		this.mnyfdebitperiodall = mnyfdebitperiodall;
	}
	public String getMnyfcreditperiodall() 
	{
		return mnyfcreditperiodall;
	}
	public void setMnyfcreditperiodall(String mnyfcreditperiodall) 
	{
		this.mnyfcreditperiodall = mnyfcreditperiodall;
	}
	public String getMnydebitperiod() 
	{
		return mnydebitperiod;
	}
	public void setMnydebitperiod(String mnydebitperiod)
	{
		this.mnydebitperiod = mnydebitperiod;
	}
	public String getMnycreditperiod()
	{
		return mnycreditperiod;
	}
	public void setMnycreditperiod(String mnycreditperiod) 
	{
		this.mnycreditperiod = mnycreditperiod;
	}
	public String getMnyfdebitperiod() 
	{
		return mnyfdebitperiod;
	}
	public void setMnyfdebitperiod(String mnyfdebitperiod) 
	{
		this.mnyfdebitperiod = mnyfdebitperiod;
	}
	public String getMnyfcreditperiod() 
	{
		return mnyfcreditperiod;
	}
	public void setMnyfcreditperiod(String mnyfcreditperiod) 
	{
		this.mnyfcreditperiod = mnyfcreditperiod;
	}
	public String getMnydebitcashed() 
	{
		return mnydebitcashed;
	}
	public void setMnydebitcashed(String mnydebitcashed)
	{
		this.mnydebitcashed = mnydebitcashed;
	}
	public String getMnycreditcashed() 
	{
		return mnycreditcashed;
	}
	public void setMnycreditcashed(String mnycreditcashed)
	{
		this.mnycreditcashed = mnycreditcashed;
	}
	public String getMnyfdebitcashed() 
	{
		return mnyfdebitcashed;
	}
	public void setMnyfdebitcashed(String mnyfdebitcashed) 
	{
		this.mnyfdebitcashed = mnyfdebitcashed;
	}
	public String getMnyfcreditcashed() 
	{
		return mnyfcreditcashed;
	}
	public void setMnyfcreditcashed(String mnyfcreditcashed) 
	{
		this.mnyfcreditcashed = mnyfcreditcashed;
	}
}
