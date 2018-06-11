Ext.namespace("sm.component");

/**
 * 公司下拉框组件
 * @param
 * 	jsonCondition:
 * 		unitCode	公司编码，支持模糊匹配
 * 		unitName	公司名称，支持模糊匹配
 * 		unittext	公司编码或名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
sm.component.UnitListComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "选择单位",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "sm/unit/list",
	valueField : "unitid",
	displayField : "unitname",
	xy_StoreFields : [ "unitid", "unitcode", "unitname",
	                 "fullcode", "fullname",
	                 "parentid", "status", "isleaf", "level",
	                 "formattedcode", "formattedname" ],
	getUnitID : function()
	{
		return this.getSelectedID();
	},
 	getUnitCode : function()
	{
		return this.getSelectedAttr("unitcode");
	},
	getUnitName : function()
	{
		return this.getSelectedAttr("unitname");
	}
});
Ext.reg("sm.component.unitlistcombobox", sm.component.UnitListComboBox);

/**
 * 权限公司下拉框组件
 * @param
 * 	jsonCondition:
 * 		operationcode	操作权限编码
 * 		unitCode	公司编码，支持模糊匹配
 * 		unitName	公司名称，支持模糊匹配
 * 		unittext	公司编码或名称，支持模糊匹配
 * 		status		状态，0或1
 * 		leaf		末级，1仅限末级，0仅限非末级
 */
sm.component.UnitListPermissionComboBox = Ext.extend(ssc.component.BaseListComboBox,
{
	fieldLabel : "选择单位",
	width : 200,
	xy_AllowClear : true,
	xy_DataActionURL : "sm/unit!getUnitListByPermission.action",
	valueField : "unitid",
	displayField : "unitname",
	xy_StoreFields : [ "unitid", "unitcode", "unitname",
	                 "fullcode", "fullname",
	                 "parentid", "status", "isleaf", "level",
	                 "formattedcode", "formattedname"],
	operationCode : "",
	prepareBaseParams  : function(/* Store this*/ store, /*Object options*/ options)
	{
		var condition = new ssc.common.BaseCondition();
		condition.addString("operationcode", this.operationCode);
	
		var param =
		{
			jsonCondition : condition
		};
		
		return param;
	}
});
Ext.reg("sm.component.unitlistpermissioncombobox", sm.component.UnitListPermissionComboBox);


/**
 * 公司下拉框组件(树)
 * @param
 * 	root
 * 	jsonCondition:
 * 		textfield	显示字段，格式"[,unitCode,],unitName"
 */
sm.component.UnitTreeComboBox = Ext.extend(ssc.component.BaseTreeComboBox,
{
	fieldLabel : "选择单位",
	emptyText : "请选择单位...",
	width : 200,
	listWidth : 350,
	xy_RootTitle : "选择单位",
	xy_AllowClear : true,
	xy_DataActionURL : "sm/unit/tree"
});
Ext.reg("sm.component.unittreecombobox", sm.component.UnitTreeComboBox);