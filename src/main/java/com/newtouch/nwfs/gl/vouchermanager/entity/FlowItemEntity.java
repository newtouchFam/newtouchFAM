package com.newtouch.nwfs.gl.vouchermanager.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class FlowItemEntity 
{
	@Id
	public String uqflowitemid;
	public String varcode;
	public String varname;
	public String vartypecode;
	public String vartypename;
	
	public String getUqflowitemid() 
	{
		return uqflowitemid;
	}
	public void setUqflowitemid(String uqflowitemid) 
	{
		this.uqflowitemid = uqflowitemid;
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
}
