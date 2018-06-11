package com.newtouch.nwfs.gl.datamanger.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class FlowItemsModelEntiy 
{
	@Id
	private String itemsid;	//项目Id
	private String varitemscode ;	//编码
	private String varitemsname ;	//名称
	private String vartypecode ;//所属类别code
	private String uqflowtypeid ;		//现金流量类别Id
	private String intstatus ;	//状态（0新增，1启用，2停用）
	
	public FlowItemsModelEntiy() 
	{
		super();
	}

	public FlowItemsModelEntiy(String itemsid, String varitemscode,
			String varitemsname, String vartypecode, String uqflowtypeid,
			String intstatus) 
	{
		super();
		this.itemsid = itemsid;
		this.varitemscode = varitemscode;
		this.varitemsname = varitemsname;
		this.vartypecode = vartypecode;
		this.uqflowtypeid = uqflowtypeid;
		this.intstatus = intstatus;
	}

	public String getItemsid() 
	{
		return itemsid;
	}

	public void setItemsid(String itemsid)
	{
		this.itemsid = itemsid;
	}

	public String getVaritemscode()
	{
		return varitemscode;
	}

	public void setVaritemscode(String varitemscode)
	{
		this.varitemscode = varitemscode;
	}

	public String getVaritemsname() 
	{
		return varitemsname;
	}

	public void setVaritemsname(String varitemsname)
	{
		this.varitemsname = varitemsname;
	}

	public String getVartypecode() 
	{
		return vartypecode;
	}

	public void setVartypecode(String vartypecode) 
	{
		this.vartypecode = vartypecode;
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
