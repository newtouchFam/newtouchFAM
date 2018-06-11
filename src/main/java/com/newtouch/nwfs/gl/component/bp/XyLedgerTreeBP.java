package com.newtouch.nwfs.gl.component.bp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.nwfs.gl.component.dao.XyLedgerTreeDAO;

@Service
@Transactional
public class XyLedgerTreeBP
{
	@Autowired
	private XyLedgerTreeDAO xyledgertreedao;
	
	/*
	 * 查询分户组件的数据
	 */
	public List<EntityMap> ledgerTree(String companyid, String id, String tag, String accountcode)throws Exception
	{
		if(accountcode == null || accountcode.equals("null"))
		{
			accountcode = null;
		}
		if(tag == null|| tag.equals("undefined")|| tag.length()<=0)
		{
			//查询分户类型
			return this.xyledgertreedao.getLedgerType(accountcode);
		}
		else if (tag.equals("0")) 
		{	//查询分户类型下的一级分户明细
			return this.iscompanyid(companyid, this.xyledgertreedao.getLedgerDetial(id));
		}else 
		{	//查询查询大于一级的分户明细
			return this.iscompanyid(companyid, this.xyledgertreedao.getLedgerDetialinfo(id));
		}
	}
	
	/*
	 * 当分户明细时末级且不属于当前公司的就移除
	 */
	public List<EntityMap> iscompanyid(String companyid, List<EntityMap> list)
	{
		for(int i = 0; i < list.size(); i++)
		{
			if(!list.get(i).getString("uqcompanyid").equals(companyid) && list.get(i).getInteger("leaf") == 1)
			{
				list.remove(i);
			}
		}
		return list;
	}
}
