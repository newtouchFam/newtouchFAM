package com.newtouch.cloud.demo.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ReportDataEntity
{
	@Id
	private String code;
	private String name;
	private double debit;
	private double credit;
	public String getCode()
	{
		return code;
	}
	public void setCode(String code)
	{
		this.code = code;
	}
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public double getDebit()
	{
		return debit;
	}
	public void setDebit(double debit)
	{
		this.debit = debit;
	}
	public double getCredit()
	{
		return credit;
	}
	public void setCredit(double credit)
	{
		this.credit = credit;
	}
}
