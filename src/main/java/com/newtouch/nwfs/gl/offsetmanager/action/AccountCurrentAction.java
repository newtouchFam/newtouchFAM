package com.newtouch.nwfs.gl.offsetmanager.action;

import com.newtouch.cloud.common.ActionResultUtil;
import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.nwfs.gl.datamanger.util.ExportRateExcel;
import com.newtouch.nwfs.gl.offsetmanager.bp.AccountCurrentBp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.rpc.holders.StringHolder;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.util.List;

/**
 * 往来初始化action
 * @author Administrator
 *
 */
@Controller
@Scope("prototype")
@RequestMapping("/offsetmanager/accountcurrent")
public class AccountCurrentAction {
    //定义变量
    @Autowired
    private AccountCurrentBp accountCurrentBp;


    /**
     * 根据‘科目代码’或 ‘科目名称’ :显示所有末级科目（上级科目不显示） '0':显示所有
     * 显示数据
     * @return
     */
    @RequestMapping("/accountlist")
    @ResponseBody
    public ActionResult getInitAccountData(HttpSession httpSession,
                                       @RequestParam(required=false) String varAccountCode,
                                       @RequestParam(required=false) String varAccountName,
                                       @RequestParam int start,
                                       @RequestParam int limit)
    {
        try
        {
            PageData<EntityMap> page = null;
            page = accountCurrentBp.getInitAccountBp(varAccountCode,varAccountName,start,limit);
            return ActionResultUtil.toPageData(page);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ActionResultUtil.toFailure(e.getMessage());
        }
    }
    /**
     * 根据‘科目代码’或 ‘科目编号’ 分页显示初始化明细数据
     * 显示数据
     * @return
     */
    @RequestMapping("/editlist")
    @ResponseBody
    public ActionResult getInitDetailData(HttpSession httpSession,
                                          @RequestParam(required=false) String uqaccountid,
                                          @RequestParam int start,
                                          @RequestParam int limit)
    {
        try
        {
            PageData<EntityMap> page = null;
            page = accountCurrentBp.getInitDetailData(uqaccountid,start,limit);

            return ActionResultUtil.toPageData(page);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ActionResultUtil.toFailure(e.getMessage());
        }
    }
    /**
     * jsonStringAdd 为需要新增的数据，jsonStringUpdate为需要更新的数据，jsonStringDelete为需要删除的数据
     * 显示数据
     * @return
     */
    @RequestMapping("/savedata")
    @ResponseBody
    public ActionResult saveDataIni(HttpSession httpSession,
                                     @RequestParam(required=false) String jsonStringAdd,
                                    @RequestParam(required=false) String jsonStringUpdate,
                                    @RequestParam(required=false) String jsonStringDelete)
    {
        try
        {
            String rel=this.accountCurrentBp.saveDataIni(jsonStringAdd,jsonStringUpdate,jsonStringDelete);

            ActionResult result = new ActionResult();
            result.setSuccess(true);
            result.setMsg(rel);
            return result;
        }
        catch (Exception e)
        {
            ActionResult result = new ActionResult();
            result.setSuccess(false);
            result.setMsg(e.getMessage());
            return result;
        }
    }
    /**
     * 查询该科目是否设有分户
     * @author Administrator
     *
     */
    @RequestMapping("/checkDateIsExistFh")
    @ResponseBody
    public ActionResult checkDateIsExistFh(HttpSession httpSession,
                                     @RequestParam(required=false) String uqaccountid ){
        try
        {
            String rel=this.accountCurrentBp.checkDateIsExistFh(uqaccountid);

            ActionResult result = new ActionResult();
            result.setSuccess(true);
            result.setMsg(rel);
            return result;
        }
        catch (Exception e)
        {
            ActionResult result = new ActionResult();
            result.setSuccess(false);
            result.setMsg(e.getMessage());
            return result;
        }

    }

    /**
     * 清除该uqaccountid科目id下的所有明细数据
     * 显示数据
     * @return
     */
    @RequestMapping("/deletedata")
    @ResponseBody
    public ActionResult clearDetailData(HttpSession httpSession,
                                    @RequestParam(required=false) String uqaccountid)
    {
        try
        {
           String rel= this.accountCurrentBp.clearDetailData( uqaccountid );

            ActionResult result = new ActionResult();
            result.setSuccess(true);
            result.setMsg(rel);
            return result;
        }
        catch (Exception e)
        {
            ActionResult result = new ActionResult();
            result.setSuccess(false);
            result.setMsg(e.getMessage());
            return result;
        }
    }
    /**
     * 导入科目信息
     * @return
     */
    @RequestMapping("/upload")
    @ResponseBody
    public String uploadAccountFile(HttpServletRequest request, HttpServletResponse response ,
                                    @RequestParam CommonsMultipartFile uploadFile)
    {
        try
        {
            StringHolder errormsg = new StringHolder();
            errormsg.value = "";
            this.accountCurrentBp.uploadIniFile(uploadFile.getInputStream(), errormsg);
            if(errormsg.value == "")
            {

                return ActionResultUtil.toSuccess("导入成功").toJsonString();
            }
            else
            {
                return ActionResultUtil.toFailure(errormsg.value).toJsonString();
            }

        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ActionResultUtil.toException(e).toJsonString();
        }
    }

    /**
     * 导出科目信息
     */
    @RequestMapping("/export")
    @ResponseBody
    public void exportAccountInfo(HttpServletResponse response,
                                  HttpSession httpSession,
                                  @RequestParam(required=false) String varAccountCode,
                                  @RequestParam(required=false) String varAccountName)
    {
        ExportRateExcel exportRateExcel = new ExportRateExcel();
        try
        {
            List<Object[]> list = this.accountCurrentBp.exportInitInfo(varAccountCode,  varAccountName);
            String firstSheetName = "往来初始化导出";
            String[] excelFirstTitle = {"初始化类型","业务日期","初始化日期","摘要","科目编号","科目名称","分户项目编号","分户项目名称","借方金额","贷方金额"};
            exportRateExcel.expToExcel(response, list, firstSheetName, excelFirstTitle);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    /**
     * 导入模板下载
     * @return
     */
    @RequestMapping("/downloadImportModel")
    @ResponseBody
    public void downloadAccountImportModel(HttpServletRequest request, HttpServletResponse response)
    {
        try
        {
            request.setCharacterEncoding("UTF-8");
            BufferedInputStream bis = null;
            BufferedOutputStream bos = null;

            //获取项目根目录
            String ctxPath = request.getSession().getServletContext().getRealPath("");

            //获取下载文件露肩
            String downLoadPath = ctxPath+"/wfs/gl/offsetmanager/accountCurrentInitialization/accountCurrentInitializationImportModel.xls";

            //获取文件的长度
            long fileLength = new File(downLoadPath).length();

            //设置文件输出类型
            response.setContentType("application/octet-stream");
            String importModelFile = URLEncoder.encode("accountCurrentInitializationImportModel.xls", "UTF-8");
            response.setHeader("Content-disposition", "attachment; filename=" + new String(importModelFile.getBytes("utf-8"), "ISO8859-1"));
            //设置输出长度
            response.setHeader("Content-Length", String.valueOf(fileLength));
            //获取输入流
            bis = new BufferedInputStream(new FileInputStream(downLoadPath));
            //输出流
            bos = new BufferedOutputStream(response.getOutputStream());
            byte[] buff = new byte[1024];
            int bytesRead;
            while (-1 != (bytesRead = bis.read(buff, 0, buff.length)))
            {
                bos.write(buff, 0, bytesRead);
            }
            bis.close();
            bos.close();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

}
