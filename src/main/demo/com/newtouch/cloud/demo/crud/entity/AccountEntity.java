package com.newtouch.cloud.demo.crud.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class AccountEntity
{
	@Id
	private String accountID;
	private String accountCode;
	private String accountName;
	public String getAccountID()
	{
		return accountID;
	}
	public void setAccountID(String accountID)
	{
		this.accountID = accountID;
	}
	public String getAccountCode()
	{
		return accountCode;
	}
	public void setAccountCode(String accountCode)
	{
		this.accountCode = accountCode;
	}
	public String getAccountName()
	{
		return accountName;
	}
	public void setAccountName(String accountName)
	{
		this.accountName = accountName;
	}
}
