package com.newtouch.nwfs.gl.datamanger.bp;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

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
import com.newtouch.nwfs.gl.datamanger.dao.InitLedgePeriodDao;
import com.newtouch.nwfs.gl.datamanger.entity.AccountsEntity;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerItemEntity;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerTypeEntity;

@Service
@Transactional
public class InitLedgePeriodBp 
{
	@Autowired
	private InitLedgePeriodDao ledgePeriodDao;

	public PageData<EntityMap> getInitLedgePeriod(String uqcompanyid, String uqaccountid, String uqledgetypeid, int start, int limit) throws Exception
	{
		return this.ledgePeriodDao.getInitLedgePeriod(uqcompanyid, uqaccountid, uqledgetypeid, start, limit);
	}

	public void editInitLedgePeriod(EntityMap entity) throws Exception
	{
		//判断分户余额表中是否存在记录
		List<String> list = this.ledgePeriodDao.getLedgePeriod(entity);
		if (!"0".equals(list.iterator().next().toString())) 
		{
			//存在记录 则执行更新
			this.ledgePeriodDao.editInitLedgePeriod(entity);
		}
		else
		{
			//不存在 执行插入
			this.ledgePeriodDao.saveInitLedgePeriod(entity);
		}
	}

	public void importLedgePeriod(InputStream is, String uqcompanyid, StringHolder errormsg) throws Exception 
	{
		Workbook wk = Workbook.getWorkbook(is);
		Sheet st = wk.getSheet(0);  //读取第一个表格
		int rowlength= st.getRows();  //获取表格数据的行数
		
		if(null == uqcompanyid || "".equals(uqcompanyid))
		{
			M8Session session = new M8Session();
			uqcompanyid = ObjectUtils.toString(session.getAttribute("M8_COMPANYID"));
		}
		
		this.checkTemplate(st); //检查导入数据的字段是否匹配
		List<EntityMap> list = new ArrayList<EntityMap>();
		//因为第一行是字段名，所以循环从1开始
		for (int row = 1; row < rowlength; row++)
		{
			String varaccountcode = ObjectUtils.toString(st.getCell(0, row).getContents().trim());
			String varledgetypename = ObjectUtils.toString(st.getCell(1, row).getContents().trim());
			String varledgecode = ObjectUtils.toString(st.getCell(2, row).getContents().trim());
			String mnydebitperiod = ObjectUtils.toString(st.getCell(3, row).getContents().trim());
			String mnycreditperiod = ObjectUtils.toString(st.getCell(4, row).getContents().trim());
			
			EntityMap entity = new EntityMap();
			entity.put("varaccountcode", varaccountcode);
			entity.put("varledgetypename", varledgetypename);
			entity.put("varledgecode", varledgecode);
			entity.put("mnydebitperiod", mnydebitperiod);
			entity.put("mnycreditperiod", mnycreditperiod);
			list.add(entity);
		}
		List<EntityMap> idMaps = new ArrayList<EntityMap>();
		//检查数据是否符合规定
		this.chackImportData(list, idMaps, errormsg);
		//如果文件的数据都正确，则保存数据
		if ("".equals(errormsg.value)) 
		{
			for (int i = 0; i < list.size(); i++) 
			{
				EntityMap newEntity = new EntityMap();
				newEntity.put("uqcompanyid", uqcompanyid);
				newEntity.put("uqglobalperiodid", "00000000-0000-0000-0000-000000000000");
				newEntity.put("uqaccountid", idMaps.get(i).get("uqaccountid"));
				newEntity.put("uqledgeid", idMaps.get(i).get("uqledgeid"));
				newEntity.put("mnydebitperiod", list.get(i).get("mnydebitperiod"));
				newEntity.put("mnycreditperiod", list.get(i).get("mnycreditperiod"));
				//判断是否存在相同记录
				List<String> list2 = this.ledgePeriodDao.getLedgePeriod(newEntity);
				if (!"0".equals(list2.iterator().next().toString())) 
				{
					//存在记录 则执行更新
					this.ledgePeriodDao.editInitLedgePeriod(newEntity);
				}
				else
				{
					//不存在 执行插入
					this.ledgePeriodDao.saveInitLedgePeriod(newEntity);
				}
			}
		}
	}

	public List<Object[]> exportLedgePeriod(String uqcompanyid, String uqaccountid, String uqledgetypeid) throws Exception 
	{
		return this.ledgePeriodDao.exportLedgePeriod(uqcompanyid, uqaccountid, uqledgetypeid);
	}

	/**
	 * 检查导入表格格式
	 * @param st 表格
	 * @throws Exception
	 */
	public void checkTemplate(Sheet st) throws Exception
	{
		if ("科目编码".equals(st.getCell(0, 0).getContents()) 
				&& "分户类别名称".equals(st.getCell(1, 0).getContents())
				&& "分户项目编码".equals(st.getCell(2, 0).getContents())
				&& "年初借方余额".equals(st.getCell(3, 0).getContents())
				&& "年初贷方余额".equals(st.getCell(4, 0).getContents()))
		{}
		else
		{
			throw new Exception("模版不正确!请重新选择");
		}
	}
	
	/**
	 * 检查导入数据是否符合规定
	 * @param list 待检验数据
	 * @param idMaps id集合
	 * @param errormsg 错误信息
	 * @throws Exception
	 */
	public void chackImportData(List<EntityMap> list, List<EntityMap> idMaps, StringHolder errormsg) throws Exception
	{
		errormsg.value = "";
		
		for (int i = 0; i < list.size(); i++) 
		{
			int j = i+2;
			EntityMap entity = list.get(i);
			String varaccountcode = entity.getString("varaccountcode");
			String varledgetypename = entity.getString("varledgetypename");
			String varledgecode = entity.getString("varledgecode");
			String mnydebitperiod = entity.getString("mnydebitperiod");
			String mnycreditperiod = entity.getString("mnycreditperiod");
			boolean hasnull = true;
			//1.检验各项非空字段；
			if (varaccountcode==null || "".equals(varaccountcode)) 
			{
				errormsg.value += "第 "+ j + " 行 【科目编号】为空|";
				hasnull = false;
			}
			if (varledgetypename==null || "".equals(varledgetypename)) 
			{
				errormsg.value += "第 "+ j + " 条 【分户类别名称】为空|";
				hasnull = false;
			}
			if (varledgecode==null || "".equals(varledgecode)) 
			{
				errormsg.value += "第"+ j + "条 分户项目编码为空|";
				hasnull = false;
			}
			if (hasnull) 
			{
				//2.检查导入的科目是否有允许分户设置；
				M8Session session = new M8Session();
				String uqaccountsetid = ObjectUtils.toString(session.getAttribute("ACCOUNTSETID"));
				List<AccountsEntity> list2 = this.ledgePeriodDao.getAccountByCode(varaccountcode, uqaccountsetid);
				if (list2.size() <=0 ) 
				{
					errormsg.value += "第 "+ j + " 行 科目不存在或不为末级科目|";
				}
				else if ("0".equals(list2.get(0).getIntisledge()))
				{
					errormsg.value += "第 "+ j + " 行 科目不允许设置分户|";
				}
				else 
				{
					//3.检查导入的分户类别是否存在（根据名称来判断）；
					List<LedgerTypeEntity> list3 = 
							this.ledgePeriodDao.getLedgerTypeEntityByName(list2.get(0).getUqaccountid(), varledgetypename);
					if (list3.size() <= 0) 
					{
						errormsg.value += "第 "+ j + " 行 分户类别不在对应科目的分户关系中|";
					}
					else 
					{
						//4.导入的分户项目是否存在（根据分户项目代码判断）；
						List<LedgerItemEntity> list4 = 
								this.ledgePeriodDao.getLedgerItemEntityByCode(varledgecode, list3.get(0).getUqledgetypeid());
						if (list4.size() <= 0) 
						{
							errormsg.value += "第 "+ j + " 行 分户项目不在对应分户类别中|";
						}
						else if (!"1".equals(list4.get(0).getIntislastlevel()))
						{
							errormsg.value += "第 "+ j + " 行 分户项目不是末级项目|";
						}
						else if (!"".equals(mnydebitperiod)&&!mnydebitperiod.matches("^\\d+(\\.\\d{1,2})?$"))
						{
							errormsg.value += "第 "+ j + " 行 年初借方余额数据格式不正确|";
						}
						else if (!"".equals(mnycreditperiod)&&!mnycreditperiod.matches("^\\d+(\\.\\d{1,2})?$"))
						{
							errormsg.value += "第 "+ j + " 行 年初贷方余额数据格式不正确|";
						}
						else 
						{
							EntityMap ids = new EntityMap();
							ids.put("uqaccountid", list2.get(0).getUqaccountid());
							ids.put("uqledgeid", list4.get(0).getUqledgeid());
							idMaps.add(ids);
						}
					}
				}
			}
		}
	}
	
	public List<Object> getAccountPeriod(EntityMap entity) throws Exception 
	{
		return this.ledgePeriodDao.getAccountPeriod(entity);
	}
}
