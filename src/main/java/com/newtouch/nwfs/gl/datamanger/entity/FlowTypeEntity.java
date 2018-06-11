package com.newtouch.nwfs.gl.datamanger.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class FlowTypeEntity
{
	@Id
	private String uqflowtypeid ;	//类别Id
	private String varcode ;	//编码
	private String varname ;	//名称
	private String uqparentid ;		//上级Id
	private String varfullcode ;	//全编码
	private String varfullname ;	//全名称
	private String intlevel ;	//级次
	private String intislastlevel ;	//是否末级
	
	public FlowTypeEntity() 
	{
		super();
	}
	
	public FlowTypeEntity(String uqflowtypeid, String varcode, String varname,
			String uqparentid, String varfullcode, String varfullname,
			String intlevel, String intislastlevel) 
	{
		super();
		this.uqflowtypeid = uqflowtypeid;
		this.varcode = varcode;
		this.varname = varname;
		this.uqparentid = uqparentid;
		this.varfullcode = varfullcode;
		this.varfullname = varfullname;
		this.intlevel = intlevel;
		this.intislastlevel = intislastlevel;
	}

	public String getUqflowtypeid() 
	{
		return uqflowtypeid;
	}

	public void setUqflowtypeid(String uqflowtypeid) 
	{
		this.uqflowtypeid = uqflowtypeid;
	}

	public String getVarcode() 
	{
		return varcode;
	}

	public void setVarcode(String varcode) 
	{
		this.varcode = varcode;
	}

	public String getVarname() 
	{
		return varname;
	}

	public void setVarname(String varname) 
	{
		this.varname = varname;
	}

	public String getUqparentid() 
	{
		return uqparentid;
	}

	public void setUqparentid(String uqparentid) 
	{
		this.uqparentid = uqparentid;
	}

	public String getVarfullcode() 
	{
		return varfullcode;
	}

	public void setVarfullcode(String varfullcode) 
	{
		this.varfullcode = varfullcode;
	}

	public String getVarfullname() 
	{
		return varfullname;
	}

	public void setVarfullname(String varfullname) 
	{
		this.varfullname = varfullname;
	}

	public String getIntlevel() 
	{
		return intlevel;
	}

	public void setIntlevel(String intlevel) 
	{
		this.intlevel = intlevel;
	}

	public String getIntislastlevel() 
	{
		return intislastlevel;
	}

	public void setIntislastlevel(String intislastlevel) 
	{
		this.intislastlevel = intislastlevel;
	}
	
}
