package com.newtouch.nwfs.gl.datamanger.bp;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
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
import com.newtouch.nwfs.gl.datamanger.dao.AccountManagerDao;
import com.newtouch.nwfs.gl.datamanger.entity.AccountsEntity;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerTypeEntity;

/**
 * 科目管理bp层实现类
 * @author Administrator
 *
 */
@Service
@Transactional
public class AccountManagerBp
{
	@Autowired
	private AccountManagerDao accountManagerDao;
	
	public PageData<EntityMap> getAccountInfoByParentId(String uqaccountsetid, String parentId, int start, int limit) throws Exception 
	{
		PageData<EntityMap> pageList = accountManagerDao.getAccountInfoByParentId(uqaccountsetid, parentId, start, limit);
		// 遍历集合  查询获取科目分户核算关系数据 放入map
		List<EntityMap> entityMaps = pageList.getData();
		for (EntityMap entityMap : entityMaps)
		{
			String uqaccountid = entityMap.getString("uqaccountid");
			//获取科目分户核算信息
			List<Object> ledgeTypeList = this.accountManagerDao.getLedgeTypes(uqaccountid);
			if (null != ledgeTypeList && ledgeTypeList.size() > 0) 
			{
				String uqledgetypeids = "";
				String varledgetypenames = "";
				Iterator<Object> it = ledgeTypeList.iterator();
				//将所有分户信息拼接成新的字符串 用‘，’分隔
				while(it.hasNext())
				{
					Object[] objs = (Object[]) it.next();
					uqledgetypeids += objs[0].toString() + ",";
					varledgetypenames += objs[1].toString() + ",";
				}
				//截去最后的‘，’
				if (!"".equals(uqledgetypeids)) 
				{
					uqledgetypeids = uqledgetypeids.substring(0, uqledgetypeids.length()-1);
				}
				if (!"".equals(varledgetypenames)) 
				{
					varledgetypenames = varledgetypenames.substring(0, varledgetypenames.length()-1);
				}
				//将拼接好的数据放入map
				entityMap.put("uqledgetypeids", uqledgetypeids);
				entityMap.put("varledgetypenames", varledgetypenames);
			}
			else 
			{
				//没有分户则放入null
				entityMap.put("uqledgetypeids", null);
				entityMap.put("varledgetypenames", null);
			}
		}
		pageList.setData(entityMaps);
		return pageList;
	}

	public PageData<EntityMap> getAccountInfoByCondition(String uqaccountsetid, String code, String name, int start, int limit) throws Exception
	{
		PageData<EntityMap> pageList = accountManagerDao.getAccountInfoByCondition(uqaccountsetid, code, name, start, limit);
		// 遍历集合  查询获取科目分户核算关系数据 放入map
		List<EntityMap> entityMaps = pageList.getData();
		for (EntityMap entityMap : entityMaps)
		{
			String uqaccountid = entityMap.getString("uqaccountid");
			//获取科目分户核算信息
			List<Object> ledgeTypeList = this.accountManagerDao.getLedgeTypes(uqaccountid);
			if (null != ledgeTypeList && ledgeTypeList.size() > 0) 
			{
				String uqledgetypeids = "";
				String varledgetypenames = "";
				Iterator<Object> it = ledgeTypeList.iterator();
				//将所有分户信息拼接成新的字符串 用‘，’分隔
				while(it.hasNext())
				{
					Object[] objs = (Object[]) it.next();
					uqledgetypeids += objs[0].toString() + ",";
					varledgetypenames += objs[1].toString() + ",";
				}
				//截去最后的‘，’
				if (!"".equals(uqledgetypeids)) 
				{
					uqledgetypeids = uqledgetypeids.substring(0, uqledgetypeids.length()-1);
				}
				if (!"".equals(varledgetypenames)) 
				{
					varledgetypenames = varledgetypenames.substring(0, varledgetypenames.length()-1);
				}
				//将拼接好的数据放入map
				entityMap.put("uqledgetypeids", uqledgetypeids);
				entityMap.put("varledgetypenames", varledgetypenames);
			}
			else 
			{
				//没有分户则放入null
				entityMap.put("uqledgetypeids", null);
				entityMap.put("varledgetypename", null);
			}
		}
		pageList.setData(entityMaps);
		return pageList;
	}
	
	public List<Object> getAccountTree(String uqaccountsetid, String parentId) throws Exception
	{
		List<Object> objList = accountManagerDao.getAccountTree(uqaccountsetid, parentId);
		List<Object> objList2 = new ArrayList<Object>();
		// 遍历集合  查询获取科目分户核算关系数据 放入list
		for (Object obj : objList) 
		{
			Object[] objs = (Object[])obj;
			Object [] newObjects = new Object[objs.length+2];
			for (int i = 0; i < objs.length; i++) 
			{
				newObjects[i] = objs[i];
			}
			String uqaccountid = objs[0].toString();
			//获取科目分户核算信息
			List<Object> ledgeTypeList = this.accountManagerDao.getLedgeTypes(uqaccountid);
			if (null != ledgeTypeList && ledgeTypeList.size() > 0) 
			{
				String uqledgetypeids = "";
				String varledgetypenames = "";
				Iterator<Object> it = ledgeTypeList.iterator();
				//将所有分户信息拼接成新的字符串 用‘，’分隔
				while(it.hasNext())
				{
					Object[] objs2 = (Object[]) it.next();
					uqledgetypeids += objs2[0].toString() + ",";
					varledgetypenames += objs2[1].toString() + ",";
				}
				//截去最后的‘，’
				if (!"".equals(uqledgetypeids)) 
				{
					uqledgetypeids = uqledgetypeids.substring(0, uqledgetypeids.length()-1);
				}
				if (!"".equals(varledgetypenames)) 
				{
					varledgetypenames = varledgetypenames.substring(0, varledgetypenames.length()-1);
				}
				//将拼接好的数据插入数组最后
				newObjects[20] = uqledgetypeids;
				newObjects[21] = varledgetypenames;
			}
			else 
			{
				//没有分户则放入null
				newObjects[20] = null;
				newObjects[21] = null;
			}
			objList2.add(newObjects);
		}
		return objList2;
	}

	public void updateIntflag(String uqaccountsetid, String[] idArrays, String startorclose) throws Exception 
	{
		for(int i = 0; i < idArrays.length; i++)
		{
			//获取当前科目信息
			List<AccountsEntity> list = this.accountManagerDao.getAccountById(idArrays[i]);
			AccountsEntity accountEntity = list.get(0);
			String accountId = accountEntity.getUqaccountid();
			if ("00000000-0000-0000-0000-000000000000".equals(accountId)) 
			{
				//循环下级所有科目
				List<String> idList = this.accountManagerDao.getAccountIdList(accountId);
				for (String id : idList)
				{
					List<AccountsEntity> list2 = this.accountManagerDao.getAccountById(id);
					String fullcode = list2.get(0).getVaraccountfullcode();
					this.accountManagerDao.updateIntflag(uqaccountsetid, null, fullcode, startorclose, 0);
				}
			}
			else 
			{
				if ("start".equals(startorclose)) 
				{
					int intflag = Integer.parseInt(accountEntity.getIntflag());
					if (intflag != 2) 
					{
						//先向上递归开启父级科目
						this.startIntflag(idArrays[i], startorclose);
					}
					//在向下开启所有子集科目
					String fullcode = accountEntity.getVaraccountfullcode();
					this.accountManagerDao.updateIntflag(uqaccountsetid, null, fullcode, startorclose, 0);
				}
				if ("close".equals(startorclose))
				{
					int intflag = Integer.parseInt(accountEntity.getIntflag());
					String fullcode = accountEntity.getVaraccountfullcode();
					//如果未关闭 则这向下关闭所有子节点
					if (intflag != 0 ) 
					{
						this.accountManagerDao.updateIntflag(uqaccountsetid, null, fullcode, startorclose, 0);
					}
				}
			}
		}
	}
	
	public void addAccounts(AccountsEntity account, String uqLedgeTypeIds) throws Exception 
	{
		String uqaccountsetid = account.getUqaccountsetid();
		//验证编码是否唯一
		List<String> list1 = this.accountManagerDao.getAccountCountByCode(uqaccountsetid, account.getVaraccountcode());
		if (!"0".equals(list1.iterator().next().toString())) 
		{
			throw new Exception("科目编号"+account.getVaraccountcode()+"已存在，不可使用！");
		}
		//验证同级下的科目名称是否唯一
		List<EntityMap> list2 = this.accountManagerDao.getAccountCountByName(account);
		if (list2.size()>=1) 
		{
			throw new Exception("科目名称"+account.getVaraccountname()+"在本级中已存在，不可使用！");
		}
		//获取父级科目信息（全编码、等级）以获取新增科目全编码和等级
		AccountsEntity accountParent = this.accountManagerDao.getAccountById(account.getUqparentid()).get(0);
		String fullCode = null;
		String fullName = null;
		int intlevel;
		if (accountParent.getUqaccountid().equals("00000000-0000-0000-0000-000000000000")) 
		{
			fullCode = account.getVaraccountcode();
			fullName = account.getVaraccountname();
			intlevel = 1;
		}
		else 
		{
			fullCode = accountParent.getVaraccountfullcode()+"."+account.getVaraccountcode();
			fullName = accountParent.getVaraccountfullname()+"-"+account.getVaraccountname();
			intlevel = Integer.parseInt(accountParent.getIntlevel())+1;
		}
		account.setVaraccountfullcode(fullCode);
		account.setVaraccountfullname(fullName);
		account.setIntlevel(intlevel+"");
		String uqaccountid = UUID.randomUUID().toString().toUpperCase();
		account.setUqaccountid(uqaccountid);
		//判断修改父级的末级状态
		if (accountParent.getIntislastlevel().equals("1"))
		{
			//修改父级的末级状态
			this.accountManagerDao.updateIntislastlevel(accountParent.getUqaccountid(), 0);
			//清除以父级为末级在组表中的数据
			this.accountManagerDao.deleteAccountGroupByAccountId(accountParent.getUqaccountid());
		}
		//新增科目
		this.accountManagerDao.addAccounts(account);
		//在组表中添加新增科目的信息
		this.addIntoAccountGroup(account, account.getUqaccountid());
		//添加科目分户核算关系
		//if (uqLedgeTypeIds != null && "".equals(uqLedgeTypeIds))
		if (uqLedgeTypeIds != null && !("".equals(uqLedgeTypeIds)))
		{
			//根据‘，’分割字符串
			String [] uqLedgeTypeIdArray = uqLedgeTypeIds.split(",");
			for (String uqLedgeTypeId : uqLedgeTypeIdArray) 
			{
				this.accountManagerDao.addAccountAndLedgeType(uqaccountid, uqLedgeTypeId);
			}
		}
	}
	
	public void editAccounts(AccountsEntity account, String uqLedgeTypeIds) throws Exception 
	{
		//验证同级下的科目名称是否唯一
		List<EntityMap> list = this.accountManagerDao.getAccountCountByName(account);
		if (list.size() > 1) 
		{
			throw new Exception("科目名称“"+account.getVaraccountname()+"”在本级中已存在，不可使用！");
		}
		this.accountManagerDao.editAccounts(account);
		//跟新科目分户核算关系
		this.accountManagerDao.deleteAccountAndLedgeType(account.getUqaccountid());
		//根据‘，’分割字符串
		if (uqLedgeTypeIds != null && !"".equals(uqLedgeTypeIds)) 
		{
			String [] uqLedgeTypeIdArray = uqLedgeTypeIds.split(",");
			for (String uqLedgeTypeId : uqLedgeTypeIdArray) 
			{
				this.accountManagerDao.addAccountAndLedgeType(account.getUqaccountid(), uqLedgeTypeId);
			}
		}
		if(list.size() == 0)
		{
			//跟新组表信息(主要是中间级名称)
			this.accountManagerDao.updateAccountGroupByGroupId(account.getUqaccountsetid(), 
					account.getVaraccountcode(), account.getVaraccountname());

			// 修改本级和下级全名称 
			List<String> idList = new ArrayList<String>();
			idList.add(account.getUqaccountid());
			this.updateAccountFullName(idList);
		}
	}
	
	public void updateAccountFullName(List<String> list) throws Exception 
	{
		for (int i = 0; i < list.size(); i++) 
		{
			String fullName = null;
			String uqaccountid = list.get(i);
			AccountsEntity account = this.accountManagerDao.getAccountById(uqaccountid).get(0);
			//获取父级信息
			AccountsEntity parent = this.accountManagerDao.getAccountById(account.getUqparentid()).get(0);
			if (parent.getUqaccountid().equals("00000000-0000-0000-0000-000000000000")) 
			{
				fullName = account.getVaraccountname();
			}
			else 
			{
				fullName = parent.getVaraccountfullname()+"-"+account.getVaraccountname();
			}
			//修改全名称
			account.setVaraccountfullname(fullName);
			this.accountManagerDao.updateAccountFullName(account);
			//递归循环下级 
			List<String> childList = this.accountManagerDao.getAccountIdList(account.getUqaccountid());
			this.updateAccountFullName(childList);
		}
	}
	
	public void deleteAccounts(List<String> idList) throws Exception 
	{
		//遍历集合
		for (String id : idList) 
		{
			//获取科目信息
			List<AccountsEntity> list = this.accountManagerDao.getAccountById(id);
			//判断科目是否已删除
			if (list.size()>0) 
			{
				AccountsEntity account = list.get(0);
				//判断是否开启
				if (!account.getIntflag().equals("2")) 
				{
					//判断是否被凭证使用
					List<Object> countList = this.accountManagerDao.getVoucherCountAboutAccount(account.getUqaccountid());
					if ("0".equals(countList.iterator().next().toString()))
					{
						//获取子集id集合
						List<String> idList2 = this.accountManagerDao.getAccountIdList(account.getUqaccountid());
						//递归调用自生
						this.deleteAccounts(idList2);

						//判断科目是否有往来数据
						//通过account.getUqaccountid()科目id去查询是否有  往来初始化数据
						List<Object> aciniCount = this.accountManagerDao.getAciniCount(account.getUqaccountid());
						//通过account.getUqaccountid()科目id去查询是否有  往来核销明细数据
						List<Object> acdetailCount = this.accountManagerDao.getAcdetailCount(account.getUqaccountid());
						if ((!"0".equals(aciniCount.iterator().next().toString())) && 
								(!"0".equals(acdetailCount.iterator().next().toString()))) 
						{
							throw new Exception("科目"+account.getVaraccountfullcode()+"含有往来数据，不可删除！");
						}
						
						//删除组表中信息
						this.accountManagerDao.deleteAccountGroupByAccountId(account.getUqaccountid());
						//判断是否分户  是则清除科目分户核算关系表
						if (account.getIntisledge().equals("1")) 
						{
							this.accountManagerDao.deleteAccountAndLedgeType(account.getUqaccountid());
						}
						//删除科目
						this.accountManagerDao.deleteAccounts(account.getUqaccountid());
						//判断上级是否含有子集（不含有则调整末级状态）
						List<String> list3 = this.accountManagerDao.getAccountIdList(account.getUqparentid());
						if (list3.size()<=0) 
						{
							//将父级的末级状态设为‘是末级’（置1）
							this.accountManagerDao.updateIntislastlevel(account.getUqparentid(), 1);
							//添加以父级为末级的组表信息
							AccountsEntity parent = this.accountManagerDao.getAccountById(account.getUqparentid()).get(0);
							this.addIntoAccountGroup(parent, parent.getUqaccountid());
						}
					}
					else 
					{
						throw new Exception("科目"+account.getVaraccountfullcode()+"尚有凭证在使用，不可删除！");
					}
				}
				else 
				{
					throw new Exception("科目"+account.getVaraccountfullcode()+"为开启状态，不可删除！");
				}
			}
		}
	}
	
	public void startIntflag(String uqaccountid, String startorclose) throws Exception 
	{
		List<AccountsEntity> list = this.accountManagerDao.getAccountById(uqaccountid);
		AccountsEntity accountEntity = list.get(0);
		int intflag = Integer.parseInt(accountEntity.getIntflag());
		String uqparentid = accountEntity.getUqparentid();
		if ((intflag != 2) && (!"00000000-0000-0000-0000-000000000000".equals(uqparentid))) 
		{
			this.startIntflag(uqparentid, startorclose);
		}
		this.accountManagerDao.updateIntflag(null,uqaccountid, null, startorclose, 1);
	}
	
	public void uploadAccountFile(InputStream is, String uqaccountsetid, StringHolder errormsg) throws Exception
	{
//		InputStream is = new FileInputStream(accountFile);//读取需要导入的文件
		Workbook wk = Workbook.getWorkbook(is);
		Sheet st = wk.getSheet(0);  //读取第一个表格
		Sheet st2 = wk.getSheet(1);  //读取第二个表格
		int rowlength = st.getRows();  //获取表格数据的行数
		int rowlength2 = st2.getRows();  //获取第二个表格数据的行数
		//判断表格中是否存在数据
		if (rowlength <= 1 && rowlength2 <= 1) 
		{
			throw new Exception("表格中没有数据!");
		}
		else
		{
			if (rowlength > 1) 
			{
				this.validateUploadFile(st, 1); //检查导入数据的字段是否匹配
				List<EntityMap> list = new ArrayList<EntityMap>();
				//因为第一行是字段名，所以循环从1开始
				for (int row = 1; row < rowlength; row++)
				{
					String accountcode = ObjectUtils.toString(st.getCell(0, row).getContents().trim());
					String accountname = ObjectUtils.toString(st.getCell(1, row).getContents().trim());
					String parentcode = ObjectUtils.toString(st.getCell(2, row).getContents().trim());
					String property = ObjectUtils.toString(st.getCell(3, row).getContents().trim());
					String type = ObjectUtils.toString(st.getCell(4, row).getContents().trim());
					String intisflow = ObjectUtils.toString(st.getCell(5, row).getContents().trim());
					String foreigncurrid = ObjectUtils.toString(st.getCell(6, row).getContents().trim());
					String measure = ObjectUtils.toString(st.getCell(7, row).getContents().trim());
					String flag = ObjectUtils.toString(st.getCell(8, row).getContents().trim());
					
					EntityMap entity = new EntityMap();
					entity.put("accountcode", accountcode);
					entity.put("accountname", accountname);
					entity.put("parentcode", parentcode);
					entity.put("property", property);
					entity.put("type", type);
					entity.put("intisflow", intisflow);
					entity.put("foreigncurrid", foreigncurrid);
					entity.put("measure", measure);
					entity.put("flag", flag);
					list.add(entity);
				}
				//检查数据是否符合规定
				this.chackAccountInfo(list, errormsg, uqaccountsetid);
				//如果文件的数据都正确，则保存数据
				if ("".equals(errormsg.value))
				{
					//先清空模板表数据
					this.accountManagerDao.dleteAccountModelAll();
					for (int i = 0; i < list.size(); i++) 
					{
						//将数据插入模板表
						this.accountManagerDao.importToAccountModel(list.get(i));
					}
					for (int i = 0; i < list.size(); i++) 
					{
						int j = i+2;
						//检验同级下名称不能相同
						List<String> checkNameList = this.accountManagerDao.getModelCountByName(list.get(i));
						if (!"1".equals(checkNameList.iterator().next().toString()))
						{
							errormsg.value += "表一中第"+ j + "条数据的科目名称存在重复|";
						}
					}
					if ("".equals(errormsg.value))
					{
						//执行存储过程 将模板表中数据导入到科目表
						this.accountManagerDao.importAccountInfo(uqaccountsetid);
						//执行存储过程 将刚导入的数据导入到科目组表
						this.accountManagerDao.importAccountGroup(uqaccountsetid);
						//再次清空模板表数据
						this.accountManagerDao.dleteAccountModelAll();
					}
				}
			}
			//导入科目分户核算关系表
			if (rowlength2 > 1)
			{
				this.uploadAccountAndLedgetype(st2, errormsg, uqaccountsetid);
			}
		}
	}

	public void uploadAccountAndLedgetype(Sheet st, StringHolder errormsg, String uqaccountsetid) throws Exception 
	{
		this.validateUploadFile(st, 2);
		int rowlength = st.getRows();  //获取表格数据的行数
		List<EntityMap> list = new ArrayList<EntityMap>();
		Map<String, Integer> map = new HashMap<String, Integer>();
		//因为第一行是字段名，所以循环从1开始
		for (int row = 1; row < rowlength; row++)
		{
			int j = row + 1;
			EntityMap entity = new EntityMap();
			String varaccountcode = ObjectUtils.toString(st.getCell(0, row).getContents().trim());
			String varledgetypename = ObjectUtils.toString(st.getCell(1, row).getContents().trim());
			String accountAndLedgety = varaccountcode+"_"+varledgetypename;
			//检查数据 
			//1.检验各项非空字段；
			boolean hasnull = true;
			if (varaccountcode==null || "".equals(varaccountcode)) 
			{
				errormsg.value += "表二中第 "+ j + "行[科目编号]为空|";
				hasnull = false;
			}
			if (varledgetypename==null || "".equals(varledgetypename)) 
			{
				errormsg.value += "表二中第 "+ j + "行[分户类别名称]为空|";
				hasnull = false;
			}
			if (hasnull) 
			{
				//2.验证科目是否存在
				List<AccountsEntity> list1 = this.accountManagerDao.getAccountByCode(varaccountcode, uqaccountsetid);
				if (list1.size() <= 0) 
				{
					errormsg.value += "表二中第"+ j + "行的科目不存在|";
				}
				else 
				{
					AccountsEntity account = list1.get(0);
					String uqaccountid = account.getUqaccountid();
					entity.put("uqaccountid", uqaccountid);
					//检查 分户类别是否存在
					List<LedgerTypeEntity> list2 = this.accountManagerDao.getLedgerTypeByName(varledgetypename);
					if (list2.size() <= 0) 
					{
						errormsg.value += "表二中第"+ j + "行的分户类别不存在|";
					}
					else 
					{
						LedgerTypeEntity ledgerType = list2.get(0);
						String uqledgetypeid = ledgerType.getUqledgetypeid();
						entity.put("uqledgetypeid", uqledgetypeid);
						list.add(entity);
						//检查 科目分户核算关系是否以存在
						List<String> list3 = this.accountManagerDao.getAccountAndLedgetypeCount(uqaccountid, uqledgetypeid);
						if (!"0".equals(list3.iterator().next().toString())) 
						{
							errormsg.value += "表二中第"+ j + "行科目分户核算关系已存在|";
						}
						else 
						{
							//检查导入数据中重复记录
							if (map.containsKey(accountAndLedgety)) 
							{
								map.put(accountAndLedgety, 1);
								errormsg.value += "表二中第"+ j + "行数据存在重复记录|";
							}
							else 
							{
								map.put(accountAndLedgety, 0);
							}
						}
					}
				}
			}
		}
		if ("".equals(errormsg.value)) 
		{
			//检查无误 执行插入
			for (int i = 0; i < list.size(); i++) 
			{
				String uqaccountid = list.get(i).getString("uqaccountid");
				String uqledgetypeid = list.get(i).getString("uqledgetypeid");
				//先更新科目的是否分户状态
				this.accountManagerDao.updateAccountIsledge(uqaccountid, 1);
				//再执行插入科目分户核算关系表
				this.accountManagerDao.insertIntoAccountAndLedgetype(uqaccountid, uqledgetypeid);
			}
		}
		else 
		{
			throw new RuntimeException(errormsg.value);
		}
	}
	
	public List<Object[]> exportAccountInfo(String uqaccountsetid) throws Exception 
	{
		return this.accountManagerDao.exportAccountInfo(uqaccountsetid);
	}
	
	public void validateUploadFile(Sheet st, int flag) throws Exception
	{
		if (flag == 1) 
		{
			if ("科目编号".equals(st.getCell(0, 0).getContents()) 
					&& "名称".equals(st.getCell(1, 0).getContents())
					&& "上级科目编号".equals(st.getCell(2, 0).getContents())
					&& "科目性质编号".equals(st.getCell(3,0).getContents())
					&& "科目类别编号".equals(st.getCell(4,0).getContents())
					&& "现金流量标志".equals(st.getCell(5,0).getContents())
					&& "外币编号".equals(st.getCell(6,0).getContents())
					&& "计量单位编号".equals(st.getCell(7,0).getContents())
					&& "状态".equals(st.getCell(8,0).getContents()))
			{}
			else
			{
				throw new Exception("模版表一不正确,请重新选择!");
			}
		}
		if (flag == 2) 
		{
			if ("科目编号".equals(st.getCell(0, 0).getContents()) 
				&& "分户类别名称".equals(st.getCell(1, 0).getContents()))
			{}
			else
			{
				throw new Exception("模版表二不正确,请重新选择!");
			}
		}
	}

	public void chackAccountInfo(List<EntityMap> list, StringHolder errormsg, String uqaccountsetid) throws Exception
	{
		//1.检验各项非空字段；
		Map<String, Integer> map = new HashMap<String, Integer>();
		for (int i = 0; i < list.size(); i++) 
		{
			int j = i+2;
			EntityMap entity = list.get(i);
			String accountcode = entity.getString("accountcode");
			String accountname = entity.getString("accountname");
			String parentcode = entity.getString("parentcode");
			String property = entity.getString("property");
//			String type = entity.getString("type");
			String intisflow = entity.getString("intisflow");
//			String foreigncurrid = entity.getString("foreigncurrid");
//			String measure = entity.getString("measure");
			String flag = entity.getString("flag");
			boolean hasnull = true;
			//1.检验各项非空字段；
			if (accountcode==null || "".equals(accountcode)) 
			{
				errormsg.value += "表一中第 "+ j + " 行[科目编号]为空|";
				hasnull = false;
			}
			if (accountname==null || "".equals(accountname)) 
			{
				errormsg.value += "表一中第 "+ j + " 行[科目名称]为空|";
				hasnull = false;
			}
			if (parentcode==null || "".equals(parentcode)) 
			{
				errormsg.value += "表一中第"+ j + " 行[上级科目编号]为空|";
				hasnull = false;
			}
			if (property==null || "".equals(property)) 
			{
				errormsg.value += "表一中第"+ j + " 行[科目性质]为空|";
				hasnull = false;
			}
			if (intisflow==null || "".equals(intisflow)) 
			{
				errormsg.value += "表一中第"+ j + " 行[现金流量]为空|";
				hasnull = false;
			}
			if (flag==null || "".equals(flag)) 
			{
				errormsg.value += "表一中第"+ j + " 行[科目状态]为空|";
				hasnull = false;
			}
			if (hasnull) 
			{
				//验证编码是否唯一
				List<String> list1 = this.accountManagerDao.getAccountCountByCode(uqaccountsetid, accountcode);
				if (!"0".equals(list1.iterator().next().toString())) 
				{
					errormsg.value += "表一中编号为第"+ j + " 行 科目编号的科目以存在|";
				}
				if (map.containsKey(accountcode)) 
				{
					//检验科目编号重复记录
					map.put(accountcode, 1);
					errormsg.value += "表一中第"+ j + "条数据的科目编号存在重复|";
				}
				else 
				{
					map.put(accountcode, 0);
				}
			}
		}
	}
	
	public void addIntoAccountGroup(AccountsEntity account, String parentid) throws Exception 
	{
		//判断是否到顶级
		if (!"00000000-0000-0000-0000-000000000000".equals(parentid)) 
		{
			//获取父级信息
			AccountsEntity parentEntity = this.accountManagerDao.getAccountById(parentid).get(0);
			//封装组表实体
			EntityMap entity = new EntityMap();
			entity.put("uqaccountsetid", account.getUqaccountsetid());
			entity.put("uqgroupid", UUID.randomUUID().toString().toUpperCase());
			entity.put("vargroupname", parentEntity.getVaraccountname());
			entity.put("vargroupcode", parentEntity.getVaraccountcode());
			entity.put("vargroupfullcode", parentEntity.getVaraccountfullcode());
			entity.put("intgrouplevel", parentEntity.getIntlevel());
			entity.put("uqaccountid", account.getUqaccountid());
			entity.put("varaccountcode", account.getVaraccountcode());
			entity.put("intaccountlevel", account.getIntlevel());
			if (parentEntity.getUqaccountid().equals(account.getUqparentid())) 
			{
				entity.put("intislastlevel", 0);
			}
			else 
			{
				entity.put("intislastlevel", parentEntity.getIntislastlevel());
			}
			
			//执行插入
			this.accountManagerDao.insertIntoAccountGroup(entity);
			//递归自身
			this.addIntoAccountGroup(account, parentEntity.getUqparentid());
		}
	}
	
	public boolean checkIntIsFlow(String uqaccountid) throws Exception 
	{
		List<EntityMap> list = this.accountManagerDao.checkIntIsFlow(uqaccountid);
		if (list.size() > 0) {
			return false;
		}
		else
		{
			return true;
		}
	}

	public void refreshFullName(String uqaccountsetid) throws Exception 
	{
		List<String> idList = this.accountManagerDao.getAccountIdList("00000000-0000-0000-0000-000000000000");
		this.updateAccountFullName(idList);
	}
	
}
