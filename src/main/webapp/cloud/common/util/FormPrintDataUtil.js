Ext.namespace("ssc.core.common");

/**
 * 表单打印数据获取工具类
 */
ssc.core.common.FormPrintDataUtil = {};

/**
 * 读取表单默认的打印数据
 * param: 标准打印数据
 */
ssc.core.common.FormPrintDataUtil.getHeadPrintData = function(/**/entityControls1,
/**/entityControls2)
{
	var jsonObject = {};

	jsonObject = ssc.core.common.FormPrintDataUtil.getPrintDataFromEntityControls(jsonObject, entityControls1);

	jsonObject = ssc.core.common.FormPrintDataUtil.getPrintDataFromEntityControls(jsonObject, entityControls2);

	return jsonObject;
};

/**
 * 读取表单表头打印数据
 * param: 标准打印数据
 */
ssc.core.common.FormPrintDataUtil.getPrintDataFromEntityControls = function(/* Object */jsonPrintData, /* Array */
																			entityControls)
{
	if (jsonPrintData == null || jsonPrintData == undefined)
	{
		jsonPrintData = {};
	}

	for (key in entityControls)
	{
		if (typeof entityControls[key] != 'function')
		{
			var control = Ext.getCmp(entityControls[key]["id"]);
			if (control != null)
			{
				jsonPrintData[control["id"]] = FormFieldUtil.getFieldValue(control);

				if (FormFieldUtil.is_ComplexField(control))
				{
					jsonPrintData[control["id"] + "_text"] = FormFieldUtil.getFieldDisplay(control);
				}

/*				if (control.getXType() == 'datefield')
				{
					jsonPrintData[control["id"]] = Ext.isEmpty(control.getValue()) ? "" : control.getValue().format(
						'Y-m-d');
				}
				else if (control.isDerive("ssc.component.basecombobox")
	                	|| control.isDerive("ssc.component.basesimplecombobox")
	                	|| control.isDerive("ssc.component.basecombobox")
	                	|| control.isDerive("ssc.component.basesimplecombobox")
	                	|| control.getXType().indexOf("xy") == 0
	                	|| control.getXType().indexOf("ssc.component.") == 0
	                	|| control.getXType().indexOf("ssc.smcs.component.xy") == 0)
				{
					jsonPrintData[control["id"]] = (control.getXyValue() == undefined ? "" : control.getXyValue());*/
					/**
					 * 获取组件展示的文本信息,排除金额组件
					 */
/*					if (control.getXType().indexOf("xymoneyfield") == -1)
					{
						try
						{
							if (control.getDisplayValue != undefined
									&& typeof (control.getDisplayValue) == "function")
							{
								jsonPrintData[control["id"] + "_name"] = control.getDisplayValue();
							}
							else if (control.getSelectedText != undefined
									&& typeof (control.getSelectedText) == "function")
							{
								jsonPrintData[control["id"] + "_name"] = control.getSelectedText();
							}
						} catch (e)
						{*/
							/**
							 * 自定义的数据集getDisplayValue()无法获取数据而且报错，用此方法解决。
							 */
/*							if (Ext.isEmpty(jsonPrintData[control["id"] + "_name"]))
							{
								if (typeof control.getRawValue() == "string")
								{
									jsonPrintData[control["id"] + "_name"] = control.getRawValue();
								}
							}
						}
					}
				}
				else
				{
					jsonPrintData[control["id"]] = control.getValue();
				}*/
			}
		}
	}
	return jsonPrintData;
};

var jsonData1 =
{
	"serialno" : "ZG100013032705692",
	"displayname" : "管理员",
	"compname" : "银联总部本部",
	"deptname" : "办公室_本部",
	"title" : "中国银联费用计提报账单",
	"busiclass" : "费用计提",
	"userid" : "管理员",
	"unitid" : "银联总部本部",
	"deptid" : "办公室_本部",
	"email" : "gxcy@192.com",
	"telephone" : "18926351723",
	"formtype" : "计提暂估单",
	"isemergency" : 0,
	"id" : "-1d20b32c:13da1718f5c:-7d5e",
	"status" : "1",
	"startdate" : "2013-03-27",
	"startuserid" : "BFDFDE08-8CA2-4C76-B674-E96AC50B4BB7",
	"processid" : "C3C54088-DCA0-4378-9C54-10A8B9BD88AF",
	"processinstid" : "-1d20b32c:13da1718f5c:-7d65",
	"source" : "P",
	"amount" : "11",
	"finamount" : "11",
	"amount_bc" : 11,
	"finamount_bc" : 11,
	"payamount_bc" : "0",
	"busipayamount" : "0",
	"langcode" : "zhs",
	"bccurrency" : "[object Object]",
	"exchangerate" : 1,
	"payexchangerate" : "0",
	"busipayexchangerate" : "0",
	"busidate" : "2013-03-27",
	"accountdate" : "2013-03-27",
	"affixnum" : 1,
	"currency" : "人民币元",
	"varabstract" : "1",
	"isct" : 1,
	"budgetperiodid" : "2013-03-27",
	"estimatetype" : "0",
	"itemid" : "10N0110220769",
	"contractno" : "CT10000001",
	"ctmoney" : 10000,
	"ctclaimamount" : 0,
	"ctpayedamount" : 0,
	"suppliercode" : "JNS0000092",
	"supplieraddresscode" : "昆明市",
	"detailid" : "-1d20b32c:13da1718f5c:-7d5c",
	"mainid" : "-1d20b32c:13da1718f5c:-7d5e",
	"imagebarcode" : "ZG100013032705692",
	"fundreceive" : [
	{
		"seq" : 1,
		"detailid" : "-1d20b32c:13da1718f5c:-7d5d",
		"mainid" : "-1d20b32c:13da1718f5c:-7d5e",
		"deptid" : "办公室_本部",
		"econitemid" : "计提房租",
		"respnid" : "办公室",
		"indexid" : "租赁物业费-房屋租赁费",
		"abstract" : "管理员报销1",
		"estimateaccu" : 100,
		"amount" : 11,
		"finamount" : 11,
		"amount_bc" : 11,
		"finamount_bc" : 11,
		"accountcode" : "[6601030101]销售费用-租赁物业费-房屋租赁费",
		"subaccountcode" : [],
		"accountcode_credit" : "[2202010101]应付账款",
		"subaccountcode_credit" : "[2202000001]计提",
		"memo" : ""
	} ],
	"jasper" : "Estimate.jasper"
};

var jsonData2 =
{
	"serialno" : "ZG100013032705692",
	"busiclass" : "费用计提",
	"userid" : "管理员",
	"unitid" : "银联总部本部",
	"deptid" : "办公室_本部",
	"email" : "gxcy@192.com",
	"telephone" : "18926351723",
	"formtype" : "计提暂估单",
	"isemergency" : 0,
	"id" : "-1d20b32c:13da1718f5c:-7d5e",
	"status" : "1",
	"startdate" : "2013-03-27",
	"startuserid" : "BFDFDE08-8CA2-4C76-B674-E96AC50B4BB7",
	"processid" : "C3C54088-DCA0-4378-9C54-10A8B9BD88AF",
	"processinstid" : "-1d20b32c:13da1718f5c:-7d65",
	"source" : "P",
	"amount" : "11",
	"finamount" : "11",
	"amount_bc" : 11,
	"finamount_bc" : 11,
	"payamount_bc" : "0",
	"busipayamount" : "0",
	"langcode" : "zhs",
	"bccurrency" : "[object Object]",
	"exchangerate" : 1,
	"payexchangerate" : "0",
	"busipayexchangerate" : "0",
	"busidate" : "2013-03-27",
	"accountdate" : "2013-03-27",
	"affixnum" : 1,
	"currency" : "人民币元",
	"varabstract" : "1",
	"isct" : 1,
	"budgetperiodid" : "2013-03-27",
	"estimatetype" : "0",
	"itemid" : "10N0110220769",
	"contractno" : "CT10000001",
	"ctmoney" : 10000,
	"ctclaimamount" : 0,
	"ctpayedamount" : 0,
	"suppliercode" : "JNS0000092",
	"supplieraddresscode" : "昆明市",
	"detailid" : "-1d20b32c:13da1718f5c:-7d5c",
	"mainid" : "-1d20b32c:13da1718f5c:-7d5e",
	"displayname" : "管理员",
	"compname" : "银联总部本部",
	"deptname" : "办公室_本部",
	"title" : "中国银联费用计提报账单",
	"imagebarcode" : "ZG100013032705692",
	"fundreceive" : [
	{
		"seq" : 1,
		"detailid" : "-1d20b32c:13da1718f5c:-7d5d",
		"mainid" : "-1d20b32c:13da1718f5c:-7d5e",
		"deptid" : "办公室_本部",
		"econitemid" : "计提房租",
		"respnid" : "办公室",
		"indexid" : "租赁物业费-房屋租赁费",
		"abstract" : "管理员报销1",
		"estimateaccu" : 100,
		"amount" : 11,
		"finamount" : 11,
		"amount_bc" : 11,
		"finamount_bc" : 11,
		"accountcode" : "[6601030101]销售费用-租赁物业费-房屋租赁费",
		"subaccountcode" : [],
		"accountcode_credit" : "[2202010101]应付账款",
		"subaccountcode_credit" : "[2202000001]计提",
		"memo" : ""
	} ],
	"jasper" : "Estimate.jasper"
};

var a = [
		{
			"javaBean" : "com.freesky.ssc.interfaceWf.sscWfEx.FormSaveCall",
			"method" : "execute",
			"mainEntity" : "MAIN"
		},
		[
				{
					"entities" : [ "MAIN" ],
					"keyColumns" : [ "serialno" ]
				},
				[
						[ "serialno", "userid", "unitid", "deptid", "email", "telephone", "formtype", "isemergency",
								"id", "status", "startdate", "startuserid", "processid", "processinstid", "source",
								"amount", "amount", "exchangerate", "exchangerateid", "amount_bc", "finamount_bc",
								"busiclass", "busidate", "accountdate", "affixnum", "varabstract", "currency",
								"amount", "finamount", "paycurrency", "payexchangerate", "payexchangerateid" ],
						[ "JK100013041209324", "BFDFDE08-8CA2-4C76-B674-E96AC50B4BB7",
								"d0923436-bc9e-d42b-7dba-9ce1a1e43206", "C142196E-2A62-00CC-E043-AC11ED0B00CC",
								"gxcy@192.com", "18926351723", "BT06", 0, "661857cf:13df3dfc53e:-2bb2", "-2",
								"2013-04-12", "BFDFDE08-8CA2-4C76-B674-E96AC50B4BB7",
								"54D55BF1-0E32-436D-A367-41A7AE6AAF86", "661857cf:13df3dfc53e:-2bb9", "P", 1, 1, "1",
								"", "1", "1", "BC0802", "2013-04-12", "2013-04-12", "0", "1", "CNY", 1, 1, "CNY", "1",
								"" ] ] ],
		[
				{
					"entities" : [ "LOAN" ]
				},
				[
						[ "econitemid", "amount", "finamount", "cashflowcode", "accountcode", "accountcode_credit",
								"subaccountcode", "subaccountcode_credit", "paytype", "paybankaccount",
								"payaccountcode" ],
						[ "6068F8F3-0370-49DA-887E-73207A05C9ED", 1, 1, "CJR005", "1231030101", "2202010101", "", "",
								"PT0405", "1129510308", "1002010101" ] ] ],
		[
				{
					"entities" : [ "PAY" ],
					"keyColumns" : [ "DETAILID" ]
				},
				[
						[ "seq", "detailid", "mainid", "wagetype", "payobjectcode", "payobjectaddresscode",
								"accountname", "bankname", "subbranchbankname", "accountnumber", "varabstract",
								"amount", "finamount", "amount_bc", "finamount_bc", "bankareacode", "isbankalter",
								"memo", "payobjecttype", "paytype" ],
						[ 1, "661857cf:13df3dfc53e:-2bb1", "661857cf:13df3dfc53e:-2bb2", "",
								"86F4AAD4-F64E-401A-B339-0E65B4783159", "", "1", "1", "1", "1", "111", 1, 1, 1, 1,
								"AHAQ", 1, "管理员报销1", "1", "" ] ] ] ];

var abc = [
{
	"seq" : "",
	"detailid" : "",
	"mainid" : "",
	"econitemid" : "计提无卡支付业务专项风险准备金",
	"abstract" : "",
	"estimateaccu" : 0,
	"amount" : 0,
	"finamount" : 0,
	"deptid" : "公共部门_本部",
	"respnid" : "银联公共",
	"indexid" : "计提风险准备金",
	"accountcode" : "[6702020101]计提风险准备金-专项风险准备金",
	"subaccountcode" : "无卡支付业务专项风险准备金",
	"accountcode_credit" : "[6702020101]计提风险准备金-专项风险准备金",
	"subaccountcode_credit" : "",
	"memo" : "",
	"amount_bc" : 0,
	"finamount_bc" : 0
} ];

var abccc = [
		[ "seq", "detailid", "mainid", "econitemid", "abstract", "estimateaccu", "amount", "finamount", "deptid",
				"respnid", "indexid", "accountcode", "subaccountcode", "accountcode_credit", "subaccountcode_credit",
				"memo", "amount_bc", "finamount_bc" ],
		[ 1, "548ddcce:13e08297a09:-7fd2", "548ddcce:13e08297a09:-7fd3", "CD5764F3-A21E-018E-E043-AC100472018E",
				"管理员报销100", 0, 100, 100, "C142196E-306B-00CC-E043-AC11ED0B00CC",
				"6554EC32-96AE-43E4-84B0-ED9EBB83B62A", "7E4774BB-0D29-48B8-B566-E317E3FCBDEF", "6702020101",
				"6702020002", "6702020101", "", "", 100, 100 ] ];

var x =
{
	"serialno" : "ZG-0001-131029-08842",
	"busiclass" : "smcsBC0101",
	"busiclass_text" : "日常费支出",
	"userid" : "BFDFDE08-8CA2-4C76-B674-E96AC50B4BB7",
	"userid_text" : "管理员",
	"unitid" : "6a9e229a-1cd4-b60a-d971-53cbc97b5118",
	"unitid_text" : "上海市信产通信服务有限公司",
	"deptid" : "5D7DB5C5-FDDB-9F2F-6175-155342427151",
	"deptid_text" : "[31000103]财务部",
	"email" : "gxcy@192.com",
	"telephone" : "",
	"formtype" : "smcsBT0101",
	"formtype_text" : "支出报账单",
	"isemergency" : 0,
	"isemergency_text" : "否",
	"busidate" : "2013-10-29",
	"accountdate" : "2013-10-29",
	"budgetdate" : "2013-10-29",
	"varabstract" : "打印测试",
	"affixnum" : 1,
	"currency" : "CNY",
	"currency_text" : "人民币元",
	"id" : "-210d4c2c:14202fd1d43:-7ff2",
	"status" : "1",
	"processid" : "47384CB9-B342-4BC7-B862-31061ED98168",
	"processinstid" : "-210d4c2c:14202fd1d43:-7ffa",
	"source" : "P",
	"langcode" : "",
	"startuserid" : "BFDFDE08-8CA2-4C76-B674-E96AC50B4BB7",
	"startdate" : "2013-10-29",
	"amount" : 146.89,
	"finamount" : 146.89,
	"amount_bc" : "",
	"finamount_bc" : "",
	"settletype" : 1,
	"settletype_text" : "付款",
	"payobjecttype" : 0,
	"payobjecttype_text" : "员工",
	"supplierid" : "4B73171F-4D81-48B9-9035-8111E8EC8E52",
	"supplierid_text" : "SH-GYS-006390",
	"detailid" : "-210d4c2c:14202fd1d43:-7ff1",
	"payamount" : 146.89,
	"paytypecode" : "smcsPT1003",
	"paytypecode_text" : "网银支付",
	"bankaccountid" : "B5709FC0-2082-4589-93B0-75787D9F2C97",
	"bankaccountid_text" : "银行存款.综合户.浦东发展银行.浦发长宁支行076334-98490154800001243",
	"accountid_bank" : "31D571B7-84AC-425D-BEB1-4315728FDE6A",
	"suppliername" : "上海多联制冷设备有限公司",
	"costinfo" : [
	{
		"detailid" : "-210d4c2c:14202fd1d43:-7fff",
		"mainid" : "-210d4c2c:14202fd1d43:-7ff2",
		"seq" : 1,
		"econitemid" : "会议费",
		"econitemsubid" : "",
		"memo" : "打印测试",
		"deptid" : "[31000103]财务部",
		"contractid" : "上海市信产通信服务有限公司机动车辆保险协议",
		"itemid" : "",
		"orderid" : "",
		"invoiceid" : "",
		"amount" : 90,
		"finamount" : 90,
		"indexid" : "",
		"isrelation" : 0,
		"isamortize" : 0,
		"iswriteoff" : 0,
		"abstract" : "财务部付上海多联制冷设备有限公司会议费",
		"accountid" : "[660235]管理费用.会议费",
		"accountid_payable" : "[224104]其他应付款.内部往来",
		"accountid_bank" : "[1002111202]银行存款.综合户.浦东发展银行.浦发长宁支行076334-98490154800001243",
		"cashflowid" : "",
		"relativeobjectname" : "",
		"relativeitemid" : "",
		"relationcode" : "",
		"amount_relation" : 0,
		"finamount_relation" : 0,
		"amortize_begindate" : "",
		"amortize_enddate" : "",
		"amortize_months" : 0,
		"accountid_amortize" : [],
		"amortize_amount_month" : 0,
		"amortize_finamount_month" : 0,
		"amortize_amount_thismonth" : 0,
		"amortize_finamount_thismonth" : 0
	},
	{
		"detailid" : "5de2bb44:142076751a3:-7fe6",
		"mainid" : "-210d4c2c:14202fd1d43:-7ff2",
		"seq" : 2,
		"econitemid" : "劳动保护费",
		"econitemsubid" : "",
		"memo" : "打印测试",
		"deptid" : "[31000108]党委工作部",
		"contractid" : "松江视频监控项目三方采购合同",
		"itemid" : "",
		"orderid" : "",
		"invoiceid" : "",
		"amount" : 56.89,
		"finamount" : 56.89,
		"indexid" : "",
		"isrelation" : 1,
		"isamortize" : 0,
		"iswriteoff" : 0,
		"abstract" : "财务部付上海多联制冷设备有限公司劳动保护费",
		"accountid" : [],
		"accountid_payable" : "[224104]其他应付款.内部往来",
		"accountid_bank" : "[1002111202]银行存款.综合户.浦东发展银行.浦发长宁支行076334-98490154800001243",
		"cashflowid" : "",
		"relativeobjectname" : "上海多联制冷设备有限公司",
		"relativeitemid" : "",
		"relationcode" : "",
		"amount_relation" : 56.89,
		"finamount_relation" : 56.89,
		"amortize_begindate" : "",
		"amortize_enddate" : "",
		"amortize_months" : 0,
		"accountid_amortize" : [],
		"amortize_amount_month" : 0,
		"amortize_finamount_month" : 0,
		"amortize_amount_thismonth" : 0,
		"amortize_finamount_thismonth" : 0
	} ],
	"payinfo" : [
	{
		"detailid" : "5de2bb44:142076751a3:-7fc6",
		"mainid" : "-210d4c2c:14202fd1d43:-7ff2",
		"seq" : 1,
		"payobjectid" : "4B73171F-4D81-48B9-9035-8111E8EC8E52",
		"payobjectname" : "上海多联制冷设备有限公司",
		"payobjecttype" : 0,
		"bankaccountid" : "上海农村商业银行长征支行",
		"bankname" : "上海农村商业银行长征支行",
		"subbankname" : "上海农村商业银行长征支行",
		"bankareacode" : "默认银行地区码",
		"accountname" : "上海多联制冷设备有限公司",
		"accountnumber" : "32459408010120687",
		"amount" : 146.89,
		"finamount" : 146.89,
		"abstract" : "付上海多联制冷设备有限公司打印测试",
		"memo" : "付上海多联制冷设备有限公司打印测试"
	} ]
};

var y =
{
	"serialno" : "ZG-0001-131029-08842",
	"busiclass" : "smcsBC0101",
	"busiclass_text" : "日常费支出",
	"userid" : "BFDFDE08-8CA2-4C76-B674-E96AC50B4BB7",
	"userid_text" : "管理员",
	"unitid" : "6a9e229a-1cd4-b60a-d971-53cbc97b5118",
	"unitid_text" : "上海市信产通信服务有限公司",
	"deptid" : "5D7DB5C5-FDDB-9F2F-6175-155342427151",
	"deptid_text" : "[31000103]财务部",
	"email" : "gxcy@192.com",
	"telephone" : "",
	"formtype" : "smcsBT0101",
	"formtype_text" : "支出报账单",
	"isemergency" : 0,
	"isemergency_text" : "否",
	"busidate" : "2013-10-29",
	"accountdate" : "2013-10-29",
	"budgetdate" : "2013-10-29",
	"varabstract" : "打印测试",
	"affixnum" : 1,
	"currency" : "CNY",
	"currency_text" : "人民币元",
	"id" : "-210d4c2c:14202fd1d43:-7ff2",
	"status" : "1",
	"processid" : "47384CB9-B342-4BC7-B862-31061ED98168",
	"processinstid" : "-210d4c2c:14202fd1d43:-7ffa",
	"source" : "P",
	"langcode" : "",
	"startuserid" : "BFDFDE08-8CA2-4C76-B674-E96AC50B4BB7",
	"startdate" : "2013-10-29",
	"amount" : 146.89,
	"finamount" : 146.89,
	"amount_bc" : "",
	"finamount_bc" : "",
	"settletype" : 1,
	"settletype_text" : "付款",
	"payobjecttype" : 0,
	"payobjecttype_text" : "员工",
	"supplierid" : "4B73171F-4D81-48B9-9035-8111E8EC8E52",
	"supplierid_text" : "SH-GYS-006390",
	"detailid" : "-210d4c2c:14202fd1d43:-7ff1",
	"payamount" : 146.89,
	"paytypecode" : "smcsPT1003",
	"paytypecode_text" : "网银支付",
	"bankaccountid" : "B5709FC0-2082-4589-93B0-75787D9F2C97",
	"bankaccountid_text" : "银行存款.综合户.浦东发展银行.浦发长宁支行076334-98490154800001243",
	"accountid_bank" : "31D571B7-84AC-425D-BEB1-4315728FDE6A",
	"suppliername" : "上海多联制冷设备有限公司",
	"costinfo" : [
	{
		"detailid" : "-210d4c2c:14202fd1d43:-7fff",
		"mainid" : "-210d4c2c:14202fd1d43:-7ff2",
		"seq" : 1,
		"econitemid" : "2AC1EC11-2987-4CC5-B4BB-A999C7FFDBC9",
		"econitemid_text" : "会议费",
		"econitemsubid" : "",
		"econitemsubid_text" : "",
		"memo" : "打印测试",
		"deptid" : "5D7DB5C5-FDDB-9F2F-6175-155342427151",
		"deptid_text" : "[31000103]财务部",
		"contractid" : "E0FDFDBF-F890-4D6B-A7F7-D1A861C1BC51",
		"contractid_text" : "上海市信产通信服务有限公司机动车辆保险协议",
		"itemid" : "",
		"itemid_text" : "",
		"orderid" : "",
		"invoiceid" : "",
		"amount" : 90,
		"finamount" : 90,
		"indexid" : "",
		"indexid_text" : "",
		"isrelation" : 0,
		"isamortize" : 0,
		"iswriteoff" : 0,
		"abstract" : "财务部付上海多联制冷设备有限公司会议费",
		"accountid" : "4E3F0F28-F622-474D-BF29-EF48BC9B7E88",
		"accountid_text" : "[660235]管理费用.会议费",
		"accountid_payable" : "51A9A7FE-93CF-41BC-A37C-D50733043891",
		"accountid_payable_text" : "[224104]其他应付款.内部往来",
		"accountid_bank" : "31D571B7-84AC-425D-BEB1-4315728FDE6A",
		"accountid_bank_text" : "[1002111202]银行存款.综合户.浦东发展银行.浦发长宁支行076334-98490154800001243",
		"cashflowid" : "",
		"cashflowid_text" : "",
		"relativeobjectname" : "",
		"relativeitemid" : "",
		"relativeitemid_text" : "",
		"relationcode" : "",
		"amount_relation" : 0,
		"finamount_relation" : 0,
		"amortize_begindate" : "",
		"amortize_enddate" : "",
		"amortize_months" : 0,
		"accountid_amortize" : "",
		"accountid_amortize_text" : [],
		"amortize_amount_month" : 0,
		"amortize_finamount_month" : 0,
		"amortize_amount_thismonth" : 0,
		"amortize_finamount_thismonth" : 0
	},
	{
		"detailid" : "5de2bb44:142076751a3:-7fe6",
		"mainid" : "-210d4c2c:14202fd1d43:-7ff2",
		"seq" : 2,
		"econitemid" : "7CF679A3-53E6-469E-B302-376CA3352714",
		"econitemid_text" : "劳动保护费",
		"econitemsubid" : "",
		"econitemsubid_text" : "",
		"memo" : "打印测试",
		"deptid" : "17979914-5CB7-176E-E998-545252763CE7",
		"deptid_text" : "[31000108]党委工作部",
		"contractid" : "CBB321D2-F0E2-4B29-AFA3-F1B77D9B34D3",
		"contractid_text" : "松江视频监控项目三方采购合同",
		"itemid" : "",
		"itemid_text" : "",
		"orderid" : "",
		"invoiceid" : "",
		"amount" : 56.89,
		"finamount" : 56.89,
		"indexid" : "",
		"indexid_text" : "",
		"isrelation" : 1,
		"isamortize" : 0,
		"iswriteoff" : 0,
		"abstract" : "财务部付上海多联制冷设备有限公司劳动保护费",
		"accountid" : "",
		"accountid_text" : [],
		"accountid_payable" : "51A9A7FE-93CF-41BC-A37C-D50733043891",
		"accountid_payable_text" : "[224104]其他应付款.内部往来",
		"accountid_bank" : "31D571B7-84AC-425D-BEB1-4315728FDE6A",
		"accountid_bank_text" : "[1002111202]银行存款.综合户.浦东发展银行.浦发长宁支行076334-98490154800001243",
		"cashflowid" : "",
		"cashflowid_text" : "",
		"relativeobjectname" : "上海多联制冷设备有限公司",
		"relativeitemid" : "",
		"relativeitemid_text" : "",
		"relationcode" : "",
		"amount_relation" : 56.89,
		"finamount_relation" : 56.89,
		"amortize_begindate" : "",
		"amortize_enddate" : "",
		"amortize_months" : 0,
		"accountid_amortize" : "",
		"accountid_amortize_text" : [],
		"amortize_amount_month" : 0,
		"amortize_finamount_month" : 0,
		"amortize_amount_thismonth" : 0,
		"amortize_finamount_thismonth" : 0
	} ],
	"payinfo" : [
	{
		"detailid" : "5de2bb44:142076751a3:-7fc6",
		"mainid" : "-210d4c2c:14202fd1d43:-7ff2",
		"seq" : 1,
		"payobjectid" : "4B73171F-4D81-48B9-9035-8111E8EC8E52",
		"payobjectname" : "上海多联制冷设备有限公司",
		"payobjecttype" : 0,
		"bankaccountid" : "1705DBFE-8E3A-4677-92E5-B0C72BCFE1E8",
		"bankaccountid_text" : "上海农村商业银行长征支行",
		"bankname" : "上海农村商业银行长征支行",
		"subbankname" : "上海农村商业银行长征支行",
		"bankareacode" : "默认银行地区码",
		"accountname" : "上海多联制冷设备有限公司",
		"accountnumber" : "32459408010120687",
		"amount" : 146.89,
		"finamount" : 146.89,
		"abstract" : "付上海多联制冷设备有限公司打印测试",
		"memo" : "付上海多联制冷设备有限公司打印测试"
	} ]
};

