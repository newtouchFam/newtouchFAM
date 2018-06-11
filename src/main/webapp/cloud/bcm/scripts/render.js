/**
 *   @author <a href="mailto:awingedsteed@yahoo.com.cn">mashengwen</a>
 */

function compareDate(adate,bdate){
	
	if(Ext.isEmpty(adate)||Ext.isEmpty(bdate)){
		return 0;	
	}
	
	var adate=Ext.isDate(adate)?adate:Date.parseDate(adate,'Y-m-d');
	var bdate=Ext.isDate(bdate)?bdate:Date.parseDate(bdate,'Y-m-d');
	
	var ayear=adate.getFullYear();
	var amonth=adate.getMonth();
	var aday=adate.getDate();

	var byear=bdate.getFullYear();
	var bmonth=bdate.getMonth();
	var bday=bdate.getDate();
	
	if(ayear>byear){
		return 1;
	}else if(ayear==byear){
		if(amonth>bmonth){
			return 1;
		}else if(amonth==bmonth){
			if(aday>bday){
				return 1;
			}
		}
	}

	if(ayear==byear&&amonth==bmonth&&aday==bday){
		return 0;
	}
	
	return -1;	
}

function applystatus(value){
	
	if(Ext.isEmpty(value)){
		return '';
	}
	
	switch (value.toString()){
	case '0':
		return '未申请';
		break;
	case '1':
		return '发起'; 
		break;
	case '2':
		return '财务审核';
		break;
	case '3':
		return '审批完成';
		break;
	case 'X':
		return '删除';
		break;
	}
}

var months=[
	[1,'一月'],
	[2,'二月'],
	[3,'三月'],
	[4,'四月'],
	[5,'五月'],
	[6,'六月'],
	[7,'七月'],
	[8,'八月'],
	[9,'九月'],
	[10,'十月'],
	[11,'十一月'],
	[12,'十二月']
];
function month(value){
	return months[value-1][1];
}

function percent(value){
	if(Ext.isEmpty(value)||null==value){
		return;
	}
	return value+"%";
}

function percentmake(max){
	return function(value){
		if(value>max){
			return '<font color="red">'+value+'%'+'</font>';
		}else{
			return value+'%';
		}
	}	
}

/*var ctrltypes=[[-1,'不控制'],[0,'柔性'],[1,'刚性']];*/
function ctrltype(value){
	if(Ext.isEmpty(value)){
		return '';
	}
	switch(value.toString()){
		case '-1':
			return "不控制";
			break;
		case '0':
			return "柔性";
			break;
		case '1':
			return "刚性";
			break;
	}
}

var assignmodes=[[0,'待办工作量平衡'],[1,'总工作量平衡']];
function assign(value){
	if(Ext.isEmpty(value)){
		return '';
	}
	switch(value.toString()){
		case '0':
			return "待办工作量平衡";
			break;
		case '1':
			return "总工作量平衡";
			break;
	}
} 

var assigns=[[0,'自动分配'],[1,'定时分配'],[2,'组长手动分配']];
function assign(value){
	if(Ext.isEmpty(value)){
		return '';
	}
	switch(value.toString()){
		case '0':
			return "自动分配";
			break;
		case '1':
			return "定时分配";
			break;
		case '2':
			return "组长手动分配";
			break;
	}
} 
 
var agents=[[0,'未授权'],[1,'组内授权(不接收新任务)'],[2,'组外授权(他人代理)']];
function agent(value){
	if(Ext.isEmpty(value)){
		return '';
	}
	switch(value.toString()){
		case '0':
			return "未授权";
			break;
		case '1':
			return "组内授权";
			break;
		case '2':
			return "组外授权";
			break;
	}
}


var managers=[[-1,'已注销'],[0,'未分配'],[1,'已分配'],[2,'已完成']];
function manager(value){
	if(Ext.isEmpty(value)){
		return '';
	}
	switch(value.toString()){
		case '-1':
			return "已注销";
			break;
		case '0':
			return "未分配";
			break;
		case '1':
			return "已分配";
			break;
		case '2':
			return "已完成";
			break;
	}
}


/*var ctrlperiods=[[1, '月控'],[2, '季控'],[3, '半年控'],[4, '年控']];*/
function ctrlperiod(value){
	if(Ext.isEmpty(value)){
		return '';
	}
	
	switch (value.toString()) {
		case '1' :
			return "月控";
			break;
		case '2' :
			return "季控";
			break;
		case '3' :
			return "半年控";
			break;
		case '4' :
			return "年控";
			break;
		default :
			return "";
			break;
	}
  	
}

/*var ctrlattrs=[[1, '滚动控制'],[2, '本期控制']];*/
function ctrlattr(value){

	if(Ext.isEmpty(value)){
		return '';
	}
	switch (value.toString()) {
		case '1' :
			return "滚动控制";
			break;
		case '2' :
			return "本期控制";
			break;
		default :
			return "";
			break;
	}
}

var yesnos=[[1, '是'],[0, '否']];
function yesno(value){
	if(Ext.isEmpty(value)){
		return '';
	}
	if(value=='0'){ 
		return "否";
	}else if(value=='1'){
		return "是";
	}
//			break;
//		case 1 :
//			return "是";
//			break;
//		default :
//			return "";
//			break;
//	}
}

var effects=[[0, '无效'],[1, '有效']];
function effect(value){
	if(Ext.isEmpty(value)){
		return '';
	}

	switch (value.toString()) {
		case '0' :
			return "无效";
			break;
		case '1' :
			return "有效";
			break;
		default :
			return "";
			break;
	}
}


function formatDate(value) {

	if (value && value.dateFormat) {
		return value.dateFormat('Y-m-d');
	} else {
		return value;
	}
};

// 启用停用状态
function render(value) {
	if (value == '0') {
		return "<font color='green'>启用</font>";
	}
	if (value == '1') {
		return "<font color='red'>停用</font>";
	}

}
// 是否状态
function YesOrNo(value) {
	if(Ext.isEmpty(value)){
		return '';
	}
	if (value) {
		return "是"
	} else {
		return "否"
	}

}

// 字符数字
function CharOrNum(val) {
	if (val == 1) {

		return '字符';
	} else {
		return '数字';
	}

}

// 期间类型
function periodState(value) {

	switch (value) {
		case 0 :
			return "不控制";
		case 1 :
			return "一月";
		case 2 :
			return "二月";
		case 3 :
			return "三月";
		case 4 :
			return "四月";
		case 5 :
			return "五月";
		case 6 :
			return "六月";
		case 7 :
			return "七月";
		case 8 :
			return "八月";
		case 9 :
			return "九月";
		case 10 :
			return "十月";
		case 11 :
			return "十一月";
		case 12 :
			return "十二月";
		default :
			return "";
	}
}

// 调整期间类型
function periodstate(value) {

	switch (value) {
		case "0" :
			return "年";
		case "1" :
			return "一月";
		case "2" :
			return "二月";
		case "3" :
			return "三月";
		case "4" :
			return "四月";
		case "5" :
			return "五月";
		case "6" :
			return "六月";
		case "7" :
			return "七月";
		case "8" :
			return "八月";
		case "9" :
			return "九月";
		case "10" :
			return "十月";
		case "11" :
			return "十一月";
		case "12" :
			return "十二月";
		default :
			return "";
	}
}

function getRound(v, decimal) {

	if (1 == decimal) {
		return (Math.round((v - 0) * 10)) / 10;
	} else if (2 == decimal) {
		return (Math.round((v - 0) * 100)) / 100;
	} else if (3 == decimal) {
		return (Math.round((v - 0) * 1000)) / 1000;
	} else if (4 == decimal) {
		return (Math.round((v - 0) * 10000)) / 10000;
	} else if (5 == decimal) {
		return (Math.round((v - 0) * 100000)) / 100000;
	} else if (0 == decimal) {
		return (Math.round((v - 0) * 1)) / 1;;
	} else {
		return v
	}

}

function getFloor(v, decimal) {
	if (1 == decimal) {
		return (v == Math.floor(v)) ? v + ".0" : v;
	} else if (2 == decimal) {
		return (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math
				.floor(v * 10)) ? v + "0" : v);
	} else if (3 == decimal) {
		return (v == Math.floor(v)) ? v + ".000" : ((v * 10 == Math.floor(v
				* 10)) ? v + "00" : ((v * 100 == Math.floor(v * 100))
				? v + "0"
				: v));
	} else if (4 == decimal) {
		return (v == Math.floor(v)) ? v + ".0000" : ((v * 10 == Math.floor(v
				* 10)) ? v + "000" : ((v * 100 == Math.floor(v * 100)) ? v
				+ "00" : ((v * 1000 == Math.floor(v * 1000)) ? v + "0" : v)));
	} else if (5 == decimal) {
		return (v == Math.floor(v)) ? v + ".00000" : ((v * 10 == Math.floor(v
				* 10)) ? v + "0000" : ((v * 100 == Math.floor(v * 100)) ? v
				+ "000" : ((v * 1000 == Math.floor(v * 1000)) ? v + "00" : ((v
				* 10000 == Math.floor(v * 10000)) ? v + "0" : v))));
	} else if (0 == decimal) {
		return v;
	} else {
		return v
	}
}

function getSub(ps, decimal) {

	if (1 == decimal) {
		return ps[1] ? '.' + ps[1] : '.0';
	} else if (2 == decimal) {
		return ps[1] ? '.' + ps[1] : '.00';
	} else if (3 == decimal) {
		return ps[1] ? '.' + ps[1] : '.000';
	} else if (4 == decimal) {
		return ps[1] ? '.' + ps[1] : '.0000';
	} else if (5 == decimal) {
		return ps[1] ? '.' + ps[1] : '.00000';
	} else if (ps[1]) {
		return '.' + ps[1];
	} else {
		return "";
	}
}

/**
 * 
 * @param {}
 *            v
 * @param {}
 *            decimal
 * @param {}
 *            thousand
 * @return {}
 */
function renderNum(v, decimal, thousand) {

	if (decimal) {
		v = getRound(v, decimal);
		v = getFloor(v, decimal);
	}

	if (thousand) {
		v = String(v);
		var ps = v.split('.');
		var whole = ps[0];
		var sub = getSub(ps, decimal);
		var r = /(\d+)(\d{3})/;
		while (r.test(whole)) {
			whole = whole.replace(r, '$1' + ',' + '$2');
		}
		v = whole + sub;
		if (v.charAt(0) == '-') {
			return '-' + v.substr(1);
		}
	}

	return "" + v;
}

/**
 * 策略
 * 
 * @param {}
 *            value
 * @return {String}
 */
function ctrlTacticRender(value) {
	switch (value) {
		case 0 :
			return "柔性";
			break;
		case 1 :
			return "刚性";
			break;
		case -1 :
			return "不控制";
			break;
		default :
			return "";
			break;
	}
}


/**
 * 数字% 
 * @param {} val
 * @return {}
 */
function pctChange(value){
        if(value > 0){
            return '<span style="color:green;">' + value + '%</span>';
        }else if(value < 0){
            return '<span style="color:red;">' + value + '%</span>';
        }
        return value;
    }
  
