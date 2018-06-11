package com.newtouch.nwfs.gl.datamanger.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * 分户明细实体类
 * @author Administrator
 *
 */
@Entity
public class LedgerItemEntity 
{
	@Id
	private String uqledgeid;			//分户明细ID
	private String uqledgetypeid;		//分户类别ID
	private String varledgecode;		//分户明细编码
	private String varledgename;		//分户明细名称
	private String varledgefullcode;	//分户明细全编码(上级编码-本级编码)
	private String varledgefullname;	//分户明细全名称(上级名称-本级名称)
	private String uqparentid;			//上级ID
	private String intlevel;			//分户等级
	private String intislastlevel;		//是否末级(1表示末级)
	private String intstatus;			//状态(2表示启用)
	
	public LedgerItemEntity() 
	{
		super();
	}

	public LedgerItemEntity(String uqledgeid, String uqledgetypeid,
			String varledgecode, String varledgename, String varledgefullcode,
			String varledgefullname, String uqparentid, String intlevel,
			String intislastlevel, String intstatus) {
		super();
		this.uqledgeid = uqledgeid;
		this.uqledgetypeid = uqledgetypeid;
		this.varledgecode = varledgecode;
		this.varledgename = varledgename;
		this.varledgefullcode = varledgefullcode;
		this.varledgefullname = varledgefullname;
		this.uqparentid = uqparentid;
		this.intlevel = intlevel;
		this.intislastlevel = intislastlevel;
		this.intstatus = intstatus;
	}

	public String getUqledgeid() 
	{
		return uqledgeid;
	}

	public void setUqledgeid(String uqledgeid) 
	{
		this.uqledgeid = uqledgeid;
	}

	public String getUqledgetypeid() 
	{
		return uqledgetypeid;
	}

	public void setUqledgetypeid(String uqledgetypeid) 
	{
		this.uqledgetypeid = uqledgetypeid;
	}

	public String getVarledgecode() 
	{
		return varledgecode;
	}

	public void setVarledgecode(String varledgecode) 
	{
		this.varledgecode = varledgecode;
	}

	public String getVarledgename() 
	{
		return varledgename;
	}

	public void setVarledgename(String varledgename) 
	{
		this.varledgename = varledgename;
	}

	public String getVarledgefullcode() 
	{
		return varledgefullcode;
	}

	public void setVarledgefullcode(String varledgefullcode) 
	{
		this.varledgefullcode = varledgefullcode;
	}

	public String getVarledgefullname() 
	{
		return varledgefullname;
	}

	public void setVarledgefullname(String varledgefullname)
	{
		this.varledgefullname = varledgefullname;
	}

	public String getUqparentid() 
	{
		return uqparentid;
	}

	public void setUqparentid(String uqparentid) 
	{
		this.uqparentid = uqparentid;
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

	public String getIntstatus() 
	{
		return intstatus;
	}

	public void setIntstatus(String intstatus) 
	{
		this.intstatus = intstatus;
	}
	
}
