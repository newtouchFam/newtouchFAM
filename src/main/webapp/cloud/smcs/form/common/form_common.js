Ext.namespace("ssc.cup.form");

/**
 * 根据列的dataindex查找列索引
 * @param dataindex
 * @return	未找到返回-1
 */
/*Ext.grid.XyColumnModel.prototype.getColumnIndexByDataIndex = function(strDataIndex)
{
	for (var i = 0; i < this.getColumnCount(); i++)
	{
		if (this.getDataIndex(i) == strDataIndex)
		{
			return i;
		}
	}

	return -1;
};*/

/**界面随窗口大小自适应
 * 每个类型的表单主js中要有id为maindiv的组件
 * */
function resizeWin()
{
    window.onresize = function()
    {
    	Ext.getCmp("maindiv") ? Ext.getCmp("maindiv").doLayout() : null;
    };	
}

/**设置textfield超出最大长度不让其输入*/
/*Ext.form.TextField.prototype.size = 20;
Ext.form.TextField.prototype.initValue = function()
{
	if (this.value !== undefined)
	{
		this.setValue(this.value);
	}
	else if (this.el.dom.value.length > 0)
	{
		this.setValue(this.el.dom.value);
	}
	this.el.dom.size = this.size;
	if (!isNaN(this.maxLength) && (this.maxLength * 1) > 0 && (this.maxLength != Number.MAX_VALUE))
	{
		this.el.dom.maxLength = this.maxLength * 1;
	}
};  */

var ExpandMainEntitys = 
{
	"BT0101" : "SMCSFM_COST",
	"BT0201" : "SMCSFM_CONTRACT",
	"BT0401" : "SMCSFM_REPORT",
	"BT0103" : "SMCSFM_WRITEOFF",
	"BT0102" : "SMCSFM_CTCOST",
	"BT0301" : "SMCSFM_ASSETSCRAP"
};

function getEntityTemplateData(EntityInfo)
{
	var templateData = new Array();
    templateData[0] = [];
    templateData[1] = [];
    
    for (key in EntityInfo)
    {
        if (typeof EntityInfo[key] != "function")
        {
            var control = Ext.getCmp(EntityInfo[key]["id"]);
            if (control != null)
            {
                if (control.XyNotSave === true)
                {
                    continue;
                }

                templateData[0].push(control["XySaveField"] ? control["XySaveField"] : control["id"]);

                templateData[1].push(FormFieldUtil.getFieldValue(control));

/*                if (control.getXType() == "datefield")
                {
                    if(control.getValue() == "" || control.getValue() == null)
					{
						templateData[1].push("");
					}
					else
					{
						templateData[1].push(control.getValue().format("Y-m-d"));
					}
                }
                else if (control.isDerive("ssc.component.basecombobox")
                	|| control.isDerive("ssc.component.basesimplecombobox"))
                {
                	templateData[1].push(control.getKeyValue());
                }
                else if (control.isDerive("ssc.component.baselisttgfield")
                	|| control.isDerive("ssc.component.basetreetgfield"))
                {
                	templateData[1].push(control.getSelectedID());
                }
                else if (control.getXType().indexOf("xy") == 0
                    		|| control.getXType().indexOf("ssc.component.") == 0
                    		|| control.getXType().indexOf("ssc.cup.component.xy") == 0)
                {
                    templateData[1].push(control.getXyValue() == null ? "" : control.getXyValue());
                }
                else
                {
                    templateData[1].push(control.getValue());
                }*/
            }
        }
    }

    return templateData;
}

/**
 * TODO getMainEntityInfo后续加入全局工具类
 */
function getMainEntityInfo()
{
    var schema =
    {
        entities : ["SMCSFM_MAIN"],
        keyColumns : ["serialno"]
    };

    var templateData = getEntityTemplateData(MainEntityControls);
/*    var templateData = new Array();
    templateData[0] = [];
    templateData[1] = [];
    
    for (key in MainEntityControls)
    {
        if (typeof MainEntityControls[key] != 'function')
        {
            var control = Ext.getCmp(MainEntityControls[key]["id"]);
            if (control != null)
            {
                if (control.XyNotSave === true)
                {
                    continue;
                }
                if (control.getXType() == 'datefield')
                {
                    templateData[0].push(control["id"]);
                    if(control.getValue() == "" || control.getValue() == null)
					{
						templateData[1].push("");
					}
					else
					{
						templateData[1].push(control.getValue().format('Y-m-d'));
					}
                }
                else
                {
                    templateData[0].push(control["XySaveField"] ? control["XySaveField"] : control["id"]);
                    if (control.getXType().indexOf("xy") == 0
                    		|| control.getXType().indexOf("ssc.component.xy") == 0
                    		|| control.getXType().indexOf("ssc.cup.component.xy") == 0)
                    {
                        templateData[1].push(control.getXyValue() == null ? "" : control.getXyValue());
                    }
                    else
                    {
                        templateData[1].push(control.getValue());
                    }
                }
            }
        }
    }*/

    var envelope = [schema, templateData];
    return envelope;
}

/**
 * TODO getChildEntityInfo后续加入全局工具类
 */
function getChildEntityInfo()
{
	var strFormTypeCode = FormGlobalVariant.get_FormTypeCode();
    var schema =
    {
        entities : [ExpandMainEntitys[strFormTypeCode]]
    };

    var templateData = getEntityTemplateData(MainChildControls);

/*    var templateData = new Array();
    templateData[0] = [];
    templateData[1] = [];
    for (key in MainChildControls)
    {
        if (typeof MainChildControls[key] != 'function')
        {
            var control = Ext.getCmp(MainChildControls[key]["id"]);
            if (control != null)
            {
                if (control.XyNotSave === true)
                {
                    continue;
                }
                if (control.getXType() == 'datefield')
                {
                    templateData[0].push(control["id"]);
                    if(control.getValue() == "" || control.getValue() == null)
					{
						templateData[1].push("");
					}
					else
					{
						templateData[1].push(control.getValue().format('Y-m-d'));
					}
                }
                else
                {
                    templateData[0].push(control["XySaveField"] ? control["XySaveField"] : control["id"]);
                    if (control.getXType().indexOf("xy") == 0 || control.getXType().indexOf("ssc.cup.component.xy") == 0)
                    {
                        templateData[1].push(control.getXyValue() == null ? "" : control.getXyValue());
                    }
                    else
                    {
                        templateData[1].push(control.getValue());
                    }
                }
            }
        }
    }*/

    var envelope = [schema, templateData];
    return envelope;
}

/*给主面板和扩展主面板的组件着色*/
function Coloration()
{/*
	for (key in MainEntityControls)
    {
        if (typeof MainEntityControls[key] != 'function')
        {
            var control = Ext.getCmp(MainEntityControls[key]["id"]);
            if (control != null && control.disabled != undefined)
            {
            	if(control.disabled == true)
            	{
            		control.getEl().dom.style.background = "#DDDDDD";
//            		control.style.backgroundColor = "#DDDDDD";
            	}
            	else
            	{
            		control.getEl().dom.style.background = "";
//            		control.style.backgroundColor = "";
            	}
            }
        }
    }
	for (key in MainChildControls)
    {
        if (typeof MainChildControls[key] != 'function')
        {
            var control = Ext.getCmp(MainChildControls[key]["id"]);
            if (control != null && control.disabled != undefined)
            {
            	if(control.disabled == true)
            	{
            		control.getEl().dom.style.background = "#DDDDDD";
            	}
            	else
            	{
            		control.getEl().dom.style.background = "";
            	}
            }
        }
    }*/
}

//封面打印数据
function getCoverPrintInfo()
{
    var jsonObject = {};
    jsonObject["title"] = "中国银联报账单封面";
    jsonObject["serialno"] = Ext.get("serialno").dom.value;
    jsonObject["imagebarcode"] = Ext.get("serialno").dom.value;
    jsonObject["companyname"] = Ext.getCmp("unitname").getValue();
    jsonObject["approveuser"] = Ext.getCmp("username").getValue();
    jsonObject["deptname"] = Ext.getCmp("deptname").getValue();
    jsonObject["commitdate"] = Ext.getCmp("busidate").getValue().format("Y年m月d日");
    jsonObject["businessman"] = Ext.getCmp("username").getValue();
    jsonObject["amount"] = Freesky.Common.XyFormat.cnMoney(Ext.getCmp("amount").getValue());
//    jsonObject["bustype"] = Ext.getCmp("formtype").getValue();
    jsonObject["bustype"] = Ext.getCmp("busiclass").getDisplayValue();
    jsonObject["username"] = Ext.getCmp("username").getValue();
    jsonObject["memo"] = Ext.getCmp("varabstract").getValue();
    // 封面模板
    jsonObject["jasper"] = "formFace.jasper";

    return jsonObject;
}

function OnRollback(rollbackid)
{
	parent.m_WorkData.setValue("G_SSC_SUBMITTYPE", "1");
}
function OnReject()
{
	parent.m_WorkData.setValue("G_SSC_SUBMITTYPE", "2");
}
function OnTransfer(transferid)
{
	parent.m_WorkData.setValue("G_SSC_SUBMITTYPE", "3");
}
function OnTransmit(transmitid)
{
	/*操作类型
	 * 0提交
	 * 1回退
	 * 2拒绝
	 * 3转发
	 * 4转拟办
	 * 5保存草稿
	 * 6保存模板
	 * 7读取模板
	 * 8制证
	 * 9冲销
	 */
	parent.m_WorkData.setValue("G_SSC_SUBMITTYPE", "4");
}

function OnSave(callback)
{
	parent.m_WorkData.setValue("G_SSC_SUBMITTYPE", "5");
}


/**附件上传是否可用*/
function attachmentEnable()
{
	return (FormGlobalVariant.get_Activity_AttachmentEnable() == "1");
}

Ext.form.TextField.disabledClass = "ssc_cup_form_textfield";


/* TabPanel功能扩展 */
/**
 * 按照ID获取面板
 */
Ext.TabPanel.prototype.getTabByID = function(tabID)
{
	for ( var i = 0; i < this.items.getCount(); i++)
	{
		var tab = this.getItem(i);
		if (tab.id === tabID)
		{
			return tab;
		}
	}

	return null;
};

/**
 * 判断面板是否隐藏
 */
Ext.TabPanel.prototype.isTabHide = function(index)
{
	var tab = this.getItem(index);
	if (tab == null || tab == undefined)
	{
		return;
	}

    var el = this.getTabEl(tab);
    if(el == null || el == undefined)
    {
    	return;
    }

    if (el.style.display == "none")
    {
    	return true;
    }
    else
    {
    	return false;
    }
};

Ext.TabPanel.prototype.isTabHideByID = function(tabID)
{
	var tab = this.getTabByID(tabID);
	if (tab == null || tab == undefined)
	{
		return;
	}

    var el = this.getTabEl(tab);
    if(el == null || el == undefined)
    {
    	return;
    }

    if (el.style.display == "none")
    {
    	return true;
    }
    else
    {
    	return false;
    }
};