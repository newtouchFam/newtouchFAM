package com.newtouch.nwfs.gl.vouchermanager.action;

import java.util.List;
import java.util.Map;

import javax.xml.rpc.holders.StringHolder;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ibm.icu.util.Currency;
import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.ComplexPattern;
import com.newtouch.cloud.common.JSONUtils;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.offsetmanager.bp.CurrentoffsetBp;
import com.newtouch.nwfs.gl.vouchermanager.bp.VoucherMainBP;
import com.newtouch.nwfs.gl.vouchermanager.entity.InitVoucherCashEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.InitVoucherCheckEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.InitVoucherEndEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.InitVoucherQueryEntity;
import com.newtouch.nwfs.gl.vouchermanager.entity.VoucherMain;

@Controller
@Scope("prototype")
@RequestMapping("/vouchermanager/vouchermain")
public class VoucherMainAction 
{
	@Autowired
	private VoucherMainBP voucherMainBP;
	
	@Autowired
	private CurrentoffsetBp currentoffsetBP;
	/**
	 * 获取凭证主信息
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping("/maininfo")
	@ResponseBody
	public Object getVoucherMainInfo(@RequestParam String vouchertag, @RequestParam(required=false) String voucherid) throws Exception
	{
			
		if("0".equals(vouchertag))
		{
			JSONArray array = new JSONArray();
			VoucherMain main = this.voucherMainBP.getVoucherMain("", "0");
			ComplexPattern pattern = new ComplexPattern();
            pattern.add("*");
            JSONObject json = JSONUtils.JasonFromComplexData(main, pattern);
            JSONObject complex = new JSONObject();
			complex.put("column0", main.getUqglobalperiodid());
            complex.put("column1", main.getIntyearmonth());
            complex.put("column2", main.getDtbegin());
            complex.put("column3", main.getPeriodname());
            json.put("uqglobalperiodid", "\"" + complex.toString() + "\"");
            
            String accountmanager = this.voucherMainBP.getAccountManager(main.getDtfiller());
            json.put("accountmanager", accountmanager);
            array.add(json);
            ActionResult actionResult = new ActionResult();
            actionResult.setData(array);
            return actionResult;
		}
		else
		{
			JSONArray array = new JSONArray();
			VoucherMain main = this.voucherMainBP.getVoucherMain(voucherid, "1");
			ComplexPattern pattern = new ComplexPattern();
            pattern.add("*");
            JSONObject json = JSONUtils.JasonFromComplexData(main, pattern);
            JSONObject complex = new JSONObject();
			complex.put("column0", main.getUqglobalperiodid());
            complex.put("column1", main.getIntyearmonth());
            complex.put("column2", main.getDtbegin());
            complex.put("column3", main.getPeriodname());
            json.put("uqglobalperiodid", "\"" + complex.toString() + "\"");
            
            String accountmanager = this.voucherMainBP.getAccountManager(main.getDtfiller());
            json.put("accountmanager", accountmanager);
            
            complex = new JSONObject();
			complex.put("column0", main.getUqnumbering());
            complex.put("column1", main.getUqnumberingname());
            json.put("uqnumbering", "\"" + complex.toString() + "\"");
            array.add(json);
            ActionResult actionResult = new ActionResult();
            actionResult.setData(array);
            return actionResult;
		}
	}
	
	@RequestMapping("/initcash")
	@ResponseBody
	public Object getInitvoucherCash() throws Exception
	{
		JSONArray array = new JSONArray();
		InitVoucherCashEntity init = this.voucherMainBP.getInitVoucherCash();
		
		ComplexPattern pattern = new ComplexPattern();
        pattern.add("*");
        JSONObject json = JSONUtils.JasonFromComplexData(init, pattern);
        JSONObject complex = new JSONObject();
		complex.put("column0", init.getUqglobalperiodid());
        complex.put("column1", init.getIntyearmonth());
        complex.put("column2", init.getDtbegin());
        complex.put("column3", init.getPeriodname());
        json.put("periodid", "\"" + complex.toString() + "\"");
        
        complex = new JSONObject();
		complex.put("column0", "00000000-0000-0000-0000-000000000000");
        complex.put("column1", "全部");
        json.put("numberid", "\"" + complex.toString() + "\"");
        
        complex = new JSONObject();
		complex.put("column0", "1002");
        complex.put("column1", "待出纳");
        json.put("intstatus", "\"" + complex.toString() + "\"");
        
        array.add(json);
        ActionResult actionResult = new ActionResult();
        actionResult.setData(array);
        return actionResult;
	}
	
	@RequestMapping("/initquery")
	@ResponseBody
	public Object getInitVoucherQuery() throws Exception
	{
		JSONArray array = new JSONArray();
		InitVoucherQueryEntity init = this.voucherMainBP.getInitVoucherQuery();
		ComplexPattern pattern = new ComplexPattern();
        pattern.add("*");
        JSONObject json = JSONUtils.JasonFromComplexData(init, pattern);
        JSONObject complex = new JSONObject();
		complex.put("column0", init.getFromperiodid());
        complex.put("column1", init.getFromintyearmonth());
        complex.put("column2", init.getFromdtbegin());
        complex.put("column3", init.getFromperiodname());
        json.put("fromperiodid", "\"" + complex.toString() + "\"");
        
        complex = new JSONObject();
		complex.put("column0", init.getToperiodid());
        complex.put("column1", init.getTointyearmonth());
        complex.put("column2", init.getTodtbegin());
        complex.put("column3", init.getToperiodname());
        json.put("toperiodid", "\"" + complex.toString() + "\"");
        
        complex = new JSONObject();
		complex.put("column0", "00000000-0000-0000-0000-000000000000");
        complex.put("column1", "全部");
        json.put("numberid", "\"" + complex.toString() + "\"");
        
        complex = new JSONObject();
		complex.put("column0", "1000");
        complex.put("column1", "全部");
        json.put("intstatus", "\"" + complex.toString() + "\"");
        
        array.add(json);
        ActionResult actionResult = new ActionResult();
        actionResult.setData(array);
        return actionResult;
	}
	
	@RequestMapping("/initcheck")
	@ResponseBody
	public Object getInitVoucherCheck() throws Exception
	{
		JSONArray array = new JSONArray();
		InitVoucherCheckEntity init = this.voucherMainBP.getInitVoucherCheck();
		
		ComplexPattern pattern = new ComplexPattern();
        pattern.add("*");
        JSONObject json = JSONUtils.JasonFromComplexData(init, pattern);
        JSONObject complex = new JSONObject();
		complex.put("column0", init.getUqglobalperiodid());
        complex.put("column1", init.getIntyearmonth());
        complex.put("column2", init.getDtbegin());
        complex.put("column3", init.getPeriodname());
        json.put("periodid", "\"" + complex.toString() + "\"");
        
        complex = new JSONObject();
		complex.put("column0", "00000000-0000-0000-0000-000000000000");
        complex.put("column1", "全部");
        json.put("numberid", "\"" + complex.toString() + "\"");
        
        complex = new JSONObject();
		complex.put("column0", "1001");
        complex.put("column1", "待审核");
        json.put("intstatus", "\"" + complex.toString() + "\"");
        
        array.add(json);
        ActionResult actionResult = new ActionResult();
        actionResult.setData(array);
        return actionResult;
	}
	
	@RequestMapping("/initend")
	@ResponseBody
	public Object getInitvoucherEnd() throws Exception
	{
		JSONArray array = new JSONArray();
		InitVoucherEndEntity init = this.voucherMainBP.getInitVoucherEnd();
		
		ComplexPattern pattern = new ComplexPattern();
        pattern.add("*");
        JSONObject json = JSONUtils.JasonFromComplexData(init, pattern);
        JSONObject complex = new JSONObject();
		complex.put("column0", init.getUqglobalperiodid());
        complex.put("column1", init.getIntyearmonth());
        complex.put("column2", init.getDtbegin());
        complex.put("column3", init.getPeriodname());
        json.put("periodid", "\"" + complex.toString() + "\"");
        
        complex = new JSONObject();
		complex.put("column0", "00000000-0000-0000-0000-000000000000");
        complex.put("column1", "全部");
        json.put("numberid", "\"" + complex.toString() + "\"");
        
        complex = new JSONObject();
		complex.put("column0", "1003");
        complex.put("column1", "待记账");
        json.put("intstatus", "\"" + complex.toString() + "\"");
        
        array.add(json);
        ActionResult actionResult = new ActionResult();
        actionResult.setData(array);
        return actionResult;
	}
	
	@RequestMapping("/makeinfo")
	@ResponseBody
	public Object getVoucherMakeInfo(@RequestParam Integer start, @RequestParam Integer limit)
	{
		try
		{
			PageData<EntityMap> page = this.voucherMainBP.getVoucherMakeInfo(start, limit);

			return ActionResultUtil.toPageData(page);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}

	@RequestMapping("/queryinfo")
	@ResponseBody
	public Object getVoucherQueryInfo(
			@RequestParam String jsonCondition, 
			@RequestParam Integer start, 
			@RequestParam Integer limit)
	{
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			PageData<EntityMap> page = this.voucherMainBP.getVoucherQueryInfo(cdtMap, start, limit);
			return ActionResultUtil.toPageData(page);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 凭证审核界面查询
	 */
	@RequestMapping("/checkinfo")
	@ResponseBody
	public Object getVoucherCheckInfo(
			@RequestParam String jsonCondition, 
			@RequestParam Integer start, 
			@RequestParam Integer limit)
	{
		try 
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			PageData<EntityMap> page = this.voucherMainBP.getVoucherCheckInfo(cdtMap, start, limit);
			return ActionResultUtil.toPageData(page);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 凭证出纳界面查询
	 */
	@RequestMapping("/cashinfo")
	@ResponseBody
	public Object getVoucherCashInfo(
			@RequestParam String jsonCondition, 
			@RequestParam Integer start, 
			@RequestParam Integer limit)
	{
		try 
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			PageData<EntityMap> page = this.voucherMainBP.getVoucherCashInfo(cdtMap, start, limit);
			return ActionResultUtil.toPageData(page);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 凭证记账界面查询
	 */
	@RequestMapping("/endinfo")
	@ResponseBody
	public Object getVoucherEndInfo(
			@RequestParam String jsonCondition, 
			@RequestParam Integer start, 
			@RequestParam Integer limit)
	{
		try 
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			PageData<EntityMap> page = this.voucherMainBP.getVoucherEndInfo(cdtMap, start, limit);
			return ActionResultUtil.toPageData(page);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 凭证保存
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public Object voucherSave(@RequestParam String jsonmain, @RequestParam String jsondetail)
	{
		try 
		{
			this.voucherMainBP.vouchersave(jsonmain, jsondetail);
			return ActionResultUtil.toSuccess();
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure( e.getMessage());
		}
	}
	
	/**
	 * 凭证修改
	 * @return
	 */
	@RequestMapping("/edit")
	@ResponseBody
	public Object unVoucherEdit(@RequestParam String jsonmain, @RequestParam String jsondetail)
	{
		try 
		{
            StringHolder errMsg = new StringHolder();
			
			errMsg.value = "";
			this.voucherMainBP.unVoucherEdit(jsonmain, jsondetail, errMsg);
			if(errMsg.value == "")
			{
				return ActionResultUtil.toSuccess();
			}
			else
			{
				return ActionResultUtil.toFailure(errMsg.value);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 凭证删除
	 * @return
	 */
	@RequestMapping("/unsave")
	@ResponseBody
	public Object unVoucherSave(@RequestParam String jsonVoucherid)
	{
		try 
		{
			JSONArray arrayvoucherid = JSONArray.fromObject(jsonVoucherid);
			
			StringHolder errMsg = new StringHolder();
			
			errMsg.value = "";
			
			for(int i = 0; i < arrayvoucherid.size(); i++)
			{
				JSONObject vouobj = arrayvoucherid.getJSONObject(i);
				
				String voucherid = vouobj.getString("uqvoucherid");
				this.voucherMainBP.unvouchersave(voucherid, errMsg);
			}
			if(errMsg.value == "")
			{
				return ActionResultUtil.toSuccess();
			}
			else
			{
				return ActionResultUtil.toFailure(errMsg.value);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 凭证审核
	 * @return
	 */
	@RequestMapping("/check")
	@ResponseBody
	public Object voucherCheck(
			@RequestParam String vouchercheckdate,
			@RequestParam String jsonVoucherid)
	{
		try 
		{
			JSONArray arrayvoucherid = JSONArray.fromObject(jsonVoucherid);
			
			StringHolder errMsg = new StringHolder();
			
			errMsg.value = "";
			
			for(int i = 0; i < arrayvoucherid.size(); i++)
			{
				JSONObject vouobj = arrayvoucherid.getJSONObject(i);
				
				String voucherid = vouobj.getString("uqvoucherid");
				this.voucherMainBP.vouchercheck(voucherid, vouchercheckdate, errMsg);
			}
			if(errMsg.value == "")
			{
				return ActionResultUtil.toSuccess();
			}
			else
			{
				return ActionResultUtil.toFailure(errMsg.value);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 凭证出纳
	 * @return
	 */
	@RequestMapping("/cash")
	@ResponseBody
	public Object voucherCash(
			@RequestParam String vouchercashdate,
			@RequestParam String jsonVoucherid)
	{
		try 
		{
			JSONArray arrayvoucherid = JSONArray.fromObject(jsonVoucherid);
			
			StringHolder errMsg = new StringHolder();
			
			errMsg.value = "";
			
			for(int i = 0; i < arrayvoucherid.size(); i++)
			{
				JSONObject vouobj = arrayvoucherid.getJSONObject(i);
				
				String voucherid = vouobj.getString("uqvoucherid");
				
				this.voucherMainBP.vouchercash(voucherid, vouchercashdate, errMsg);
			}
			
			if(errMsg.value == "")
			{
				return ActionResultUtil.toSuccess();
			}
			else
			{
				return ActionResultUtil.toFailure(errMsg.value);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 凭证记账
	 * @return
	 */
	@RequestMapping("/end")
	@ResponseBody
	public Object voucherEnd(
			@RequestParam String voucherenddate,
			@RequestParam String jsonVoucherid)
	{
		try 
		{
			JSONArray arrayvoucherid = JSONArray.fromObject(jsonVoucherid);
			
			StringHolder errMsg = new StringHolder();
			
			errMsg.value = "";
			
			for(int i = 0; i < arrayvoucherid.size(); i++)
			{
				
				JSONObject vouobj = arrayvoucherid.getJSONObject(i);
				
				String voucherid = vouobj.getString("uqvoucherid");
				
				//新增 2017-12-12
				//Created by wuzehua on 2017/10/12.
				//获取凭证记账前核销所存的临时表中的内容
				List<EntityMap> list = this.voucherMainBP.getTempData(voucherid);
				if(list != null && list.size() != 0)
				{
					for(int j=0; j < list.size(); j++)
					{
						String mainData = list.get(j).getString("main_data");
						//将tgl_ac_offset_detail修改过的的mainData数据改回来,原封不动的传给前台
						//mainData = mainData.replaceAll("\"yetmoney\":0", "\"yetmoney\":null");
						
						String detailDatas = list.get(j).getString("detail_datas");
						//detailDatas = detailDatas.replaceAll("\"yetmoney\":0", "\"yetmoney\":null");
						this.currentoffsetBP.doManualRush(mainData, detailDatas);
						this.voucherMainBP.deleteTempData(voucherid);
					}
				}
				
				this.voucherMainBP.voucherend(voucherid, voucherenddate, errMsg);
				
				
				
			}
			
			if(errMsg.value == "")
			{
				return ActionResultUtil.toSuccess();
			}
			else
			{
				return ActionResultUtil.toFailure(errMsg.value);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}

	/**
	 * 凭证反审核
	 * @return
	 */
	@RequestMapping("/uncheck")
	@ResponseBody
	public Object unVoucherCheck(
			@RequestParam String intstatus,
			@RequestParam String jsonVoucherid)
	{
		try 
		{
			JSONArray arrayvoucherid = JSONArray.fromObject(jsonVoucherid);
			
			StringHolder errMsg = new StringHolder();
			
			errMsg.value = "";
			
			for(int i = 0; i < arrayvoucherid.size(); i++)
			{
				JSONObject vouobj = arrayvoucherid.getJSONObject(i);
				
				String voucherid = vouobj.getString("uqvoucherid");
				this.voucherMainBP.unvouchercheck(voucherid, errMsg);
			}
			if(errMsg.value == "")
			{
				return ActionResultUtil.toSuccess();
			}
			else
			{
				return ActionResultUtil.toFailure(errMsg.value);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}
	
	/**
	 * 凭证反出纳
	 * @return
	 */
	@RequestMapping("/uncash")
	@ResponseBody
	public Object unVoucherCash(
			@RequestParam String intstatus,
			@RequestParam String jsonVoucherid)
	{
		try 
		{
			JSONArray arrayvoucherid = JSONArray.fromObject(jsonVoucherid);
			
			StringHolder errMsg = new StringHolder();
			
			errMsg.value = "";
			
			for(int i = 0; i < arrayvoucherid.size(); i++)
			{
				JSONObject vouobj = arrayvoucherid.getJSONObject(i);
				
				String voucherid = vouobj.getString("uqvoucherid");
				
				this.voucherMainBP.unvouchercash(voucherid, errMsg);
			}
			
			if(errMsg.value == "")
			{
				return ActionResultUtil.toSuccess();
			}
			else
			{
				return ActionResultUtil.toFailure(errMsg.value);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			return ActionResultUtil.toFailure(e.getMessage());
		}
	}

//	/**
//	 * 获取会计期
//	 * @return
//	 */
//	public String getCurrentPeriodInfo()
//	{
//		try
//		{
//			ConditionMap cdtMap = new ConditionMap(this.getJsonCondition());
//			Object[] period = this.mainbp.getCurrentPeriodInfo(cdtMap);
//			JSONObject periodobj = new JSONObject();
//			if (period!=null)
//			{
//				periodobj.put("uqglobalperiodid", period[0] == ""? "" : period[0].toString());
//				periodobj.put("varname", period[1] == ""? "" : period[1].toString());
//				periodobj.put("intyearmonth", period[2] == ""? "" : period[2].toString());
//				periodobj.put("dtbegin", period[3] == ""? "" : period[3].toString());
//				periodobj.put("dtend", period[4] == ""? "" : period[4].toString());
//			}
//			JSONObject rtn = new JSONObject();
//			rtn.put(SUCCESS_KEY, true);
//			rtn.put("period", periodobj);
//			this.setJsonString(rtn.toString());
//		}
//		catch (Exception e) 
//    	{
//			JSONObject rtn = new JSONObject();
//			rtn.put(SUCCESS_KEY, false);
//			rtn.put(MESSAGE_KEY, e.getMessage());
//			this.setJsonString(rtn.toString());
//		}
//		return SUCCESS;
//		
//	}
}
