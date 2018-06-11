package com.newtouch.nwfs.gl.csmanager.bp;

import java.util.Date;
import java.util.List;

import javax.xml.rpc.holders.StringHolder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.nwfs.gl.csmanager.dao.CheckSetIDdao;

@Service
@Transactional
public class CheckSetIDbp 
{
	private CheckSetIDdao setIDdao;
	public void checkSetID(String SetID, StringHolder errormsg)
	{
		List<EntityMap> entitys = this.setIDdao.checkSetID(SetID);
		EntityMap entity = new EntityMap();
		if (entitys.size()>0) 
		{
			entity = entitys.get(0);
			String status = entity.getString("Status");
			//验证状态状态
			if (!status.equals("1")) 
			{
				errormsg.value ="账套号不正确!";
				return;
			}
			//验证账套有效期
			Date endDate = (Date)entity.get("ValidDateEnd");
			Date nowDate = new Date();
			if (nowDate.getTime() >= endDate.getTime())
			{
				errormsg.value ="账套有效期已过!";
				return;
			}
		}
		else 
		{
			errormsg.value = "账套号不正确!";
		}
	}
	
	public CheckSetIDdao getSetIDdao() 
	{
		return setIDdao;
	}
	public void setSetIDdao(CheckSetIDdao setIDdao) 
	{
		this.setIDdao = setIDdao;
	}
}
