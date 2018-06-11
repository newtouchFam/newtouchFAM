Ext.namespace("ssc.smcs.form.cost");

/* 表单访问控制属性配置 */
ssc.smcs.form.cost.AccessConfig =
{
	tag : [ [ "START", "none" ], [ "SSC_VC_FILL", "none" ],[ "SSC_VC_CHECK", "none" ], ["NORMAL", "readonly"] ],
	field :
	{
		serialno : 			[ "readonly", 	"readonly", "readonly" ],
		busidate :			[ "readonly", 	"readonly", "readonly" ],
		userid : 			[ "readonly", 	"readonly", "readonly" ],
		deptid : 			[ "readonly", 	"readonly", "readonly" ],
		budgetyear :		[ "editable", 	"readonly", "readonly" ],
		email : 			[ "hidden",		"hidden",   "hidden" ],
		telephone : 		[ "hidden",   	"hidden",   "hidden" ],
		isdept_other : 		[ "editable",	"readonly",   "readonly" ],
		deptid_other : 		[ "editable",	"readonly",   "readonly" ],
		abstract : 			[ "editable", 	"readonly", "readonly" ],
		affixnum : 			[ "editable",	"readonly", "readonly" ],

		settletype : 		[ "editable", "readonly", "readonly" ],
		payobjecttype :		[ "editable", "readonly", "readonly" ],
  		isrelation : 	[ "editable", "readonly", "readonly"  ],
  		supplierid : 	[ "editable", "readonly", "readonly"  ],
		suppliername : 		[ "readonly", "readonly", "readonly" ],
		payuserid : 		[ "editable", "readonly", "readonly" ],
		payusername : 	 [ "readonly", "readonly", "readonly"],
		customerid :  ["editable", "readonly", "readonly" ],
		customername :  [ "readonly", "readonly", "readonly"],
		paytype:          [ "editable", "readonly", "readonly"  ],
		econitemtypeid : [ "editable", "readonly", "readonly" ],
		ispay:          [ "editable", "readonly", "readonly","editable" ],
		invoicetype : [ "editable", "readonly", "readonly" ],
		remark:          [ "editable", "readonly", "readonly"  ]
	},
	gridlist : [
	{
		gridid : "costinfo",
		econitemid : 		[ "readonly", "readonly", "readonly"],
		deptid : 			[ "readonly", "readonly", "readonly"],
		indexdeptid : 			[ "readonly", "readonly", "readonly"],
		amount : 		[ "readonly", "readonly", "readonly"],
		taxratetext : 			[ "hidden",		"hidden",	"hidden",  "hidden"],
		taxrate : 			[ "readonly", "readonly", "readonly"],
		amount_notax : 	[ "readonly", "readonly", "readonly"],
		amount_tax : 	            [ "readonly", "readonly", "readonly"],
		indexid : 			[ "readonly", "readonly", "readonly"],
		remark : 			[ "readonly", "readonly", "readonly"]
		
	}]
};
