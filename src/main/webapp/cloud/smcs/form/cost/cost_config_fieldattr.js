Ext.namespace("ssc.smcs.form.cost");

/* 表单访问控制属性配置 */
ssc.smcs.form.cost.FieldAttrConfig = 
{
	field :
	{
		/* 名称、key、对齐、fieldtype、color */
		serialno : 			[ "表单号",   "", "left", "text" ],
		busidate : 			[ "报账日期", "", "left", "date" ],
		userid : 			[ "报账人", 	  "", "left", "text" ],
		deptid : 			[ "部门", "", "left", "text" ],
		budgetyear : 		[ "账期年份", "key", "left", "date" ],
		email : 			[ "电子邮箱", "", "left", "text" ],	
		telephone : 		[ "联系电话", "", "left", "text" ],
		isdept_other : 		[ "是否跨部门", "", "left", "text" ],
		deptid_other : 		[ "跨部门", "", "left", "text" ],
		abstract : 			[ "报账事由", "key", "left", "text" ],
		affixnum : 			[ "附件张数", "key", "right", "text" ],

		settletype : ["结算方式", "key", "left", "text"],
		payobjecttype  : [ "支付类型", "key", 	"left", "text"	],
		isrelation : ["是否关联交易", "key", "left", "text"],
		supplierid : ["供应商编码", "key", "left", "text"],
		suppliername : ["供应商名称", "", "left", "text"],
		payuserid : ["工号", "key", "left", "text"],
		payusername : ["姓名", "", "left", "text"],
		customerid : ["客户编号", "key", "left", "text"],
		customername : ["客户名称", "", "left", "text"],
		paytype : ["支付方式", "key", "left", "text"],
		econitemtypeid : ["经济事项大类", "key", "left", "text"],
		ispay : ["款项已付", "key", "left", "text"],
		invoicetype : ["支票类型", "key", "left", "text"],
		remark : ["备注", "", "left", "text"]
	},
	gridlist : [
	{
		gridid : "costinfo",
        econitemid : 		[ "经济事项",		"", 		"left", 150, "text", "none", "", 		false, false, "", false ],
		deptid : 			[ "报账部门", 	"", 		"left", 150, "text", "none", "", 		false, false, "", false ],
		indexdeptid : 	[ "预算部门", 	"", 		"left", 150, "text", "none", "", 		false, false, "", false ],
		amount : 		[ "报账总金额",  	"", 		"right", 120, "money", "sum", "amount", 	false, false, "", true ],
		taxratetext : 			[ "税率文本",		"", 		"left", 60, "text", "none", "", 		false, false, "", false ],
		taxrate : 			[ "税率(%)",		"", 		"right", 60, "text", "none", "", 		false, false, "", false ],
		amount_notax : 	[ "报账金额（不含税）",	"", 		"right", 150, "money", "sum", "amount_notax", false, false, "", true  ],
		amount_tax : 	            [ "税额",	"", 		"right", 60, "money", "sum", "amount_tax", false, false, "", true  ],
		indexid : 			[ "预算项目", 	"", 		"left", 100, "text", "none", "", 		false, false, "", false ],
		remark : 			[ "备注", 	"", 		"left", 150, "text", "none", "", 		false, false, "", false ]

	}]
};