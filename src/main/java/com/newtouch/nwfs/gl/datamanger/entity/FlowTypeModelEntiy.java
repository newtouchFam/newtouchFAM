package com.newtouch.nwfs.gl.datamanger.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class FlowTypeModelEntiy 
{
	@Id
	private String typeid ;	//类别Id
	private String vartypecode ;	//编码
	private String vartypename ;	//名称
	private String parentcode ;	//上级code
	private String uqparentid ;		//上级Id
	private String varfullcode ;	//全编码
	private String varfullname ;	//全名称
	private String intlevel ;	//级次
	private String intislastlevel ;	//是否末级
	
	public FlowTypeModelEntiy() 
	{
		super();
	}

	public FlowTypeModelEntiy(String typeid, String vartypecode,
			String vartypename, String parentcode, String uqparentid,
			String varfullcode, String varfullname, String intlevel,
			String intislastlevel) 
	{
		super();
		this.typeid = typeid;
		this.vartypecode = vartypecode;
		this.vartypename = vartypename;
		this.parentcode = parentcode;
		this.uqparentid = uqparentid;
		this.varfullcode = varfullcode;
		this.varfullname = varfullname;
		this.intlevel = intlevel;
		this.intislastlevel = intislastlevel;
	}

	public String getTypeid() 
	{
		return typeid;
	}

	public void setTypeid(String typeid) 
	{
		this.typeid = typeid;
	}

	public String getVartypecode() 
	{
		return vartypecode;
	}

	public void setVartypecode(String vartypecode) 
	{
		this.vartypecode = vartypecode;
	}

	public String getVartypename()
	{
		return vartypename;
	}

	public void setVartypename(String vartypename)
	{
		this.vartypename = vartypename;
	}

	public String getParentcode() 
	{
		return parentcode;
	}

	public void setParentcode(String parentcode) 
	{
		this.parentcode = parentcode;
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
