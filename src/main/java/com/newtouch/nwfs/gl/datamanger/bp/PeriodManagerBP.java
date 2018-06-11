package com.newtouch.nwfs.gl.datamanger.bp;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.xml.rpc.holders.StringHolder;

import jxl.Sheet;
import jxl.Workbook;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.dao.PeriodManagerDAO;

@Service
@Transactional
public class PeriodManagerBP
{

	@Autowired
	private PeriodManagerDAO periodmanagerdao;
	/**
	 * 新增会计期
	 */
	public void addGlobalPeriod(String varname, int intyear, int intmonth, Date dtbegin, Date dtend) throws Exception 
	{
		String uqglobalperiodid = "";
		//判断是否存在会计期年月有相同的数据
		boolean isExistYearMonth = this.periodmanagerdao.isExistSamePeriod(uqglobalperiodid,intyear, intmonth);
		//判断会计期名称是否相同
		boolean isExistName = this.periodmanagerdao.isExistSameName(uqglobalperiodid,varname);
		if (isExistName)
		{
			throw new Exception("会计期名称已经存在");
		}else if(isExistYearMonth)
		{
			throw new Exception("会计期年月已经存在");
		}else
		{
			this.periodmanagerdao.addGlobalPeriod(varname,intyear,intmonth,dtbegin,dtend);
		}
	}
	
	/**
	 *修改会计期
	 */
	public void editGlobalPeriod(String uqglobalperiodids, String varname, int intyear, int intmonth, Date dtbegin, Date dtend, int status) throws Exception
	{
		boolean isExistYearMonth = false;
		boolean isExistName = false;
		//判断是否存在会计期名称或会计期年月有相同的数据(状态0 停用，1新增，2启用)
		if(status == 1)
		{
			//判断会计期名称是否相同
			isExistName = this.periodmanagerdao.isExistSameName(uqglobalperiodids,varname);
			//判断是否存在会计期年月有相同的数据
			isExistYearMonth = this.periodmanagerdao.isExistSamePeriod(uqglobalperiodids,intyear, intmonth);
			
			//当flag为true时，则表明数据中存在相同的会计期名称或会计期年月，则不能修改
			if (isExistName)
			{
				throw new Exception("会计期名称已经存在");
			}
			else if(isExistYearMonth)
			{
				throw new Exception("会计期年月已经存在");
			}
		}
		else
		{
			//判断会计期名称是否相同
			isExistName = this.periodmanagerdao.isExistSameName(uqglobalperiodids,varname);
			//当flag为true时，则表明数据中存在相同的会计期名，则不能修改
			if(isExistName)
			{
				throw new Exception("会计期名称已经存在");
			}
		}
		this.periodmanagerdao.editGlobalPeriod(uqglobalperiodids,varname,intyear,intmonth,dtbegin,dtend);
	}

	/**
	 * 删除会计期
	 */
	public void delGlobalPeriod(String uqglobalperiodids) throws Exception
	{
		//可能同时删除多条数据，前台将多个uqglobalperiodid拼接成字符串，所以这里需要转换然后遍历
		String[] tempuqglobalperiodid = uqglobalperiodids.split(",");
		for(int i = 0; i<tempuqglobalperiodid.length ; i++)
		{
			this.periodmanagerdao.delGlobalPeriod(tempuqglobalperiodid[i]);
		}		
	}

	/**
	 * 查询所有会计期数据
	 */
	public PageData<EntityMap> getGlobalPeriodList(int start, int limit) throws Exception
	{
		return this.periodmanagerdao.getGlobalPeriodList(start,limit); 
	}

	/**
	 * 开启或关闭会计期
	 */
	public void openOrCloseGlobalPeriod(String uqglobalperiodids, int status) throws Exception
	{
		//可能同时更新多条数据，前台将多个uqglobalperiodid拼接成字符串，所以这里需要转换然后遍历
		String[] tempuqglobalperiodid = uqglobalperiodids.split(",");
		for(int i = 0; i<tempuqglobalperiodid.length; i++)
		{
			this.periodmanagerdao.openOrCloseGlobalPeriod(tempuqglobalperiodid[i], status);
		}
	}
	
	/*
	 * 查询需要关闭的会计期是否有未记账的凭证
	 */
	public void voucherIntFlag(String uqglobalperiodids, StringHolder errormsg) throws Exception
	{
		//可能同时更新多条数据，前台将多个uqglobalperiodid拼接成字符串，所以这里需要转换然后遍历
		String[] tempuqglobalperiodid = uqglobalperiodids.split(",");
		errormsg.value = "";
		for(int i = 0; i<tempuqglobalperiodid.length; i++)
		{
			String globalperiodname = "";
			globalperiodname = this.periodmanagerdao.voucherIntFlag(tempuqglobalperiodid[i]);
			if(!"".equals(globalperiodname))
			{
				errormsg.value +="'" +globalperiodname+"'会计期存在未记账的凭证<br>";
			}
		}
	}
	
	public void importPeriod(File periodFile, StringHolder errormsg) throws Exception
	{
		InputStream is = new FileInputStream(periodFile);//读取需要导入的文件
		Workbook wk = Workbook.getWorkbook(is);
		Sheet st = wk.getSheet(0);  //读取第一个表格
		int rowlength = st.getRows();  //获取表格数据的行数
		//判断表格中是否存在数据
		if (rowlength <= 1) 
		{
			throw new Exception("表格中没有数据!");
		}
		else
		{
			if (rowlength > 1) 
			{
				//this.validateUploadFile(st, 1); //检查导入数据的字段是否匹配
				List<EntityMap> list = new ArrayList<EntityMap>();
				//因为第一行是字段名，所以循环从1开始
				for (int row = 1; row < rowlength; row++)
				{
					String name = ObjectUtils.toString(st.getCell(0, row).getContents().trim());
					String year = ObjectUtils.toString(st.getCell(1, row).getContents().trim());
					String month = ObjectUtils.toString(st.getCell(2, row).getContents().trim());
					String property = ObjectUtils.toString(st.getCell(3, row).getContents().trim());
					String dtbegin = ObjectUtils.toString(st.getCell(4, row).getContents().trim());
					String dtend = ObjectUtils.toString(st.getCell(5, row).getContents().trim());

					
					EntityMap entity = new EntityMap();
					entity.put("periodid", UUID.randomUUID().toString().toUpperCase());
					entity.put("year", year);
					entity.put("month", month);
					entity.put("name", name);
					entity.put("status", "1");
					entity.put("property", property=="是" ? "1" : "0");
					entity.put("dtbegin", dtbegin);
					entity.put("dtend", dtend);
					entity.put("yearmonth", year+month);
					list.add(entity);
				}

				//校验
				this.checkImportPeriod(list, errormsg);
				//校验通过后，写入会计期表
				if ("".equals(errormsg.value))
				{
					for (int i = 0; i < list.size(); i++) 
					{
						this.periodmanagerdao.importToPeriod(list.get(i));
					}
					
				}
			}
		}
	}
	
	public void checkImportPeriod(List<EntityMap> list, StringHolder errormsg) throws Exception
	{
		//1.检验各项非空字段；
		Map<String, Integer> mapYearMonth = new HashMap<String, Integer>();
		Map<String, Integer> mapName = new HashMap<String, Integer>();
		for (int i = 0; i < list.size(); i++) 
		{
			int j = i+2;
			EntityMap entity = list.get(i);
//			String periodid = entity.getString("periodid");
			String year = entity.getString("year");
			String month = entity.getString("month");
			String name = entity.getString("name");
//			String status = entity.getString("status");
//			String property = entity.getString("property");
			String dtbegin = entity.getString("dtbegin");
			String dtend = entity.getString("dtend");
			String yearmonth = entity.getString("yearmonth");
			boolean hasnull = true;
			//1.检验各项非空字段；
			if (year==null || "".equals(year)) 
			{
				errormsg.value += "第 "+ j + " 行[会计期年份]为空;";
				hasnull = false;
			}
			if (month==null || "".equals(month)) 
			{
				errormsg.value += "第 "+ j + " 行[会计期月份]为空;";
				hasnull = false;
			}
			if (name==null || "".equals(name)) 
			{
				errormsg.value += "第"+ j + " 行[会计期名称]为空;";
				hasnull = false;
			}
			if (dtbegin==null || "".equals(dtbegin)) 
			{
				errormsg.value += "第"+ j + " 行[有效开始日期]为空;";
				hasnull = false;
			}
			if (dtend==null || "".equals(dtend)) 
			{
				errormsg.value += "第"+ j + " 行[有效结束日期]为空;";
				hasnull = false;
			}
			
			if (hasnull) 
			{
				//验证编码是否唯一
				List<String> listName = this.periodmanagerdao.getPeriodCountByParameter(0, name);
				if (!"0".equals(listName.iterator().next().toString()))
				{
					errormsg.value += "编号为第"+ j + " 行会计期名称已存在;";
				}
				
				List<String> listYearMonth = this.periodmanagerdao.getPeriodCountByParameter(1, yearmonth);
				if (!"0".equals(listYearMonth.iterator().next().toString())) 
				{
					errormsg.value += "编号为第"+ j + " 行会计期年月已存在;";
				}
				
				if (mapYearMonth.containsKey(yearmonth)) 
				{
					//检验科目编号重复记录
					mapYearMonth.put(yearmonth, 1);
					errormsg.value += "第"+ j + "条数据的会计期年月存在重复;";
				}
				else 
				{
					mapYearMonth.put(yearmonth, 0);
				}
				
				if (mapName.containsKey(name)) 
				{
					//检验科目编号重复记录
					mapName.put(name, 1);
					errormsg.value += "第"+ j + "条数据的会计期名称存在重复;";
				}
				else 
				{
					mapName.put(name, 0);
				}
			}
		}
	}
		
	public String getPeriod(int year,int month) throws Exception 
	{
		String period = periodmanagerdao.getPeriod(year, month);
		return period;
	}
}
