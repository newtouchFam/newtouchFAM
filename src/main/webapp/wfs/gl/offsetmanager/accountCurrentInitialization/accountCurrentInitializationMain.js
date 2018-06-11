Ext.namespace("gl.offsetmanager.accountCurrentInitialization");
/**
 * 主js
 */
gl.offsetmanager.accountCurrentInitialization.MainPanel = Ext.extend(Ext.Panel,
    {
        //1.定义变量、属性
        frame : false,
        border : false,
        layout : 'border',
        //2.构造面板内容
        initComponent : function()
        {
            var accountcodeQuery=new Ext.form.TextField({
                fieldLabel : '科目编号',
                labelAlign : "right",
                labelWidth: 70,
                // colspan:1,
                emptyText : '请输入科目编号...',
                id : 'accountcodeQueryText'
            });
            //科目名称的输入textField
            var accountnameQuery=new Ext.form.TextField({
                fieldLabel : '科目名称',
                labelAlign : "right",
                labelWidth: 70,
                // colspan:1,
                emptyText : '请输入科目名称...',
                id : 'accountnameQueryText'
            });
            //查询按钮
            var queryButton =new Ext.Button(
                {
                    text : '查询',
                    iconCls : "xy-view-select",
                    handler : this.queryHandler.createDelegate(this)
                });
            //导入按钮
            var importButton =new Ext.Button(
                {
                    text : '导入',
                    iconCls : "xy-import",
                    handler : this.importHandler.createDelegate(this)
                });
            //导出按钮
            var exportButton =new Ext.Button(
                {
                    text : '导出',
                    iconCls : "xy-export",
                    handler : this.exportHandler.createDelegate(this)

                });
            //导出模板下载
            var exportModleButton =new Ext.Button(
                {
                    text : '导入模板下载',
                    iconCls : "xy-import",
                    handler : this.exportModleHandler.createDelegate(this)

                });
            this.tbar =['-','科目编号:',accountcodeQuery,'-','科目名称:',accountnameQuery,'-',queryButton,'-',importButton,'-',exportButton,'-',exportModleButton];
            this.items = [
               {region:'north',layout:'border',height : 35,items:[new gl.offsetmanager.accountCurrentInitialization.HeaderPanel()]},
               {region:'center',layout:'border',items:[new gl.offsetmanager.accountCurrentInitialization.ListPanel]}
                ];
            //5.渲染
            gl.offsetmanager.accountCurrentInitialization.MainPanel.superclass.initComponent.call(this);
        },
        //查询
        queryHandler:function(){
            Ext.getCmp('accountlist').query();
        },
        //导入初始化信息
        importHandler : function()
        {
            this.m_FileUploadDialog = new ssc.component.BaseUploadDialog(
                {
                    xy_ParentObjHandle : this,
                    xy_UploadAction : "offsetmanager/accountcurrent/upload",
                    xy_OKClickEvent : this.queryHandler,
                    xy_BaseParams : {},
                    xy_DownloadAction : "wfs/gl/offsetmanager/accountCurrentInitialization/accountCurrentInitializationImportModel.xls",
                    xy_FileAccept : "application/msexcel",
                    xy_FileExt : "xls"
                });
            this.m_FileUploadDialog.show();
        },
        //导出
        exportHandler : function()
        {
            var accountcodeQueryText=Ext.getCmp('accountcodeQueryText').getValue();
            var accountnameQueryText=Ext.getCmp('accountnameQueryText').getValue();
            //定义导出链接
            var url = "offsetmanager/accountcurrent/export";
            var param = {"varAccountCode" : accountcodeQueryText==null?'':accountcodeQueryText,"varAccountName" : accountnameQueryText==null?'':accountnameQueryText};
            ssc.common.PostSubmit(url, param);
        },
    //模版下载
        exportModleHandler : function ()
    {
                var url = '';
                url = "offsetmanager/accountcurrent/downloadImportModel";
                var qryCondition = {fileID:""};

                var oForm = document.createElement("form");
                oForm.id = "freesky-postForm";
                oForm.name = "freesky-postForm";
                oForm.method = "post";
                oForm.action = url;
                oForm.target = "_blank";
                oForm.style.display = "none";

                for(var prop in qryCondition)
                {
                    var oInput = document.createElement("input");
                    oInput.name = prop;
                    oInput.value = qryCondition[prop];
                    oForm.appendChild(oInput);
                }
                document.body.appendChild(oForm);
                oForm.submit();
            }
    });


function init()
{
    new Ext.Viewport(
        {
            layout : 'fit'  ,
          items : [ new gl.offsetmanager.accountCurrentInitialization.MainPanel ]
        });
    Ext.getCmp('accountlist').query();
};
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);
