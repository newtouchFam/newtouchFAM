package com.newtouch.nwfs.gl.offsetmanager.action;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.StringUtil;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.offsetmanager.bp.CurrentoffsetBp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * 往来冲销
 * Created by zhaodongchao on 2017/10/12.
 */
@Controller
@Scope("prototype")
@RequestMapping("/offsetmanager/currentoffset")
public class CurrentoffsetAction {

    @Autowired
    private CurrentoffsetBp currentoffsetBp;

    @RequestMapping("/offset")
    @ResponseBody
    public Object getOffsetData(@RequestParam String jsonParams,@RequestParam Integer start, @RequestParam Integer limit)
    {
        Map<String,Object> result = new EntityMap();

        ConditionMap cdtMap = null;
        if (! StringUtil.isNullString(jsonParams))
        {
            cdtMap = new ConditionMap(jsonParams);
        }
        else
        {
            cdtMap = new ConditionMap();
        }

        try {
            PageData<EntityMap> datas = currentoffsetBp.getOffsetDataPage(cdtMap,start,limit);
            return ActionResultUtil.toPageData(datas);
        } catch (Exception e) {
            return ActionResultUtil.toFailure(e.getMessage());
        }
    }
    @RequestMapping("/onaccount")
    @ResponseBody
    public Object getOnAccountData(@RequestParam String jsonParams,@RequestParam Integer start, @RequestParam Integer limit)
    {
        Map<String,Object> result = new EntityMap();
        ConditionMap cdtMap ;
        if (! StringUtil.isNullString(jsonParams))
        {
            cdtMap = new ConditionMap(jsonParams);
        }
        else
        {
            cdtMap = new ConditionMap();
        }

        try {
            PageData<EntityMap> datas = currentoffsetBp.getOnaccountDataPage(cdtMap,start,limit);
            return ActionResultUtil.toPageData(datas);
        } catch (Exception e) {
            return ActionResultUtil.toFailure(e.getMessage());
        }
    }
    @RequestMapping("/doOffset")
    @ResponseBody
    public Object doOffset(@RequestParam String offsetDatas,@RequestParam String onaccountDatas){
        Map<String,Object> result = new EntityMap();
        try {
            this.currentoffsetBp.doOffset(offsetDatas,onaccountDatas);
            result.put("success",true);
        } catch (Exception e) {
            result.put("success",false);
            result.put("msg",e.getMessage());
        }
        return result ;
    }
    @RequestMapping("/doManualRush")
    @ResponseBody
    public Object doManualRush(@RequestParam String mainData,@RequestParam String detailDatas){
        Map<String,Object> result = new EntityMap();
        try {
            this.currentoffsetBp.doManualRush(mainData,detailDatas);
            result.put("success",true);
        } catch (Exception e) {
            result.put("success",false);
            result.put("msg",e.getMessage());
        }
        return result ;
    }
    @RequestMapping("/revertRush")
    @ResponseBody
    public Object revertRush(@RequestParam String revertRecords){
        Map<String,Object> result = new EntityMap();
        try {
            this.currentoffsetBp.revertRush(revertRecords);
            result.put("success",true);
        } catch (Exception e) {
            result.put("success",false);
            result.put("msg",e.getMessage());
        }
        return result ;
    }
}
