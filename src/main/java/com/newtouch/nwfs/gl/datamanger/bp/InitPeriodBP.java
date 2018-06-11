package com.newtouch.nwfs.gl.datamanger.bp;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.rpc.holders.StringHolder;

import jxl.Sheet;
import jxl.Workbook;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.datamanger.dao.InitPeriodDAO;

@Service
@Transactional
public class InitPeriodBP
{
	@Autowired
	private InitPeriodDAO initperioddao;

	/*
	 * 查询科目期初余额数据
	 */
	public PageData<EntityMap> getInitPeriodList(String uqcompanyid, String varaccountcode, 
									String varaccountname, int start, int limit) throws Exception 
	{

		return this.initperioddao.getInitPeriodList(uqcompanyid,varaccountcode,varaccountname,start,limit);
	}
	
	/*
	 * 导入
	 */
	public void importInitPeriod(InputStream is, String uqcompanyid, StringHolder errormsg) throws Exception
	{
		Workbook wk = Workbook.getWorkbook(is);
		Sheet st = wk.getSheet(0);  //读取第一个表格
		int rowlength= st.getRows();  //获取表格数据的行数
		errormsg.value = "";
		String uqaccountid = "";
		
		if(null == uqcompanyid || "".equals(uqcompanyid))
		{
			M8Session session = new M8Session();
			uqcompanyid = ObjectUtils.toString(session.getAttribute("M8_COMPANYID"));
		}
		
		this.checkInitPeriodTemplate(st); //检查导入数据的字段是否匹配
		List<EntityMap> list = new ArrayList<EntityMap>();
		Map<String, Integer> accMap = new HashMap<String, Integer>();
		//因为第一行是字段名，所以循环从1开始
		for (int row = 1; row < rowlength; row++)
		{
			String varaccountcode = ObjectUtils.toString(st.getCell(0, row).getContents().trim());
			String varaccountname = ObjectUtils.toString(st.getCell(1, row).getContents().trim());
			String mnydebitperiod = ObjectUtils.toString(st.getCell(2, row).getContents().trim());
			String mnycreditperiod = ObjectUtils.toString(st.getCell(3, row).getContents().trim());
			//判断科目编码在科目表中是否存在且是末级
			uqaccountid = this.initperioddao.isExistAccountcode(varaccountcode);
			//判断余额表中是否存在科目编码一样且会计期为全0
			boolean isexist = this.initperioddao.isExistSame(varaccountcode, uqcompanyid);
			//判断科目在余额表中是否存在且有发生数
			boolean ishasseveral = this.initperioddao.isHasSeveral(varaccountcode, uqcompanyid);
			if("".equals(uqaccountid))
			{
				errormsg.value += "第"+ row + "条数据的科目编号不存在或不为末级科目|";
				continue;
			}
			if(isexist)
			{
				continue;
			}
			if(ishasseveral)
			{
				errormsg.value += "第"+ row + "条数据的科目编号已经存在发生数|";
				continue;
			}
			
			if(mnydebitperiod.equals(""))
			{
				mnydebitperiod = "0";
			}
			else 
			{
				if(!mnydebitperiod.matches("^\\d+(\\.\\d{1,2})?$"))
				{
					errormsg.value += "第"+ row + "条数据的期初借方余额格式不正确|";
					continue;
				}
			}
			if(mnycreditperiod.equals(""))
			{
				mnycreditperiod = "0";
			}
			else 
			{
				if(!mnycreditperiod.matches("^\\d+(\\.\\d{1,2})?$"))
				{
					errormsg.value += "第"+ row + "条数据的期初贷方余额格式不正确|";
					continue;
				}
			}
			if(accMap.containsKey(varaccountcode))
			{
				accMap.put(varaccountcode, 1);
				errormsg.value += "第"+ row + "条数据的科目编号在导入模板中存在重复记录|";		
			}
			else 
			{
				accMap.put(varaccountcode, 0);
			}
			EntityMap entity=new EntityMap();
			entity.put("varaccountcode", varaccountcode);
			entity.put("uqaccountid", uqaccountid);
			entity.put("varaccountname", varaccountname);
			entity.put("mnydebitperiod", mnydebitperiod);
			entity.put("mnycreditperiod", mnycreditperiod);
			list.add(entity);
		};
		//如果文件的数据都正确，则将数据插入科目余额表中
		if("".equals(errormsg.value))
		{
			for(int i = 0; i < list.size(); i++)
			{
				this.initperioddao.insertInitPeriod(list.get(i),uqcompanyid);
			}	
		}
	}
	
	/*
	 * 检查导入数据的字段是否匹配
	 */
	private void checkInitPeriodTemplate(Sheet st) throws Exception
	{
		if ("科目编号".equals(st.getCell(0, 0).getContents()) 
				&& "名称".equals(st.getCell(1, 0).getContents())
				&& "期初借方余额".equals(st.getCell(2, 0).getContents())
				&& "期初贷方余额".equals(st.getCell(3,0).getContents())){
		}else{
			throw new Exception("模版不正确!请重新选择");
		}
	}
	/*
	 *导出数据
	 */
	public List<Object[]> exportInitPeriod(String uqcompanyid, String varaccountcode, String varaccountname) throws Exception
	{
		return this.initperioddao.exportInitPeriod(uqcompanyid,varaccountcode,varaccountname);
	}
	
	/*
	 * 新增科目期初余额
	 */
	public void addInitPeriod(String uqcompanyid, String accountid, String varaccountcode,double mnydebitperiod, double mnycreditperiod) throws Exception
	{
		/*if(!mnycreditperiod.matches("^\\d+(\\.\\d{1,2})?$"))
		{
			throw new Exception("期初贷方余额格式不正确");	
		}*/
		
		//判断科目在余额表中是否存在且有发生数
		boolean ishasseveral = this.initperioddao.isHasSeveral(varaccountcode, uqcompanyid);
		if(ishasseveral)
		{
			throw new Exception("选择的科目存在发生数，不能新增科目期初余额");
		}
		else 
		{
			this.initperioddao.addInitPeriod(uqcompanyid, accountid, mnydebitperiod, mnycreditperiod);
		}
		
		
	}

	/*
	 * 修改科目期初余额
	 */
	public void editInitPeriod(String uqcompanyid, String accountid, String varaccountcode, double mnydebitperiod, double mnycreditperiod) throws Exception
	{
		//判断科目在余额表中是否存在且有发生数
		boolean ishasseveral = this.initperioddao.isHasSeveral(varaccountcode, uqcompanyid);
		if(ishasseveral)
		{
			throw new Exception("选择的科目存在发生数，不能修改科目期初余额");
		}
		else 
		{
			//判断余额表中是否存在科目编码一样且会计期为全0
			boolean isexist = this.initperioddao.isExistSame(varaccountcode, uqcompanyid);
			if(isexist)
			{
				this.initperioddao.editInitPeriod(uqcompanyid, accountid, mnydebitperiod, mnycreditperiod);
			}
			else 
			{
				this.initperioddao.addInitPeriod(uqcompanyid, accountid, mnydebitperiod, mnycreditperiod);
			}
			
		}
	}
	

	/*
	 * 删除科目期初余额
	 */
	public void delInitPeriod(String uqcompanyid, String accountids, String varaccountcodes, StringHolder errormsg) throws Exception
	{
		//科目id是以 aaa,bbb,ccc 的格式传进来的
		String[] accountid = accountids.split(",");
		String[] varaccountcode = varaccountcodes.split(",");
		errormsg.value = "";
		for(int i = 0; i < varaccountcode.length; i++)
		{
			//判断科目在余额表中是否存在且有发生数
			boolean ishasseveral = this.initperioddao.isHasSeveral(varaccountcode[i], uqcompanyid);
			if(ishasseveral)
			{
				errormsg.value += "科目'" +varaccountcode[i]+"'存在发生数，不能删除|";
			}
		}
		if(errormsg.value.equals(""))
		{
			for(int i = 0; i < accountid.length; i++)
			{
				this.initperioddao.delInitPeriod(uqcompanyid, accountid[i]);
			}
		}
	}
}
