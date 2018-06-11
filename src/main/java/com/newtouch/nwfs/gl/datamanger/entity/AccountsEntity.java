package com.newtouch.nwfs.gl.datamanger.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * 会计科目（实体）
 * @author Administrator
 *
 */
@Entity
public class AccountsEntity
{
	@Id
	private String uqaccountid;		//科目ID
	private String uqaccountsetid;	//科目套ID
	private String varaccountcode;	//科目编号
	private String varaccountfullcode;	//科目编号
	private String varaccountname;	//科目名称
	private String varaccountfullname;	//科目全名称
	private String intproperty;		//科目属性
	private String uqtypeid;		//科目类别
	private String uqforeigncurrid;	//外币ID
	private String varmeasure;		//计量单位
	private String intisledge;		//是否分户核算
	private String intiscrossledge;	//是否分户交叉查询
	private String uqpreaccountid;	//追朔科目ID
	private String uqparentid;		//父级ID
	private String intislastlevel;	//是否是末及
	private String intlevel;		//科目等级
	private String intflag;			//启停
	private String intisflow;		//是否需要现金流量
	
	public AccountsEntity() 
	{
		super();
	}

	public AccountsEntity(String uqaccountid, String uqaccountsetid,
			String varaccountcode, String varaccountfullcode,
			String varaccountname, String varaccountfullname,
			String intproperty, String uqtypeid, String uqforeigncurrid,
			String varmeasure, String intisledge, String intiscrossledge,
			String uqpreaccountid, String uqparentid, String intislastlevel,
			String intlevel, String intflag, String intisflow) {
		super();
		this.uqaccountid = uqaccountid;
		this.uqaccountsetid = uqaccountsetid;
		this.varaccountcode = varaccountcode;
		this.varaccountfullcode = varaccountfullcode;
		this.varaccountname = varaccountname;
		this.varaccountfullname = varaccountfullname;
		this.intproperty = intproperty;
		this.uqtypeid = uqtypeid;
		this.uqforeigncurrid = uqforeigncurrid;
		this.varmeasure = varmeasure;
		this.intisledge = intisledge;
		this.intiscrossledge = intiscrossledge;
		this.uqpreaccountid = uqpreaccountid;
		this.uqparentid = uqparentid;
		this.intislastlevel = intislastlevel;
		this.intlevel = intlevel;
		this.intflag = intflag;
		this.intisflow = intisflow;
	}

	public String getUqaccountid() {
		return uqaccountid;
	}

	public void setUqaccountid(String uqaccountid) {
		this.uqaccountid = uqaccountid;
	}

	public String getUqaccountsetid() {
		return uqaccountsetid;
	}

	public void setUqaccountsetid(String uqaccountsetid) {
		this.uqaccountsetid = uqaccountsetid;
	}

	public String getVaraccountcode() {
		return varaccountcode;
	}

	public void setVaraccountcode(String varaccountcode) {
		this.varaccountcode = varaccountcode;
	}

	public String getVaraccountfullcode() {
		return varaccountfullcode;
	}

	public void setVaraccountfullcode(String varaccountfullcode) {
		this.varaccountfullcode = varaccountfullcode;
	}

	public String getVaraccountname() {
		return varaccountname;
	}

	public void setVaraccountname(String varaccountname) {
		this.varaccountname = varaccountname;
	}

	public String getVaraccountfullname() {
		return varaccountfullname;
	}

	public void setVaraccountfullname(String varaccountfullname) {
		this.varaccountfullname = varaccountfullname;
	}

	public String getIntproperty() {
		return intproperty;
	}

	public void setIntproperty(String intproperty) {
		this.intproperty = intproperty;
	}

	public String getUqtypeid() {
		return uqtypeid;
	}

	public void setUqtypeid(String uqtypeid) {
		this.uqtypeid = uqtypeid;
	}

	public String getUqforeigncurrid() {
		return uqforeigncurrid;
	}

	public void setUqforeigncurrid(String uqforeigncurrid) {
		this.uqforeigncurrid = uqforeigncurrid;
	}

	public String getVarmeasure() {
		return varmeasure;
	}

	public void setVarmeasure(String varmeasure) {
		this.varmeasure = varmeasure;
	}

	public String getIntisledge() {
		return intisledge;
	}

	public void setIntisledge(String intisledge) {
		this.intisledge = intisledge;
	}

	public String getIntiscrossledge() {
		return intiscrossledge;
	}

	public void setIntiscrossledge(String intiscrossledge) {
		this.intiscrossledge = intiscrossledge;
	}

	public String getUqpreaccountid() {
		return uqpreaccountid;
	}

	public void setUqpreaccountid(String uqpreaccountid) {
		this.uqpreaccountid = uqpreaccountid;
	}

	public String getUqparentid() {
		return uqparentid;
	}

	public void setUqparentid(String uqparentid) {
		this.uqparentid = uqparentid;
	}

	public String getIntislastlevel() {
		return intislastlevel;
	}

	public void setIntislastlevel(String intislastlevel) {
		this.intislastlevel = intislastlevel;
	}

	public String getIntlevel() {
		return intlevel;
	}

	public void setIntlevel(String intlevel) {
		this.intlevel = intlevel;
	}

	public String getIntflag() {
		return intflag;
	}

	public void setIntflag(String intflag) {
		this.intflag = intflag;
	}

	public String getIntisflow() {
		return intisflow;
	}

	public void setIntisflow(String intisflow) {
		this.intisflow = intisflow;
	}

}
