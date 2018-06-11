package com.newtouch.nwfs.gl.datamanger.bp;

import java.io.InputStream;
import java.util.ArrayList;
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
import com.newtouch.cloud.common.session.M8Session;
import com.newtouch.nwfs.gl.datamanger.dao.LedgerManagerDao;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerItemEntity;
import com.newtouch.nwfs.gl.datamanger.entity.LedgerTypeEntity;

/**
 * 分户管理bp层实现类
 * @author Administrator
 *
 */
@Service
@Transactional
public class LedgerManagerBP
{
	@Autowired
	private LedgerManagerDao ledgerManagerDao; 
	
	/**
	 * 获取左侧分户类别树
	 */
	public List<Object> getLedgerTypeByParentID(String parentId)
			throws Exception 
	{	
		//通过action传来的parentId
		return ledgerManagerDao.getLedgerTypeByParentID(parentId);
	}

	/**
	 * 左侧类别树点击时 根据类别ID和分户项目的‘父级项目ID’获取分户明细，且需要过滤掉不是当前登录用户所在公司的数据，目前只实现到将末级过滤掉不显示，而中间级显示为文件夹
	 */
	public List<Object> getledgerItemByTypeAndParentID(String uqledgetypeid,
			String parentId,String companyid) throws Exception 
	{
		List<Object> judgeList = ledgerManagerDao.getledgerItemByTypeAndParentID(uqledgetypeid,parentId);
		List<Object> delList = new ArrayList<Object>();
		for (Object obj : judgeList)
		{
			Object[] objs = (Object[])obj;
			String getCompanyId = objs[12] == null ? "" : objs[12].toString();
			String intislastlevel = objs[10].toString();
			int islastlevel = Integer.parseInt(intislastlevel);
			if(!getCompanyId.equals(companyid) && islastlevel == 1)
			{
				delList.add(obj);
			}
		}
		judgeList.removeAll(delList);
		return judgeList;	
	}

	/**
	 * 新增分户类别
	 */
	public void addLedgerType(LedgerTypeEntity ledgerType) throws Exception 
	{
		//验证同级下的类别名称是否唯一,如果名称不唯一，则抛出异常
		List<?> list=this.ledgerManagerDao.getLedgerTypeByName(ledgerType);
		if (!"0".equals(list.iterator().next().toString()))
		{
			throw new Exception(ledgerType.getVarledgetypename()+"在本级中已存在，不可使用！");
		}
		//继续封装实体类
		String uqLedgerTypeId=UUID.randomUUID().toString().toUpperCase();
		String varLedgerTypeCode=uqLedgerTypeId;
		String uqParentId=uqLedgerTypeId;
		ledgerType.setUqledgetypeid(uqLedgerTypeId);
		ledgerType.setVarledgetypecode(varLedgerTypeCode);
		ledgerType.setUqparentid(uqParentId);
		//调用dao层方法进行插入
		this.ledgerManagerDao.addLedgerType(ledgerType);
	}

	/**
	 * 修改分户类别
	 */
	public void editLedgerType(LedgerTypeEntity ledgerType) throws Exception 
	{
		//验证同级下的类别名称是否唯一,如果不唯一，则抛出异常
		List<?> list=this.ledgerManagerDao.getLedgerTypeByName(ledgerType);
		if (!"0".equals(list.iterator().next().toString()))
		{
			throw new Exception(ledgerType.getVarledgetypename()+"在本级中已存在，不可使用！");
		}
		this.ledgerManagerDao.editLedgerType(ledgerType);
	}

	/**
	 * 删除分户类别
	 */
	public void deleteLedgerType(String uqledgetypeid) throws Exception 
	{
		//判断分户类别下面是否含有项目
		//如果分户类别下有子项目，则不能删除，抛出异常
		//判断分户类别是否存在
		List<LedgerTypeEntity> list = this.ledgerManagerDao.getLedgerTypeByID(uqledgetypeid);
		if (list.size()>0)
		{	//判断分户类别有没有被科目引用
			List<Object> list2 = this.ledgerManagerDao.getAccountByTypeID(uqledgetypeid);
			if ("0".equals(list2.iterator().next().toString()))
			{
				//判断分户类别下是否有分户明细
				LedgerTypeEntity ledgerType=list.get(0);
				List<Object> ledgerItem = this.ledgerManagerDao.getItemByTypeID(ledgerType.getUqledgetypeid());
				if ("0".equals(ledgerItem.iterator().next().toString()))
				{
					this.ledgerManagerDao.deleteLedgerType(ledgerType.getUqledgetypeid());
				}
				else
				{
					throw new Exception(ledgerType.getVarledgetypename()+"尚有分户项目在使用，不可删除！");
				}
			}
			else
			{
				throw new Exception(list.get(0).getVarledgetypename()+"尚有科目在使用，不可删除！");
			}
		} 
	}

	/**
	 * 新增分户明细
	 */
	public void addLedgerItem(LedgerItemEntity ledgerItem,String companyId) throws Exception 
	{
		//需要用户输入两个数据，明细编号和名称
		//1、验证同一个类别下编码是否唯一，如果不唯一，则抛出异常
		List<LedgerItemEntity> list = this.ledgerManagerDao.getLedgerItemByCode(ledgerItem);
		if (list.size()>0)
		{
			throw new Exception("分户明细编号"+ledgerItem.getVarledgecode()+"在当前类别下已存在，不可使用！");
		}
		//2、验证同级下的明细名称是否唯一,如果不唯一,则抛出异常
		List<Object> list2 = this.ledgerManagerDao.getLedgerItemName(ledgerItem);
		if (!"0".equals(list2.iterator().next().toString())) 
		{
			throw new Exception(ledgerItem.getVarledgename()+"在本级中已存在，不可使用！");
		}
		//3、获取父级分户明细信息（全编码、等级）以获取新增分户明细全编码和等级
		String fullCode=null;
		String fullName=null;
		LedgerItemEntity parentItem = null;
		int level;
		ledgerItem.setUqledgeid(UUID.randomUUID().toString().toUpperCase());
		if("".equals(ledgerItem.getUqparentid()) || ledgerItem.getUqparentid() == null)
		{
			level=1;
			fullCode=ledgerItem.getVarledgecode();
			fullName=ledgerItem.getVarledgename();
			ledgerItem.setUqparentid(ledgerItem.getUqledgeid());
			ledgerItem.setVarledgefullcode(fullCode);
			ledgerItem.setVarledgefullname(fullName);
			ledgerItem.setIntlevel(level+"");
			//6、将新增维护到分户明细组表，新增的项目肯定是末级项目，如果新增的项目为一级项目，则只需要插入一条数据，定义一个方法，专门用于插入末级数据
			//7、如果是一级分户明细，那么只需要插入自己的一条数据即可
		}
		else
		{
			parentItem = this.ledgerManagerDao.getLedgerItemByID(ledgerItem.getUqparentid()).get(0);
			fullCode=parentItem.getVarledgefullcode()+"."+ledgerItem.getVarledgecode();
			fullName=parentItem.getVarledgefullname()+"."+ledgerItem.getVarledgename();
			level=Integer.parseInt(parentItem.getIntlevel())+1;
			ledgerItem.setVarledgefullcode(fullCode);
			ledgerItem.setVarledgefullname(fullName);
			ledgerItem.setIntlevel(level+"");
			//4、判断修改父级的末级状态，itemParent.getIntislastlevel().equals("1")表示父级为末级
			if (parentItem.getIntislastlevel().equals("1"))
			{
				this.ledgerManagerDao.updateIntisLastLevel(parentItem.getUqledgeid(), 0);
			}
			//如果不是一级分户明细，那么除了插入他自己作为末级的一条之外，还需要修改其上级以及上级的上级的信息，在这里，我们全部删除然后重新递归插入
			//清除以父级为末级在组表中的数据
			this.ledgerManagerDao.deleteLedgerGroupByLedgerId(parentItem.getUqledgeid());
		}
		//5、新增分户项目
		this.ledgerManagerDao.addLedgerItem(ledgerItem, companyId);
		//维护组表中的数据
		this.insertInToGroup(ledgerItem,ledgerItem.getUqledgeid());
	}

	/**
	 * 修改分户明细
	 */
	public void editLedgerItem(LedgerItemEntity ledgerItem) throws Exception 
	{
		//由于只允许用户修改名称，所以只需验证同级下的分户明细名称是否唯一，如果不唯一，则抛出异常
		List<Object> list = this.ledgerManagerDao.getLedgerItemName(ledgerItem);
		if (!"0".equals(list.iterator().next().toString())) 
		{
			throw new Exception(ledgerItem.getVarledgename()+"在本级中已存在，不可使用！");
		}
		//修改分户项目
		this.ledgerManagerDao.editLedgerItem(ledgerItem);
		//将修改维护到分户明细组表
		//修改的数据是哪一级，组表中相应的中间级名称要进行修改
		this.ledgerManagerDao.updateGroup(ledgerItem);
	}

	/**
	 * 删除分户明细
	 */
	public void deleteLedgerItem(String uqledgeid,String companyid) throws Exception 
	{
		//1、判断分户是否已删除?
		//2、如果要删除的分户明细存在,判断分户项目下面有没有子项目，如果有子项目，则抛出异常
		//3、如果分户明细下面没有子项目了，判断分户是否被凭证使用，如果被凭证使用，则抛出异常
		//4、如果分户没有被凭证所使用，调用方法删除
		//5、判断上级是否含有子集
		//6、如果不含有子集了，将父级的末级状态设为‘是末级’（置1）
		List<LedgerItemEntity> list = this.ledgerManagerDao.getLedgerItemByID(uqledgeid);
		if (!"0".equals(list.iterator().next().toString()))
		{
			LedgerItemEntity ltem=list.get(0);
			List<Object> list2 = this.ledgerManagerDao.isLastLevel(ltem);
			int level = Integer.parseInt(ltem.getIntlevel());
			if (!"0".equals(list2.iterator().next().toString()))
			{
				List<Object> vocherList = this.ledgerManagerDao.getVoucherByLedger(ltem.getUqledgeid());
				if ("0".equals(vocherList.iterator().next().toString()))
				{
					List<Object> list3 = this.ledgerManagerDao.getLedgerItemList(ltem);
					//清除明细表此信息
					this.ledgerManagerDao.deleteLedgerItem(ltem.getUqledgeid());
					//清除组表此末级信息
					this.ledgerManagerDao.deleteLedgerGroupByLedgerId(ltem.getUqledgeid());
					if ((level==2&&list3.size()==1)||(level>2&&list3.size()==0)) 
					{
						//将父级的末级状态设为‘是末级’（置1）
						this.ledgerManagerDao.updateIntisLastLevel(ltem.getUqparentid(), 1);
						//如果上级是末级了，就要把上级作为末级再维护到tgl_ledger_company表中
						if(level>=2)
						{
							this.ledgerManagerDao.addLastLevelToCompany(ltem.getUqparentid(),companyid);
						}
						//新增上级的组表信息
						LedgerItemEntity parent=this.ledgerManagerDao.getLedgerItemByID(ltem.getUqparentid()).get(0);
						this.insertInToGroup(parent, parent.getUqledgeid());
					}
				}
				else
				{
					throw new Exception("分户项目"+ltem.getVarledgename()+"尚有凭证在使用，不可删除！");
				}
			}
			else
			{
				throw new Exception("分户项目"+ltem.getVarledgename()+"下有子项目，不可删除！");
			}
		}
	}
	
	/**
	 * 导入分户明细
	 */
	public void importLedgerItem(InputStream is, String uqcompanyid,
			StringHolder errormsg) throws Exception 
	{
		Workbook wk = Workbook.getWorkbook(is);
		Sheet st = wk.getSheet(0);  //读取第一个表格
		int rowlength= st.getRows();  //获取表格数据的行数
		errormsg.value = "";
		//String uqaccountid = "";
		
		if(null == uqcompanyid || "".equals(uqcompanyid))
		{
			M8Session session = new M8Session();
			uqcompanyid = ObjectUtils.toString(session.getAttribute("M8_COMPANYID"));
		}
		
		this.checkInitPeriodTemplate(st); //检查导入数据的字段是否匹配
		List<EntityMap> list = new ArrayList<EntityMap>();
		//Map<String, Integer> ledgerMap = new HashMap<String, Integer>();
		//因为第一行是字段名，所以循环从1开始
		for (int row = 1; row < rowlength; row++)
		{
			String ledgertypename = ObjectUtils.toString(st.getCell(0, row).getContents().trim());
			String ledgeritemcode = ObjectUtils.toString(st.getCell(1, row).getContents().trim());
			String ledgeritemname = ObjectUtils.toString(st.getCell(2, row).getContents().trim());
			String parentcode = ObjectUtils.toString(st.getCell(3, row).getContents().trim());
			
			EntityMap entity = new EntityMap();
			entity.put("ledgertypename", ledgertypename);
			entity.put("ledgeritemcode", ledgeritemcode);
			entity.put("ledgeritemname", ledgeritemname);
			entity.put("parentcode", parentcode);
			list.add(entity);
		}
		//检查数据是否符合规定
		this.chackImportData(list, errormsg);
		//如果文件的数据都正确，则保存数据进入模板表,在模板表中校验Excel表格所有的数据，如果没有错误，再执行存储过程插入真实的表
		if ("".equals(errormsg.value))
		{
			//每次导入之前要清空一次模板表
			this.ledgerManagerDao.deleteModelTable();
			for (int i = 0; i < list.size(); i++)
			{
				EntityMap newEntity = new EntityMap();
				newEntity.put("ledgertypename", list.get(i).get("ledgertypename"));
				newEntity.put("ledgeritemcode", list.get(i).get("ledgeritemcode"));
				newEntity.put("ledgeritemname", list.get(i).get("ledgeritemname"));
				newEntity.put("parentcode", list.get(i).get("parentcode"));
				//将数据插入到模板表
				this.ledgerManagerDao.insertModelTable(newEntity);
			}
			for (int i = 0; i < list.size(); i++)
			{
				int j = i+1;
				EntityMap newEntity = new EntityMap();
				newEntity.put("ledgertypename", list.get(i).get("ledgertypename"));
				newEntity.put("ledgeritemcode", list.get(i).get("ledgeritemcode"));
				newEntity.put("ledgeritemname", list.get(i).get("ledgeritemname"));
				newEntity.put("parentcode", list.get(i).get("parentcode"));
				//校验模板表中所有的数据，判断同一个类别下编码不能重复
				List<Object> checklist1 = this.ledgerManagerDao.checkTypeCode(newEntity);
				if (!"1".equals(checklist1.iterator().next().toString()))
				{
					errormsg.value += "第 "+ j + " 行同类别下编码重复，请检查该条数据|";
				}
				//校验模板表中，同一个上级下名称是否唯一
				List<Object> checklist2 = this.ledgerManagerDao.checkItemName(newEntity);
				if(!"1".equals(checklist2.iterator().next().toString()))
				{
					errormsg.value += "第 "+ j + " 行同级下名称重复，请检查该条数据|";
				}
			}
			//如果出现问题，抛出RuntimeException，使数据库事务回滚
			if (!"".equals(errormsg.value))
			{
				throw new RuntimeException(errormsg.value);
			}
			//调用过程 从模板中导入分户明细表和单位公司表
			this.ledgerManagerDao.callProcedure(uqcompanyid);
			//调用过程，将导入的数据维护到明细组表中
			this.ledgerManagerDao.callProcedureGroup();
			//最后把模板表中的数据全部清除，必须保证模板表在每次导入之前里面不能有数据
			this.ledgerManagerDao.deleteModelTable();
		}
	}
	
	/**
	 * 该方法用于校验数据
	 */
	public void chackImportData(List<EntityMap> list, StringHolder errormsg)
			throws Exception {
		for (int i = 0; i < list.size(); i++)
		{
			int j=i+1;
			EntityMap entity = list.get(i);
			String ledgertypename = entity.getString("ledgertypename");
			String ledgeritemcode = entity.getString("ledgeritemcode");
			String ledgeritemname = entity.getString("ledgeritemname");
			String parentcode = entity.getString("parentcode");
			boolean isNull = true;
			//1、由于模板表中的字段都不允许为空，所以先校验excel中的数据是否为空
			if(ledgertypename==null || "".equals(ledgertypename))
			{
				errormsg.value += "第 "+ j + " 行 【分户类别名称】为空|";
				isNull = false;
			}
			if(ledgeritemcode==null || "".equals(ledgeritemcode))
			{
				errormsg.value += "第 "+ j + " 行 【分户项目编码】为空|";
				isNull = false;
			}
			if(ledgeritemname==null || "".equals(ledgeritemname))
			{
				errormsg.value += "第 "+ j + " 行 【分户项目名称】为空|";
				isNull = false;
			}
			if(parentcode==null || "".equals(parentcode))
			{
				errormsg.value += "第 "+ j + " 行 【上级项目编码】为空|";
				isNull = false;
			}
			//如果导入的数据没有未填写的，则继续校验下面的
			if(isNull)
			{
				//2、校验导入的分户类别是否存在(根据名称来判断)
				List<Object> list2 = this.ledgerManagerDao.getLedgerTypeEntityByName(ledgertypename);
				if ("0".equals(list2.iterator().next().toString()))
				{
					errormsg.value += "第 "+ j + " 行分户类别不存在，请检查该条数据|";
				}
				else
				{
					//3、检查同一类别下编码是否重复，这是考虑到之前类别中已经有手动在界面上添加分户项目的情况
					List<LedgerItemEntity> list3 = this.ledgerManagerDao.getLedgerItemEntityByCode(ledgertypename,ledgeritemcode);
					if(list3.size()>0)
					{
						errormsg.value += "第 "+ j + " 行 分户项目编码已存在,请仔细核对|";
					}
				}
			}
		}
	}
	
	/**
	 * 导出分户明细
	 */
	public List<Object[]> exportLedgerItem(String uqcompanyid) throws Exception 
	{
		return this.ledgerManagerDao.exportLedgerItem(uqcompanyid);
	}
	
	/**
	 * 检查导入数据的字段是否匹配
	 * */
	private void checkInitPeriodTemplate(Sheet st) throws Exception
	{
		if ("分户类别".equals(st.getCell(0, 0).getContents()) 
				&& "分户项目编码".equals(st.getCell(1, 0).getContents())
				&& "分户项目名称".equals(st.getCell(2, 0).getContents())
				&& "上级项目编码".equals(st.getCell(3,0).getContents())){
		}else{
			throw new Exception("导入模版不正确!请重新选择");
		}
	}
	
	/**
	 * 用于在界面上手动增加分户明细的时候递归向组表中插入数据
	 * */
	public void insertInToGroup(LedgerItemEntity ledgerItem,String parentId) throws Exception
	{
		LedgerItemEntity item=this.ledgerManagerDao.getLedgerItemByID(parentId).get(0);
		//判断是否是一级项目
		if(!item.getUqledgeid().equals(item.getUqparentid()))
		{
			//不是一级项目,且第一次肯定为末级
			EntityMap entity = new EntityMap();
			entity.put("uqgroupid", UUID.randomUUID().toString().toUpperCase());
			entity.put("vargroupname", item.getVarledgename());
			entity.put("vargroupcode", item.getVarledgecode());
			entity.put("vargroupfullcode", item.getVarledgefullcode());
			entity.put("intgrouplevel", item.getIntlevel());
			entity.put("uqledgeid", ledgerItem.getUqledgeid());
			entity.put("varledgecode", ledgerItem.getVarledgecode());
			entity.put("intlevel", ledgerItem.getIntlevel());
			if (item.getUqledgeid().equals(ledgerItem.getUqparentid())) 
			{
				entity.put("intislastlevel", 0);
			}
			else 
			{
				entity.put("intislastlevel", item.getIntislastlevel());
			}
			//插入自身
			this.ledgerManagerDao.insertLastLevelToGroupTable(entity);
			//递归自身
			this.insertInToGroup(ledgerItem, item.getUqparentid());
		}
		else
		{
			//因为插入一级项目的组表信息时，其parentid等于自己的id,所以在else里面再单独插入一次
			EntityMap entity = new EntityMap();
			entity.put("uqgroupid", UUID.randomUUID().toString().toUpperCase());
			entity.put("vargroupname", item.getVarledgename());
			entity.put("vargroupcode", item.getVarledgecode());
			entity.put("vargroupfullcode", item.getVarledgefullcode());
			entity.put("intgrouplevel", item.getIntlevel());
			entity.put("uqledgeid", ledgerItem.getUqledgeid());
			entity.put("varledgecode", ledgerItem.getVarledgecode());
			entity.put("intlevel", ledgerItem.getIntlevel());
			if (item.getUqledgeid().equals(ledgerItem.getUqparentid())) 
			{
				if(ledgerItem.getIntlevel().equals("1"))
				{
					entity.put("intislastlevel", 1);
				}
				else
				{
					entity.put("intislastlevel", 0);
				}
			}
			else 
			{
				entity.put("intislastlevel", item.getIntislastlevel());
			}
			//插入自身
			this.ledgerManagerDao.insertLastLevelToGroupTable(entity);
		}
	}

	public void importLedgerType(InputStream is, StringHolder errormsg) throws Exception 
	{
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

					EntityMap entity = new EntityMap();
					entity.put("name", name);
					list.add(entity);
				}

				//校验
				this.checkImportLedgerType(list, errormsg);
				//校验通过后，写入会计期表
				if ("".equals(errormsg.value))
				{
					for (int i = 0; i < list.size(); i++) 
					{
						//int j = i+2;
						String ledgerTypeName = list.get(i).getString("name");
						LedgerTypeEntity ledgerType=new LedgerTypeEntity(null,null,ledgerTypeName,null,"1","2");
						
						addLedgerType(ledgerType);
					}
					
				}
			}
		}
	}
	
	public void checkImportLedgerType(List<EntityMap> list, StringHolder errormsg) throws Exception
	{
		//1.检验各项非空字段；
		Map<String, Integer> mapName = new HashMap<String, Integer>();
		for (int i = 0; i < list.size(); i++) 
		{
			int j = i+2;
			EntityMap entity = list.get(i);
			String name = entity.getString("name");
			boolean hasnull = true;
			//1.检验各项非空字段；
			if (name==null || "".equals(name)) 
			{
				errormsg.value += "第"+ j + " 行[分户类别名称]为空|";
				hasnull = false;
			}
			
			if (hasnull) 
			{
				
				//验证编码是否唯一
				List<Object> listName=this.ledgerManagerDao.getLedgerTypeByName(name);
				if (!"0".equals(listName.iterator().next().toString()))
				{
					errormsg.value += "第"+ j + " 行[分户类别名称]已存在|";
				}
				
				if (mapName.containsKey(name)) 
				{
					//检验科目编号重复记录
					mapName.put(name, 1);
					errormsg.value += "第"+ j + "条数据的分户类别名称存在重复|";
				}
				else 
				{
					mapName.put(name, 0);
				}
			}
		}
	}
}
