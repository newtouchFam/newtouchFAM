package com.newtouch.nwfs.gl.voucherbook.dao;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.newtouch.cloud.common.dao.CommonDAO;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.voucherbook.util.FlowItemEnum;

@Repository
public class FlowSheetDAO extends CommonDAO
{
	public PageData<EntityMap> getReportData(int start, int limit, ConditionMap cdtMap) throws Exception
	{
		String intyearmonth = cdtMap.getString("comperiod");
		String periodid = cdtMap.getString("periodid");
		
		String yearstr = intyearmonth.substring(0, 4);
		String startYear = yearstr + "01";
		
		String bulkid = UUID.randomUUID().toString().toUpperCase();
		
		//temp1:bulkid,会计期，项目编号，项目名称（带空格，所以长度要给足），项目或者类别(0-类别，1-项目),项目ID(或者类别ID)，上级ID，是否末级（分别是类别表和项目表的末级，如果类别的级次是1，就去查项目）,级次，本月借方，本月贷方，累计借方，累计贷方
		//1、获取末级项目的本月和累计数和上级的级次和上级ID，然后存表
		//1.1、获取末级项目的本年和累计数和上级的级次
		String strSql = "insert into tgl_flowsheet_noordertemp( ";
		strSql += " bulkid,uqglobalperiodid,varcode,varname,";
		strSql += " intisitem,itemid,parentid,intislastlevel,mnydebitlj,mnycreditlj)";
		strSql += " select ?,m.uqglobalperiodid,f.varcode,f.varname,1,f.uqflowitemid,f.uqflowtypeid,1,";
		strSql += "   sum(ifnull(de.mnydebit,0)),sum(ifnull(de.mnycredit,0)) ";
		strSql += "    from tgl_voucher_detail_flow df ";
		strSql += "   inner join tgl_voucher_details de on de.UQVOUCHERDETAILID=df.uqvoucherdetailid ";
		strSql += "   inner join tgl_voucher_mains m on m.UQVOUCHERID=de.UQVOUCHERID ";
		strSql += "   inner join tgl_global_periods gp on gp.uqglobalperiodid = m.uqglobalperiodid ";
		strSql += "   inner join tgl_flowitems f on f.uqflowitemid=df.uqflowitemid ";
		strSql += "   where gp.intyearmonth<=? and gp.intyearmonth>=? ";
		strSql += "   and m.INTFLAG=2  ";
		strSql += "   group by m.UQGLOBALPERIODID,f.varcode,f.varname,1,f.uqflowitemid,f.uqflowtypeid, 1";
		
		this.execute(strSql, new Object[]{bulkid, intyearmonth, startYear});
		
		//计算级次
		strSql = "update tgl_flowsheet_noordertemp n set n.intlevel = ( ";
		strSql += " select ft.intlevel+1 from tgl_flowitems f ";
		strSql += " 	inner join tgl_flowtype ft on ft.uqflowtypeid=f.uqflowtypeid ";
		strSql += " 	where f.uqflowitemid=n.itemid ) ";
		strSql += " where n.bulkid=? ";
		
		this.execute(strSql, new Object[]{bulkid});
		
		//计算本月数
		strSql = "update tgl_flowsheet_noordertemp n set n.mnydebitby = ( ";
		strSql += " select sum(de.mnydebit) from tgl_voucher_detail_flow df ";
		strSql += " 	inner join tgl_voucher_details de on de.UQVOUCHERDETAILID=df.uqvoucherdetailid ";
		strSql += " 	inner join tgl_voucher_mains m on m.UQVOUCHERID=de.UQVOUCHERID ";
		strSql += " 	inner join tgl_global_periods gp on gp.uqglobalperiodid = m.uqglobalperiodid ";
		strSql += " 	inner join tgl_flowitems f on f.uqflowitemid=df.uqflowitemid ";
		strSql += " where gp.UQGLOBALPERIODID=? and n.itemid = f.uqflowitemid ";
		strSql += "     and m.INTFLAG=2 ";
		strSql += " ) ";
		strSql += " where n.bulkid=?";
		
		this.execute(strSql, new Object[]{periodid, bulkid});
		
		//计算本月数
		strSql = "update tgl_flowsheet_noordertemp n set n.mnycreditby = ( ";
		strSql += " select sum(de.mnycredit) from tgl_voucher_detail_flow df ";
		strSql += " 	inner join tgl_voucher_details de on de.UQVOUCHERDETAILID=df.uqvoucherdetailid ";
		strSql += " 	inner join tgl_voucher_mains m on m.UQVOUCHERID=de.UQVOUCHERID ";
		strSql += " 	inner join tgl_global_periods gp on gp.uqglobalperiodid = m.uqglobalperiodid ";
		strSql += " 	inner join tgl_flowitems f on f.uqflowitemid=df.uqflowitemid ";
		strSql += " where gp.UQGLOBALPERIODID=? and n.itemid = f.uqflowitemid ";
		strSql += "     and m.INTFLAG=2 ";
		strSql += " ) ";
		strSql += " where n.bulkid=?";
		
		this.execute(strSql, new Object[]{periodid, bulkid});
		
		strSql = "select distinct n.parentid from tgl_flowsheet_noordertemp n where n.bulkid=?";
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{bulkid});
		for(int i = 0; i < maplist.size(); i++)
		{
			String typeid = maplist.get(i).getString("parentid");
			calcFlowType(typeid, bulkid);
		}
		
		//2、按照树形插入到输出表(temp2)，便于一次输出全部数据，temp2比temp1多一个次序
		//2.1    排序策略：按照全编码排序
		//2.2    单独找出第一级的类别，for 循环，update 名称加上文字一。二，三，四
		
		//处理排序
		this.calcResultTemp(bulkid);
		
		//处理第一级的加上文字一。二，三，四和每一级的空格
		this.calcResultLevelInfo(bulkid);
		
		strSql = "select ";
		strSql += "   r.varname,r.mnydebitby,r.mnycreditby,r.mnydebitlj,r.mnycreditlj ";
		strSql += " from ";
		strSql += "   tgl_flowsheet_resulttemp r ";
		strSql += " where ";
		strSql += "   r.bulkid=? order by r.intsequence";
		PageData<EntityMap> pmap = this.getMapPage(strSql, new Object[]{bulkid}, start, limit);
		
		strSql = "delete from tgl_flowsheet_noordertemp where bulkid=? ";
		this.execute(strSql, new Object[]{bulkid});
		
		strSql = "delete from tgl_flowsheet_resulttemp where bulkid=? ";
		this.execute(strSql, new Object[]{bulkid});
		
		return pmap;
	}
	
	private void calcResultLevelInfo(String bulkid)
	{
		String strSql = "select ";
		strSql += " 	max(ft.intlevel) + 1 max_intlevel";
		strSql += " from ";
		strSql += " 	tgl_flowtype ft ";
		
		List<EntityMap> list = this.getMapList(strSql);
		
		String string = list.get(0).getString("max_intlevel");
		
		int level =	0 ;
		
		if(string!=null && string!="")
		{
			level = Integer.parseInt(string);
		}
		
		
		String st = "";
		
		for (int i = 0; i < level; i++)
		{
			if(i == 0)
			{
				strSql = "select n.itemid, n.varname from tgl_flowsheet_resulttemp n where n.intlevel = 1 and n.bulkid=? order by n.varcode";
				List<EntityMap> maplist = this.getMapList(strSql, new Object[]{bulkid});
				
				for(int j = 0; j < maplist.size(); j++)
				{
					FlowItemEnum num = new FlowItemEnum();
					String han = num.change(j);
					
					String itemid = maplist.get(j).getString("itemid");
					
					strSql = "update tgl_flowsheet_resulttemp r set r.varname = concat(?, r.varname) where r.bulkid=? and r.itemid=?";
				    
					this.execute(strSql, new Object[]{han,  bulkid,itemid});
				}
			}
			else
			{
				st = st + "    ";
				
				strSql = "update tgl_flowsheet_resulttemp r set r.varname = concat(?, r.varname) where r.bulkid=? and r.intlevel = ?";
			    
				this.execute(strSql, new Object[]{st,  bulkid, i+1 });
			}
		}
	}
	
	private void calcResultTemp(String bulkid)
	{
		//先处理类别
		String strSql = "insert into tgl_flowsheet_resulttemp(";
		strSql += " 	bulkid,uqglobalperiodid,varcode,varname,";
		strSql += "   intisitem,itemid,parentid,intislastlevel,";
		strSql += "   intlevel, mnydebitby,mnycreditby, mnydebitlj, mnycreditlj, intsequence)";
		strSql += " select ";
		strSql += "   ?,n.uqglobalperiodid,ft.varcode,ft.varname,";
		strSql += "   0,ft.uqflowtypeid,ft.uqparentid,ft.intislastlevel,";
		strSql += "   ft.intlevel,n.mnydebitby,n.mnycreditby,n.mnydebitlj,n.mnycreditlj,ft.varfullcode";
		strSql += " 	from ";
		strSql += " 		tgl_flowtype ft";
		strSql += " 	left join tgl_flowsheet_noordertemp n on n.itemid=ft.uqflowtypeid and n.intisitem = 0 and n.bulkid=? ";
		
		this.execute(strSql, new Object[]{bulkid, bulkid});
		
		//处理项目
		strSql = "insert into tgl_flowsheet_resulttemp( ";
		strSql += " 	bulkid,uqglobalperiodid,varcode,varname, ";
		strSql += "   intisitem,itemid,parentid,intislastlevel, ";
		strSql += "   intlevel, mnydebitby,mnycreditby, mnydebitlj, mnycreditlj, intsequence) ";
		strSql += " select ";
		strSql += "   ?,n.uqglobalperiodid,f.varcode,f.varname,";
		strSql += "   1,f.uqflowitemid,f.uqflowtypeid,1,";
		strSql += "   ft.intlevel + 1,n.mnydebitby,n.mnycreditby,n.mnydebitlj,n.mnycreditlj,concat(ft.varfullcode,'.',f.varcode)";
		strSql += " 	from ";
		strSql += " 		tgl_flowitems f ";
		strSql += "   inner join tgl_flowtype ft on ft.uqflowtypeid=f.uqflowtypeid ";
		strSql += " 	left join tgl_flowsheet_noordertemp n on n.itemid=f.uqflowitemid and n.intisitem = 1 and n.bulkid=? ";
		strSql += "   where f.intstatus in(0,2) ";
		
		this.execute(strSql, new Object[]{bulkid, bulkid});
	}
	
	private void calcFlowType(String typeid, String bulkid)
	{
		String strSql = "select ft.uqflowtypeid,ft.uqparentid,ft.varcode,ft.varname,ft.intlevel,ft.intislastlevel ";
		strSql += " from tgl_flowtype ft where ft.uqflowtypeid = ?  and not exists ";
		strSql += " ( ";
		strSql += " 		select 1 from tgl_flowsheet_noordertemp n where n.bulkid = ? and n.itemid = ft.uqflowtypeid ";
		strSql += " ) ";
		
		List<EntityMap> maplist = this.getMapList(strSql, new Object[]{typeid, bulkid});
		
		String flowtypeid = "";
		String parentid = "";
		
		if(maplist.size() > 0)
		{
			flowtypeid = maplist.get(0).getString("uqflowtypeid");
			parentid = maplist.get(0).getString("uqparentid");
			String varcode = maplist.get(0).getString("varcode");
			String varname = maplist.get(0).getString("varname");
			String intlevel = maplist.get(0).getString("intlevel");
			String intislastlevel = maplist.get(0).getString("intislastlevel");
			
			strSql = "insert into tgl_flowsheet_noordertemp( ";
			strSql += "   bulkid,uqglobalperiodid,varcode,varname,";
			strSql += "   intisitem,itemid,parentid,intislastlevel,";
			strSql += "   intlevel, mnydebitby,mnycreditby, mnydebitlj, mnycreditlj) ";
			strSql += " select ";
			strSql += "   ?,n.uqglobalperiodid,?,?, ";
			strSql += "   0,?,?,?, ";
			strSql += "   ?,sum(n.mnydebitby),sum(n.mnycreditby),sum(n.mnydebitlj),sum(n.mnycreditlj) ";
			strSql += "   from ";
			strSql += "   tgl_flowsheet_noordertemp n ";
			strSql += "   where n.bulkid = ? and n.parentid = ?";
			
			this.execute(strSql, new Object[]{bulkid, varcode, varname, flowtypeid, parentid, 
					intislastlevel, intlevel, bulkid, typeid});
		}
		
		if(!flowtypeid.equals(parentid))
		{
			calcFlowType(parentid, bulkid);
		}
	}

}
