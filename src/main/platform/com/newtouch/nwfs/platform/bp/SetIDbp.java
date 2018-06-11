package com.newtouch.nwfs.platform.bp;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.xml.rpc.holders.StringHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.nwfs.platform.dao.SetIDdao;

/**
 * 登入验证帐套
 */
@Service
@Transactional
public class SetIDbp 
{
	@Autowired
	private SetIDdao setIDdao;
	
	/**
	 * 登入验证帐套
	 * @param SetID
	 * @param errormsg
	 * @throws Exception 
	 */
	public void checkSetID(String SetID, StringHolder errormsg) throws Exception
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
			SimpleDateFormat sdf = new SimpleDateFormat( "yyyy-MM-dd" );
			Date endDate = sdf.parse(entity.getString("ValidDateEnd"));
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
}
