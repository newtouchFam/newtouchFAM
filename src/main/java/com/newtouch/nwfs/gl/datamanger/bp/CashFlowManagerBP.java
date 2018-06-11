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
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.dao.CashFlowManagerDAO;
import com.newtouch.nwfs.gl.datamanger.entity.FlowItemsEntity;
import com.newtouch.nwfs.gl.datamanger.entity.FlowItemsModelEntiy;
import com.newtouch.nwfs.gl.datamanger.entity.FlowTypeEntity;
import com.newtouch.nwfs.gl.datamanger.entity.FlowTypeModelEntiy;

/**
 * 现金流量管理的BP层
 * @author feng
 *
 */
@Service
@Transactional
public class CashFlowManagerBP 
{
	@Autowired
	private CashFlowManagerDAO cashflowDao;
	
	/**
	 * 获得现金流量分类树
	 * @param parentId	节点的ID
	 * @return	分类树的数据集合
	 * @throws Exception
	 */
	public List<Object> getTypeTree(String parentId) throws Exception 
	{
		return cashflowDao.getTypeTree(parentId);
	}

	/**
	 * 根据现金流量类别ID，获得项目数据
	 * @param uqflowtypeid	现金分类ID
	 * @param start	 分页起始
	 * @param limit	 每页数值
	 * @return	项目列表的数据集合
	 * @throws Exception
	 */
	public PageData<EntityMap> getItemsGrid(String uqflowtypeid, int start,int limit) throws Exception 
	{
		return cashflowDao.getItemsGrid(uqflowtypeid, start, limit);
	}

	/**
	 * 新增现金流量类别	
	 * @param flowtype	现金分类实体
	 * @throws Exception
	 */
	public void addType(FlowTypeEntity flowtype ,String uqflowtypeid) throws Exception 
	{
		String id = UUID.randomUUID().toString().toUpperCase();
		//判断编号是否唯一
		if(cashflowDao.exitTypeCode(flowtype.getVarcode(), id))
		{
			//同一个上级类别下，类别名称是否唯一
			if(cashflowDao.exitTypeName(flowtype.getUqparentid(),flowtype.getVarname(),id))
			{
				String varfullcode = null;
				String varfullname = null;
				String uqparentid = null;
				FlowTypeEntity flowTypeEntity =  null ;
				String intlevel = "1";
				//判断是否选择的是根节点
				if(uqflowtypeid.equals("00000000-0000-0000-0000-000000000000"))
				{
					//根节点新增的类别 编码=全编码，名称=全名称 父级ID=ID
					varfullcode	= flowtype.getVarcode();
					varfullname = flowtype.getVarname();
					uqparentid = id ;
				}
				else
				{
					//根据选择节点ID，得到父级分类信息
					flowTypeEntity = cashflowDao.getFlowTypeById(uqflowtypeid).get(0);
					varfullcode	= flowTypeEntity.getVarfullcode()+"."+flowtype.getVarcode();
					varfullname = flowTypeEntity.getVarfullname()+"."+flowtype.getVarname();
					intlevel = (Integer.parseInt(flowTypeEntity.getIntlevel())+1)+"";
					uqparentid = uqflowtypeid;
					//判断父级本身是否末级
					if("1".equals(flowTypeEntity.getIntislastlevel()))
					{
						//是末级需要修改末级的标志位
						cashflowDao.updateTypeIntislastlevel(uqparentid,"0");
					}
				}
				
				flowtype.setUqflowtypeid(id);
				flowtype.setUqparentid(uqparentid);
				flowtype.setVarfullcode(varfullcode);
				flowtype.setVarfullname(varfullname);
				flowtype.setIntlevel(intlevel);
				
				cashflowDao.addType(flowtype);
			}
			else
			{
				throw new Exception("该现金流量类别的名称已存在");
			}
		}
		else
		{
			throw new Exception("该现金流量类别的编号已存在");
		}
	}

	/**
	 * 修改现金流量类别
	 * @param flowtype	现金分类实体
	 * @throws Exception
	 */
	public void editType(FlowTypeEntity flowtype) throws Exception 
	{
		//判断名称与编号是否唯一
		if(cashflowDao.exitTypeCode(flowtype.getVarcode(), flowtype.getUqflowtypeid()))
		{
			if(cashflowDao.exitTypeName(flowtype.getUqparentid(),flowtype.getVarname(),flowtype.getUqflowtypeid()))
			{
				//修改code，name 全编码，全名称也要对应的改变
				String varfullcode = null;
				String varfullname = null;
				//获得上级信息
				FlowTypeEntity flowTypeEntity = cashflowDao.getFlowTypeById(flowtype.getUqparentid()).get(0);
				//获得自己的信息
				FlowTypeEntity flowTypeEntity2 = cashflowDao.getFlowTypeById(flowtype.getUqflowtypeid()).get(0);
				
				//如果是第一级别分类
				if(flowTypeEntity2.getIntlevel().equals("1"))
				{
					varfullcode = flowtype.getVarcode();
					varfullname = flowtype.getVarname();
				}
				else
				{
					varfullcode = flowTypeEntity.getVarfullcode()+"."+flowtype.getVarcode();
					varfullname = flowTypeEntity.getVarfullname()+"."+flowtype.getVarname();
				}
				
				flowtype.setVarfullcode(varfullcode);
				flowtype.setVarfullname(varfullname);
				
				//判断如果不是末级的话 需要将他下级的全名称全编号 也更新
				if(flowTypeEntity2.getIntislastlevel().equals("0"))
				{
					String typeid = null ;
					//获得旧的的全编码、全名称
					String oldvarfullcode = flowTypeEntity2.getVarfullcode();
					String oldvarfullname = flowTypeEntity2.getVarfullname();
					//定义新的 全编码、全名称
					String varfullcode2 = null;
					String varfullname2 = null;
					//调一个方法查出该类别下的所有分类的全名称与全编号  通过String 替换掉  更新全编码 全名称
					List<FlowTypeEntity> flowTypeList = cashflowDao.getFlowTypeList(oldvarfullcode, oldvarfullname, flowtype.getUqflowtypeid());
					if(flowTypeList!=null && flowTypeList.size()>0)
					{
						for(FlowTypeEntity flowtypes : flowTypeList)
						{
							typeid = flowtypes.getUqflowtypeid();
							varfullcode2 = flowtypes.getVarfullcode().replaceFirst(oldvarfullcode, varfullcode);
							varfullname2 = flowtypes.getVarfullname().replaceFirst(oldvarfullname, varfullname);
							cashflowDao.updateTypeNameAndCode(typeid, varfullcode2, varfullname2);
						}
					}
				}
				//再去更新类别的信息
				cashflowDao.editType(flowtype);
			}
			else
			{
				throw new Exception("该现金流量类别的名称已存在");
			}
		}
		else
		{
			throw new Exception("该现金流量类别的编号已存在");
		}
	}

	/**
	 * 删除现金流量类别
	 * @param uqflowtypeid 现金流量分类ID
	 * @throws Exception
	 */
	public void removeType(String uqflowtypeid) throws Exception 
	{
		//判断类别下是否存在项目
		if(!cashflowDao.exitItemsByType(uqflowtypeid))
		{
			//需要 判断是否是末级 不是末级需要将子集也删除
			FlowTypeEntity flowtypeEntity= cashflowDao.getFlowTypeById(uqflowtypeid).get(0);
			
			if("0".equals(flowtypeEntity.getIntislastlevel()))
			{
				List<FlowTypeEntity> flowTypeList = cashflowDao.getFlowTypeList(flowtypeEntity.getVarfullcode(),flowtypeEntity.getVarfullname() , uqflowtypeid);
				
				for(int i = 0 ;i < flowTypeList.size();i++)
				{
					cashflowDao.removeType(flowTypeList.get(i).getUqflowtypeid());
				}
			}
			//判断上级是否还存在末级 没有则需要修改 是否末级的字段
			if(cashflowDao.exitTypes(cashflowDao.getFlowTypeById(uqflowtypeid).get(0).getUqparentid()))
			{
				//因为当删除后，父级没有子集 父级要更新末级的状态
				cashflowDao.updateTypeIntislastlevel(cashflowDao.getFlowTypeById(uqflowtypeid).get(0).getUqparentid(),"1");
			}
			cashflowDao.removeType(uqflowtypeid);
		}
		else
		{
			throw new Exception("该现金流量类别存在现金流量项目");
		}
		
	}

	/**
	 * 新增现金流量项目
	 * @param flowitems 现金流量项目实体
	 * @throws Exception
	 */
	public void addItems(FlowItemsEntity flowitems) throws Exception 
	{
		String uqflowtypeid = flowitems.getUqflowtypeid();
		String varname = flowitems.getVarname();
		String varcode = flowitems.getVarcode();
		//判断同一类别项目name是否唯一
		if(cashflowDao.exitItemsName(uqflowtypeid, varname,flowitems.getUqflowitemid()))
		{
			//判断项目code是否唯一
			if(cashflowDao.exitTtemsCode(varcode,flowitems.getUqflowitemid()))
			{
				cashflowDao.addItems(flowitems);
			}
			else
			{
				throw new Exception("该现金流量项目的编号已存在");
			}
		}
		else
		{
			throw new Exception("该现金流量项目名称已存在");
		}
	}

	/**
	 * 修改现金流量项目
	 * @param flowitems	 现金流量项目实体
	 * @throws Exception
	 */
	public void editItems(FlowItemsEntity flowitems) throws Exception 
	{
		String uqflowtypeid = flowitems.getUqflowtypeid();
		String varname = flowitems.getVarname();
		String varcode = flowitems.getVarcode();
		//判断同一类别项目name是否唯一
		if(cashflowDao.exitItemsName(uqflowtypeid, varname,flowitems.getUqflowitemid()))
		{
			//判断项目code是否唯一
			if(cashflowDao.exitTtemsCode(varcode,flowitems.getUqflowitemid()))
			{
				cashflowDao.editItems(flowitems);
			}
			else
			{
				throw new Exception("该现金流量项目的编号已存在");
			}
		}
		else
		{
			throw new Exception("该现金流量项目名称已存在");
		}
	}

	/**
	 * 删除现金流量项目
	 * @param uqflowitemid	现金流量项目ID
	 * @throws Exception
	 */
	public void removeItems(String[] idArrays) throws Exception 
	{
		//遍历项目id
		for(int i=0;i<idArrays.length;i++)
		{
			//判断项目是否被凭证使用
			if(!cashflowDao.exitVoucherUsing(idArrays[i]))
			{
				cashflowDao.removeItems(idArrays[i]);
			}
			else
			{
				throw new Exception("该现金流量项目被凭证使用");
			}
		}
	}

	/**
	 * 启用或停用现金流量项目
	 * @param uqflowitemid	现金流量项目ID
	 * @param intstatus		需要更新的状态（0，新增；1，启用；2，停用）
	 * @throws Exception
	 */
	public void startItems(String intstatus,String[] idArrays) throws Exception 
	{
		//遍历项目id
		for(int i=0;i<idArrays.length;i++)
		{
			cashflowDao.startItems(idArrays[i], intstatus);
		}
	}
	
	/**
	 * 导入现金流量信息
	 * @param cashflowFile 现金流量导入文件
	 * @param errormsg	错误信息
	 * @throws Exception
	 */
	public void importCashFlowFile(InputStream is, StringHolder errormsg) throws Exception 
	{
		//读取需要导入的文件
	//	InputStream is = new FileInputStream(cashflowFile);
		Workbook wk = Workbook.getWorkbook(is);
		//读取第一个 sheet 表
		Sheet st = wk.getSheet(0);
		//读取第二个 sheet表
		Sheet st2 = wk.getSheet(1);
		//获得 第一个sheet的行数
		int rowlength = st.getRows();
		//获得 第二个sheet的行数
		int rowlength2 = st2.getRows();
		//判断表格是否有数据 如果两个表格的行数都小于等于1则无数据
		if(rowlength<=1 && rowlength2<=1)
		{
			throw new Exception("表格中没有数据!");
		}
		else
		{
			//如果第一个sheet有数据
			if(rowlength > 1)
			{
				//检查表格1格式是否正确
				chackFile(st, 1);
				List<EntityMap> list = new ArrayList<EntityMap>();
				//第一行是列名 循环获得数据从1开始
				for(int row = 1;row<rowlength;row++)
				{
					//获得每行各列的值
					String vartypecode = ObjectUtils.toString(st.getCell(0, row).getContents().trim());
					String vartypename = ObjectUtils.toString(st.getCell(1, row).getContents().trim());
					String parentcode = ObjectUtils.toString(st.getCell(2, row).getContents().trim());
					//放入EntityMap中
					EntityMap entity = new EntityMap();
					entity.put("vartypecode", vartypecode);
					entity.put("vartypename", vartypename);
					entity.put("parentcode", parentcode);
					list.add(entity);
				}
				//检查数据关系(包括行的每个格子是否有值，且导入的整个sheet里面是否有存在相同类别编码的数据)
				chackTypeData(list, errormsg);
				//如果文件的数据都正确，则保存数据
				if ("".equals(errormsg.value))
				{
					//先清空模板表数据
					cashflowDao.removeAllCashFlowModel();
					for(int i=0;i<list.size();i++)
					{
						//将typeid , vartypecode, vartypename, parentcode这四项插入模板表
						cashflowDao.importToFlowTypeModel(list.get(i));
					}
					//检查同级别名称不能相同	如何判断级别呢？去查询数据库表同一个级别下的name是否相同
					
					//先判断 parentcode 在导入模板中是否存在 不存在的话，就看在数据库的类别表code是否存在 都不存在报错  存在多个也报错
					//也就是说既支持初始化式的导入方式，也支持在原有的数据基础上导入
					for(int i=0;i<list.size();i++)
					{
						//在导入表中的真实行数
						int j = i+2;
						String parentcode = list.get(i).getString("parentcode");
						String vartypename = list.get(i).getString("vartypename");
						String vartypecode = list.get(i).getString("vartypecode");
						boolean isParentCode = cashflowDao.getTypeModelCountByCode(parentcode);
						int typeModelCountByName = cashflowDao.getTypeModelCountByName(vartypename,parentcode);
						int countByCode = cashflowDao.getTypeCountByCode(parentcode);
						
						//根据自身code和父级code 本身code是否等于父级code 否则查询两张表中是否存在 不存在报错 存在的超过一个也报错 
						//如果类别的code!=parentcode 说明导入的不是一级类别
						if(!vartypecode.equals(parentcode))
						{
							//如果所属类别code在模板表中存在
							if(isParentCode)
							{
								//如果现有的类别表也存在
								if(countByCode>0)
								{
									errormsg.value += "表一中第"+ j + "条数据的所属父级类别编号既存在导入模板中也存在现有类别表中|";
								}
								else//在现有的类别表中不存在
								{
									//判断该所属类别下的name  在模板表中是否唯一
									if(typeModelCountByName>1)
									{
										errormsg.value += "表一中第"+ j + "条数据的在导入的数据所属类别下的名称不唯一|";
									}
								}
							}//导入模板表中 不存在该类别
							else
							{
								//如果现有的类别表 存在多个
								if(countByCode>1)
								{
									errormsg.value += "表一中第"+ j + "条数据的所属类别编号在现有的类别表中存在多个无法判断|";
								}//不存在
								else if(countByCode<=0)
								{
									errormsg.value += "表一中第"+ j + "条数据的所属类别编号在导入数据和现有类别表中都不存在|";
								}//存在一个
								else
								{
									//根据父级的code 得到该类别
									FlowTypeEntity flowTypeEntity = cashflowDao.getFlowTypeByCode(parentcode).get(0);
									if(!cashflowDao.exitTypeName(flowTypeEntity.getUqflowtypeid(), vartypename, null))
									{
										errormsg.value += "表一中第"+ j + "条数据的类别名称在现有类别表中的该级别下名称已经存在|";
									}
								}
							}
						}//是第一级别的
						else
						{
							//判断code 是否与现有表的第一级code是否相同  name 也不能相同
							boolean byName = cashflowDao.exitOneTypeCodeAndName( vartypename, null);
							boolean byCode =cashflowDao.exitOneTypeCodeAndName( null, vartypecode);
							if(!byName)
							{
								errormsg.value += "表一中第"+ j + "条数据的类别名称在第一级别中存在|";
							}
							
							if(!byCode)
							{
								errormsg.value += "表一中第"+ j + "条数据的类别编号在第一级别中存在|";
							}
						}
						
					}
					
					if ("".equals(errormsg.value))
					{
						//更新处理数据 准备插入类别表中
						updateTypeData();
						//将模板表中处理好的数据全部插入
						cashflowDao.importToFlowTypeInfo();
						
					}
				}
			}
			if(rowlength2>1)
			{
				importCashFlowItems(st2, errormsg);
			}
			//清空模板表数据
			cashflowDao.removeAllCashFlowModel();
		}
		
	}

	/**
	 * 导入 现金项目数据
	 * @param st	待导入数据
	 * @param errormsg 错误信息
	 * @throws Exception
	 */
	public void importCashFlowItems(Sheet st, StringHolder errormsg) throws Exception 
	{
		chackFile(st, 2);
		//获取表格数据的行数
		int rowlength = st.getRows();
		List<EntityMap> list = new ArrayList<EntityMap>();
		Map<String, Integer> map = new HashMap<String, Integer>();
		for (int row = 1; row < rowlength; row++)
		{
			int j = row + 1;
			EntityMap entity2 = new EntityMap();
			String varitemscode = ObjectUtils.toString(st.getCell(0, row).getContents().trim());
			String varitemsname = ObjectUtils.toString(st.getCell(1, row).getContents().trim());
			String vartypecode = ObjectUtils.toString(st.getCell(2, row).getContents().trim());
			//检验各项非空字段；
			boolean istrue = true;
			if (varitemscode==null || "".equals(varitemscode)) 
			{
				errormsg.value += "表二中第 "+ j + "行[现金流量项目编码]为空|";
				istrue = false;
			}
			if (varitemsname==null || "".equals(varitemsname)) 
			{
				errormsg.value += "表二中第 "+ j + "行[现金流量项目名称]为空|";
				istrue = false;
			}
			if (vartypecode==null || "".equals(vartypecode)) 
			{
				errormsg.value += "表二中第 "+ j + "行[所属类别编码]为空|";
				istrue = false;
			}
			//放入EntityMap中
			entity2.put("varitemscode", varitemscode);
			entity2.put("varitemsname", varitemsname);
			entity2.put("vartypecode", vartypecode);
			list.add(entity2);
			
			if(istrue)
			{
				//检验项目编号与原项目表中是否重复   
				if(!cashflowDao.exitTtemsCode(varitemscode, null))
				{	
					//重复了
					errormsg.value += "表二中第"+ j + "条数据的项目编号与现有的项目编号重复|";
				}
				else
				{
					//不重复 还要判断是否与导入的是否重复
					if (map.containsKey(varitemscode)) 
					{
						map.put(varitemscode, 1);
						errormsg.value += "表二中第"+ j + "条数据的项目编号与本次导入的数据存在重复|";
					}
					else 
					{
						map.put(varitemscode, 0);
					}
				}
			}
		}
		if("".equals(errormsg.value))
		{
			//清空 项目的模板表
			cashflowDao.removeAllFlowItemsModel();
			for(int i=0;i<list.size();i++)
			{
				cashflowDao.importToFlowItemsModel(list.get(i));
			}
			
			//验证 所属类别在两张表中是否存在 都存在报错  当模板表不存在 查看在原表中存在1个可以 存在多个报错
			for (int i = 0; i < list.size(); i++) 
			{
				int j = i+2;
				String vartypecode = list.get(i).getString("vartypecode");
				String varitemsname = list.get(i).getString("varitemsname");
				int countByCode = cashflowDao.getTypeCountByCode(vartypecode);
				//在现有的类别表也不存在
				if(countByCode<=0)
				{
					errormsg.value += "表二中第"+ j + "条数据的所属类别编号在模板表和现有类别表中都不存在|";
				}//在现有的类别表存在 多个
				else if(countByCode>1)
				{
					errormsg.value += "表二中第"+ j + "条数据的所属类别编号在现有类别表中存在多个|";
				}//在现有的类别表存在 一个
				else
				{
					//根据所属的类别code  获得所属类别的实体
					FlowTypeEntity flowTypeEntity = cashflowDao.getFlowTypeByCode(vartypecode).get(0);
					if(!cashflowDao.exitItemsName(flowTypeEntity.getUqflowtypeid(), varitemsname, null))
					{
						errormsg.value += "表二中第"+ j + "条数据项目名称在现有类别下已存在|";
					}
				}
			}
			if ("".equals(errormsg.value))
			{
				//处理 项目的 模板表 数据准备插入(根据类别的code找到类别的id)
				updateItemsData();
				
				cashflowDao.importToFlowItemsInfo();
				
				//清空模板表数据
				cashflowDao.removeAllFlowItemsModel();
			}
		}
	}
	
	/**
	 * 导出 现金流量类别及项目信息
	 * @return
	 * @throws Exception
	 */
	public List<Object[]> exportCashFlowInfo() throws Exception 
	{
		return cashflowDao.exportCashFlowInfo();
	}

	/**
	 * 导出 现金流量类别及项目信息
	 * @return
	 * @throws Exception
	 */
	/*
	public void exportInfo(HSSFWorkbook workBook) throws Exception 
	{
		List<EntityMap> list = this.cashflowDao.exportCashFlowInfo();
		String[][] fieldList = new String[][] 
				{
					{ "varitemscode", "string" },
					{ "varitemsname", "string" },
					{ "vartypecode", "string" },
					{ "vartypename", "string" },
					{ "intstatus", "string" } 
				};
		ExcelUtil.exportExcel(workBook, list, fieldList, 1, 50000);
	}*/
	
	/**
	 * 检查导入文件表格的格式是否正确
	 * @param st	表格
	 * @param flag 第几张表格的标志
	 * @throws Exception
	 */
	public void chackFile(Sheet st, int flag) throws Exception 
	{
		//如果是第一个表格
		if(flag==1)
		{
			//对比列名是否正确
			if ("现金流量类别编码".equals(st.getCell(0, 0).getContents()) 
					&& "现金流量类别名称".equals(st.getCell(1, 0).getContents())
					&& "上级类别编码".equals(st.getCell(2, 0).getContents()))
			{}
			else
			{
				throw new Exception("模板表格一格式不正确，请检查|");
			}
			
			
		}
		else
		{
			if("现金流量项目编码".equals(st.getCell(0, 0).getContents()) 
					&& "现金流量项目名称".equals(st.getCell(1, 0).getContents())
					&& "所属类别编码".equals(st.getCell(2, 0).getContents()))
			{}
			else
			{
				throw new Exception("模板表格二格式不正确，请检查|");
			}
		}
		
	}
	
	/**
	 * 检查类别数据
	 * @param list 检验数据
	 * @param errormsgd 错误信息
	 * @throws Exception
	 */
	public void chackTypeData(List<EntityMap> list, StringHolder errormsg) throws Exception 
	{
		
		Map<String, Integer> map = new HashMap<String, Integer>();
		for(int i = 0;i<list.size();i++ )
		{
			//表中真实行数
			int j = i+2;
			EntityMap entity = list.get(i);
			String vartypecode = entity.getString("vartypecode");
			String vartypename = entity.getString("vartypename");
			String parentcode = entity.getString("parentcode");
			
			//检查非空的字段
			boolean istrue = true;
			if(vartypecode==null||"".equals(vartypecode))
			{
				errormsg.value += "表一中第 "+ j + " 行[现金流量类别编码]为空|";
				istrue = false;
			}
			if(!cashflowDao.exitTypeCode(vartypecode, null))
			{
				errormsg.value += "表一中第 "+ j + " 行[现金流量类别编码]已经存在|";
				istrue = false;
			}
			if(vartypename==null||"".equals(vartypename))
			{
				errormsg.value += "表一中第 "+ j + " 行[现金流量类别名称]为空|";
				istrue = false;
			}
			if(parentcode==null||"".equals(parentcode))
			{
				errormsg.value += "表一中第 "+ j + " 行[上级类别编码]为空|";
				istrue = false;
			}
			if(istrue)
			{
				//判断code是否重复
				if (map.containsKey(vartypecode)) 
				{
					//检验现金流量类别编码重复记录
					map.put(vartypecode, 1);
					errormsg.value += "表一中第"+ j + "行数据的现金流量类别编码存在重复|";
				}
				else 
				{
					map.put(vartypecode, 0);
				}
			}
			
		}
		
	}
	
	/**
	 * 更新 模板标的数据  主要是第一级别的 和挂在已存在的类别下的
	 * @throws Exception
	 */
	public void updateTypeData() throws Exception
	{
		//操作第一级别的数据
		//从类别模板表中,查询出的第一级别的类别
		List<FlowTypeModelEntiy> listl = cashflowDao.getOneTypeModel();
		//遍历模板表第一级别类别表的list 若没有直接跳过
		for(int i = 0;i<listl.size();i++)
		{
			//根据模板表的数据 创建第一级别类别的实体
			FlowTypeModelEntiy type1 = listl.get(i);
			int intlevel = 1;
			type1.setVarfullcode(type1.getVartypecode());	
			type1.setVarfullname(type1.getVartypename());
			type1.setIntlevel(intlevel+"");
			//第一级别的父级ID是他本身
			type1.setUqparentid(type1.getTypeid());
			
			//根据第一级别的code作为父级code,查询子集信息
			List<FlowTypeModelEntiy> list2 = cashflowDao.getTypeModel(type1.getVartypecode());
			//判断是否存在子集
			if(list2!=null && list2.size()!=0)
			{
				//存在子集
				//上级的就不是末级 是否末级的字段设置为0
				type1.setIntislastlevel("0");
				//调用递归 方法逐渐查询子集的信息
				updataforData(list2,type1);
				list2.clear();
			}
			else
			{
				//不存在子集		是否末级的字段设置为1
				type1.setIntislastlevel("1");
			}
			//更新第一级别的数据
			cashflowDao.updateTypeModel(type1);
		}
		
		//操作 挂在已存在的数据下 
		//查询出所有的挂在已存在类别表的 类别数据
		List<FlowTypeModelEntiy> list3 = cashflowDao.getTypeModel();
		//遍历集合
		for(int i = 0;i<list3.size();i++)
		{
			FlowTypeModelEntiy type2 = list3.get(i);
			//根据parentcode 查询出原类别表中的类别实体
			FlowTypeEntity flowTypeEntity = cashflowDao.getFlowTypeByCode(type2.getParentcode()).get(0);
			//set类别实体的属性
			type2.setVarfullcode(flowTypeEntity.getVarfullcode()+"."+type2.getVartypecode());
			type2.setVarfullname(flowTypeEntity.getVarfullname()+"."+type2.getVartypename());
			type2.setIntlevel((Integer.parseInt(flowTypeEntity.getIntlevel())+1)+"");
			type2.setUqparentid(flowTypeEntity.getUqflowtypeid());
			//挂在已有的类别下需要改变是否末级的状态
			cashflowDao.updateTypeIntislastlevel(flowTypeEntity.getUqflowtypeid(), "0");
			//查询子集
			List<FlowTypeModelEntiy> list4 = cashflowDao.getTypeModel(type2.getVartypecode());
			if(list4!=null && list4.size()!=0)
			{
				type2.setIntislastlevel("0");
				updataforData(list4, type2);
				list4.clear();
			}
			else
			{
				type2.setIntislastlevel("1");
			}
			cashflowDao.updateTypeModel(type2);
		}
		
	}
	
	/**
	 * 循环递归的 调用查询遍历子集
	 * @param list2
	 * @param type1
	 * @throws Exception
	 */
	public void updataforData(List<FlowTypeModelEntiy> list2 ,FlowTypeModelEntiy type1) throws Exception
	{
		//遍历子集的集合
		for (int i = 0; i < list2.size(); i++) 
		{
			FlowTypeModelEntiy type = list2.get(i);
			//设置下一个级别的子集实体
			type.setVarfullcode(type1.getVarfullcode()+"."+type.getVartypecode());
			type.setVarfullname(type1.getVarfullname()+"."+type.getVartypename());
			type.setIntlevel((Integer.parseInt(type1.getIntlevel())+1)+"");
			type.setUqparentid(type1.getTypeid());
			
			//查询该类别下是否还存在子集
			List<FlowTypeModelEntiy> list3 = cashflowDao.getTypeModel(type.getVartypecode());
			if(list3!=null && list3.size()!=0)
			{
				type.setIntislastlevel("0");
				updataforData(list3,type);
				list3.clear();
			}
			else
			{
				type.setIntislastlevel("1");
			}
			cashflowDao.updateTypeModel(type);
		}
	}
	
	/**
	 * 处理 项目的模板数据
	 * @throws Exception
	 */
	public void updateItemsData() throws Exception
	{
		//项目中 需要处理点数据	如果在导入模板表中  如果在现有的模板表中
		List<FlowItemsModelEntiy> list = cashflowDao.getItemsModel();
		for(int i = 0;i<list.size();i++)
		{
			FlowItemsModelEntiy items = list.get(i);
			String vartypecode = items.getVartypecode();
			List<FlowTypeEntity> flowTypeByCode = cashflowDao.getFlowTypeByCode(vartypecode);
			
			if(flowTypeByCode!=null && flowTypeByCode.size()!=0)
			{
				//获得类别的ID
				items.setUqflowtypeid(flowTypeByCode.get(0).getUqflowtypeid());
				cashflowDao.updateItemsModel(items);
			}
		}
	}

	/**
	 * 通过类别编号获取 类别ID
	 * @throws Exception
	 */
	public String getflowtypeid(String uqvarcode) throws Exception
	{
		return cashflowDao.getflowtypeid(uqvarcode);
	}
}
