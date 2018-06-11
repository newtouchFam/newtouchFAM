package com.newtouch.nwfs.gl.datamanger.entity;

/**
 * 会计科目组（实体）
 * @author Administrator
 *
 */
public class AccountGroupEntity 
{
	private String uqaccountgroupid;	//科目组ID
	private String uqaccountsetid;		//科目套ID
	private String uqparentid;			//上级科目组ID
	private String varaccountgroupcode;	//科目组编号
	private String varaccountgroupfullcode;//科目组全编号
	private String varaccountgroupname;	//科目组名称
	private String varaccountgroupfullname;//科目组全名称
	private String intislastlevel;		//是否为末及
	
	public String getUqaccountgroupid() 
	{
		return uqaccountgroupid;
	}
	
	public void setUqaccountgroupid(String uqaccountgroupid)
	{
		this.uqaccountgroupid = uqaccountgroupid;
	}
	
	public String getUqaccountsetid() 
	{
		return uqaccountsetid;
	}
	
	public void setUqaccountsetid(String uqaccountsetid) 
	{
		this.uqaccountsetid = uqaccountsetid;
	}
	
	public String getUqparentid() 
	{
		return uqparentid;
	}
	
	public void setUqparentid(String uqparentid) 
	{
		this.uqparentid = uqparentid;
	}
	
	public String getVaraccountgroupcode() 
	{
		return varaccountgroupcode;
	}
	
	public void setVaraccountgroupcode(String varaccountgroupcode) 
	{
		this.varaccountgroupcode = varaccountgroupcode;
	}
	
	public String getVaraccountgroupfullcode() 
	{
		return varaccountgroupfullcode;
	}
	
	public void setVaraccountgroupfullcode(String varaccountgroupfullcode) 
	{
		this.varaccountgroupfullcode = varaccountgroupfullcode;
	}
	
	public String getVaraccountgroupname() 
	{
		return varaccountgroupname;
	}
	
	public void setVaraccountgroupname(String varaccountgroupname) 
	{
		this.varaccountgroupname = varaccountgroupname;
	}

	public String getVaraccountgroupfullname()
	{
		return varaccountgroupfullname;
	}

	public void setVaraccountgroupfullname(String varaccountgroupfullname)
	{
		this.varaccountgroupfullname = varaccountgroupfullname;
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
