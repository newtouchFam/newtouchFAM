Ext.namespace("demo.form.cost");

/* 表单访问控制属性配置 */
demo.form.cost.FieldAttrConfig = 
{
	field :
	{
		/* 名称、key、对齐、fieldtype、color */
		serialno : 			[ "表单号",   "", "left", "text" ],
		abstract : 			[ "报账事由", "key", "left", "text" ]
	},
	gridlist : [
	{
		gridid : "costinfo",
		abstract : 	[ "摘要", 	"", 		"left", 150, "text", "none", "", 		false, false, "", false ],
		amount : 		[ "报账金额",  	"", 		"right", 120, "money", "sum", "amount", 	false, false, "", true ]
	}]
};