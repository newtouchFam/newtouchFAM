package com.newtouch.nwfs.gl.vouchermanager.entity;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * 凭证主信息
 * @author Administrator
 */
@Entity
public class VoucherMain 
{
	@Id
	private String uqvoucherid;
	private int intvouchernum;
	private String uqnumbering;
	private String uqnumberingname;
	private String uqcompanyid;
	private int intcompanyseq;
	private int intaffix;
	private String uqglobalperiodid;
	private String periodname;
	private String intyearmonth;
	private String dtbegin;
	private String dtend;
	private BigDecimal mnydebitsum;
	private BigDecimal mnycreditsum;
	private String uqfinacialmanagerid;
	private String uqaccountantid;
	private String uqcasherid;
	private String uqcheckerid;
	private String uqfillerid;
	private String uqaccountantname;
	private String uqcashername;
	private String uqcheckername;
	private String uqfillername;
	private String dtaccountant;
	private String dtcasher;
	private String dtchecker;
	private String dtfiller;
	private String dtaccountantsrv;
	private String dtcashersrv;
	private String dtcheckersrv;
	private String dtfillersrv;
	private String dtdate;
	private String dtdatesrv;
	private int intflag;
	private int intcashflag;
	private int intdeleteflag;
	private String uqcancelid;
	public String getUqvoucherid() {
		return uqvoucherid;
	}
	public void setUqvoucherid(String uqvoucherid) {
		this.uqvoucherid = uqvoucherid;
	}
	public int getIntvouchernum() {
		return intvouchernum;
	}
	public void setIntvouchernum(int intvouchernum) {
		this.intvouchernum = intvouchernum;
	}
	public String getUqnumbering() {
		return uqnumbering;
	}
	public void setUqnumbering(String uqnumbering) {
		this.uqnumbering = uqnumbering;
	}
	public String getUqcompanyid() {
		return uqcompanyid;
	}
	public void setUqcompanyid(String uqcompanyid) {
		this.uqcompanyid = uqcompanyid;
	}
	public int getIntcompanyseq() {
		return intcompanyseq;
	}
	public void setIntcompanyseq(int intcompanyseq) {
		this.intcompanyseq = intcompanyseq;
	}
	public int getIntaffix() {
		return intaffix;
	}
	public void setIntaffix(int intaffix) {
		this.intaffix = intaffix;
	}
	public String getUqglobalperiodid() {
		return uqglobalperiodid;
	}
	public void setUqglobalperiodid(String uqglobalperiodid) {
		this.uqglobalperiodid = uqglobalperiodid;
	}
	public BigDecimal getMnydebitsum() {
		return mnydebitsum;
	}
	public void setMnydebitsum(BigDecimal mnydebitsum) {
		this.mnydebitsum = mnydebitsum;
	}
	public BigDecimal getMnycreditsum() {
		return mnycreditsum;
	}
	public void setMnycreditsum(BigDecimal mnycreditsum) {
		this.mnycreditsum = mnycreditsum;
	}
	public String getUqfinacialmanagerid() {
		return uqfinacialmanagerid;
	}
	public void setUqfinactialmanagerid(String uqfinacialmanagerid) {
		this.uqfinacialmanagerid = uqfinacialmanagerid;
	}
	public String getUqaccountantid() {
		return uqaccountantid;
	}
	public void setUqaccountantid(String uqaccountantid) {
		this.uqaccountantid = uqaccountantid;
	}
	public String getUqcasherid() {
		return uqcasherid;
	}
	public void setUqcasherid(String uqcasherid) {
		this.uqcasherid = uqcasherid;
	}
	public String getUqcheckerid() {
		return uqcheckerid;
	}
	public void setUqcheckerid(String uqcheckerid) {
		this.uqcheckerid = uqcheckerid;
	}
	public String getUqfillerid() {
		return uqfillerid;
	}
	public void setUqfillerid(String uqfillerid) {
		this.uqfillerid = uqfillerid;
	}
	public String getDtaccountant() {
		return dtaccountant;
	}
	public void setDtaccountant(String dtaccountant) {
		this.dtaccountant = dtaccountant;
	}
	public String getDtcasher() {
		return dtcasher;
	}
	public void setDtcasher(String dtcasher) {
		this.dtcasher = dtcasher;
	}
	public String getDtchecker() {
		return dtchecker;
	}
	public void setDtchecker(String dtchecker) {
		this.dtchecker = dtchecker;
	}
	public String getDtfiller() {
		return dtfiller;
	}
	public void setDtfiller(String dtfiller) {
		this.dtfiller = dtfiller;
	}
	public String getDtaccountantsrv() {
		return dtaccountantsrv;
	}
	public void setDtaccountantsrv(String dtaccountantsrv) {
		this.dtaccountantsrv = dtaccountantsrv;
	}
	public String getDtcashersrv() {
		return dtcashersrv;
	}
	public void setDtcashersrv(String dtcashersrv) {
		this.dtcashersrv = dtcashersrv;
	}
	public String getDtcheckersrv() {
		return dtcheckersrv;
	}
	public void setDtcheckersrv(String dtcheckersrv) {
		this.dtcheckersrv = dtcheckersrv;
	}
	public String getDtfillersrv() {
		return dtfillersrv;
	}
	public void setDtfillersrv(String dtfillersrv) {
		this.dtfillersrv = dtfillersrv;
	}
	public int getIntflag() {
		return intflag;
	}
	public void setIntflag(int intflag) {
		this.intflag = intflag;
	}
	public int getIntcashflag() {
		return intcashflag;
	}
	public void setIntcashflag(int intcashflag) {
		this.intcashflag = intcashflag;
	}
	public int getIntdeleteflag() {
		return intdeleteflag;
	}
	public void setIntdeleteflag(int intdeleteflag) {
		this.intdeleteflag = intdeleteflag;
	}
	public String getUqcancelid() {
		return uqcancelid;
	}
	public void setUqcancelid(String uqcancelid) {
		this.uqcancelid = uqcancelid;
	}
	public String getPeriodname() {
		return periodname;
	}
	public void setPeriodname(String periodname) {
		this.periodname = periodname;
	}
	public String getIntyearmonth() {
		return intyearmonth;
	}
	public void setIntyearmonth(String intyearmonth) {
		this.intyearmonth = intyearmonth;
	}
	public String getDtbegin() {
		return dtbegin;
	}
	public void setDtbegin(String dtbegin) {
		this.dtbegin = dtbegin;
	}
	public String getDtend() {
		return dtend;
	}
	public void setDtend(String dtend) {
		this.dtend = dtend;
	}
	public void setUqfinacialmanagerid(String uqfinacialmanagerid) {
		this.uqfinacialmanagerid = uqfinacialmanagerid;
	}
	public String getDtdate() {
		return dtdate;
	}
	public void setDtdate(String dtdate) {
		this.dtdate = dtdate;
	}
	public String getDtdatesrv() {
		return dtdatesrv;
	}
	public void setDtdatesrv(String dtdatesrv) {
		this.dtdatesrv = dtdatesrv;
	}
	public String getUqnumberingname() {
		return uqnumberingname;
	}
	public void setUqnumberingname(String uqnumberingname) {
		this.uqnumberingname = uqnumberingname;
	}
	public String getUqaccountantname() {
		return uqaccountantname;
	}
	public void setUqaccountantname(String uqaccountantname) {
		this.uqaccountantname = uqaccountantname;
	}
	public String getUqcashername() {
		return uqcashername;
	}
	public void setUqcashername(String uqcashername) {
		this.uqcashername = uqcashername;
	}
	public String getUqcheckername() {
		return uqcheckername;
	}
	public void setUqcheckername(String uqcheckername) {
		this.uqcheckername = uqcheckername;
	}
	public String getUqfillername() {
		return uqfillername;
	}
	public void setUqfillername(String uqfillername) {
		this.uqfillername = uqfillername;
	}
	
}
