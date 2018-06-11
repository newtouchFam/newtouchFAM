package com.newtouch.nwfs.gl.datamanger.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class FlowItemsEntity
{
	@Id
	private String uqflowitemid;	//项目Id
	private String varcode ;	//编码
	private String varname ;	//名称
	private String uqflowtypeid ;		//现金流量类别Id
	private String intstatus ;	//状态（0新增，1启用，2停用）
	
	public FlowItemsEntity() 
	{
		super();
	}
	
	public FlowItemsEntity(String uqflowitemid, String varcode, String varname,
			String uqflowtypeid, String intstatus) 
	{
		super();
		this.uqflowitemid = uqflowitemid;
		this.varcode = varcode;
		this.varname = varname;
		this.uqflowtypeid = uqflowtypeid;
		this.intstatus = intstatus;
	}

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

	public String getUqflowtypeid()
	{
		return uqflowtypeid;
	}

	public void setUqflowtypeid(String uqflowtypeid) 
	{
		this.uqflowtypeid = uqflowtypeid;
	}

	public String getIntstatus()
	{
		return intstatus;
	}

	public void setIntstatus(String intstatus) 
	{
		this.intstatus = intstatus;
	}
	
}
