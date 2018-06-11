package com.newtouch.nwfs.gl.datamanger.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * 分户实体类
 * @author Administrator
 *
 */
@Entity
public class LedgerTypeEntity
{
	@Id
	private String uqledgetypeid;		//分户类别ID
	private String varledgetypecode;	//分户类别编码
	private String varledgetypename;	//分户类别名称
	private String uqparentid;			//上级ID
	private String intislastlevel;		//是否末级(1表示末级)
	private String intstatus;			//状态(2表示启用)
	
	public LedgerTypeEntity() 
	{
		super();
	}

	public LedgerTypeEntity(String uqledgetypeid, String varledgetypecode,
			String varledgetypename, String uqparentid, String intislastlevel,
			String intstatus) 
	{
		super();
		this.uqledgetypeid = uqledgetypeid;
		this.varledgetypecode = varledgetypecode;
		this.varledgetypename = varledgetypename;
		this.uqparentid = uqparentid;
		this.intislastlevel = intislastlevel;
		this.intstatus = intstatus;
	}

	public String getUqledgetypeid() 
	{
		return uqledgetypeid;
	}

	public void setUqledgetypeid(String uqledgetypeid) 
	{
		this.uqledgetypeid = uqledgetypeid;
	}

	public String getVarledgetypecode() 
	{
		return varledgetypecode;
	}

	public void setVarledgetypecode(String varledgetypecode) 
	{
		this.varledgetypecode = varledgetypecode;
	}

	public String getVarledgetypename() 
	{
		return varledgetypename;
	}

	public void setVarledgetypename(String varledgetypename) 
	{
		this.varledgetypename = varledgetypename;
	}

	public String getUqparentid() 
	{
		return uqparentid;
	}

	public void setUqparentid(String uqparentid) 
	{
		this.uqparentid = uqparentid;
	}

	public String getIntislastlevel() 
	{
		return intislastlevel;
	}

	public void setIntislastlevel(String intislastlevel) 
	{
		this.intislastlevel = intislastlevel;
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
