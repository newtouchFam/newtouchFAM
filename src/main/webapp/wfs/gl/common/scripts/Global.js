Ext.namespace("com.freesky.em8.gl.common");

Ext.lib.Ajax.defaultPostHeader += '; charset=utf-8';
Ext.BLANK_IMAGE_URL = 'resources/images/s.gif';
Ext.QuickTips.init();// 初始化信息提示功能
Ext.form.Field.prototype.msgTarget = 'under';
Ext.Ajax.timeout = 1800000; //默认ajax请求30分钟超时

com.freesky.em8.gl.common.PER_PAGE_SIZE = 20;// 分页时每页显示的记录条数
com.freesky.em8.gl.common.WINDOW_PER_PAGE_SIZE = 15;// 弹出窗体分页时每页显示的记录条数
com.freesky.em8.gl.common.loadMask = undefined;

/**
 * 为防止自定义控件使用以下全局参数，暂时保留以下两个参数
 * @type Number
 */
var PER_PAGE_SIZE = 20;// 分页时每页显示的记录条数
var WINDOW_PER_PAGE_SIZE = 10;// 弹出窗体分页时每页显示的记录条数

com.freesky.em8.gl.common.add = 1;
com.freesky.em8.gl.common.update = 2;
com.freesky.em8.gl.common.remove = 3;
com.freesky.em8.gl.common.refresh = 4;
com.freesky.em8.gl.common.separatorEmpty = '';
com.freesky.em8.gl.common.emptyDataUrl = "gl/getEmptyData.action";
com.freesky.em8.gl.common.separator = '<font color=red>*</font>';
com.freesky.em8.gl.common.$REQUEST_SUCCESS = false; // 在点确定按钮如果有错误信息用此全局变量判断是否需关闭窗口
com.freesky.em8.gl.common.loadingMSG = '正在加载...';

/**
 * 常用正则表达式 Ext已提供了最常用的正则匹配，详见控件的vtype(Ext.form.VTypes)和inputtype属性。 此处补充提供一些常用的表达式
 * 
 * @author rockyee
 * @type
 */
com.freesky.em8.gl.common.REGEX_FORMAT =
{
    phone : /^(\d{3,4})\-{0,1}(\d{7,8})\-{0,1}(\d{0,4})$/,// 电话号码（3-4位区号，7-8位直播号码，1-4位分机号）
    mobilePhone : /^\d{11}$/, // 手机号码
    postalCode : /^[1-9]\d{5}$/, // 邮政编码
    chineses : /[\u4e00-\u9fa5]/, // 中文字符
    DWORD : /[^\x00-\xff]/, // 双字节字符(包括汉字在内)
    blankLine : /\n\s*\r/, // 空白行
    ltBlank : /^\s*|\s*$/, // 首尾空白字符(包括空格、制表符、换页符等等)
    email : /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, // email地址
    IPAddress : /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // IP地址
    IDCard : /^\d{15,18}$|^\d{18}$/
    // 身份证
};

/**
 * 用于grid自动换行
 */
com.freesky.em8.gl.common.gridAutoNewLineRenderer = function(value, metadata, record)
{
	metadata.attr = 'style="white-space:normal;"';
	return "<div style='vertical-align:left;height:26px;'>"+value+"</div>";
	//style='background-color:yellow;color:red; 
	
	//return value;
}
	
/**
 * 用于grid显示十位的日期列
 * @param {} value
 */
com.freesky.em8.gl.common.dateRenderer = function(value)
{
	return value.substr(0, 10);
}

/**
 * 判断value是否为Integer类型
 * 
 * @param {}
 *            value
 * @return {}
 */
com.freesky.em8.gl.common.isInteger = function(value)
{
    var reg = /^\d+$/;
    return reg.test(value);
}

/**
 * 取得参数的值(为空或0值返回空串)
 * 
 * @param {}
 *            value
 * @return {String}
 */
com.freesky.em8.gl.common.getParamValue = function(value)
{
    if (Ext.isEmpty(value) || value == 0)
    {
        return "";
    }

    return value;
}

/**
 * 弹出提示框
 * 
 * @param {}
 *            msg
 * @param {}
 *            title
 * @param {}
 *            type
 * @param {}
 *            buttons
 */
com.freesky.em8.gl.common.showMessage = function(msg, title, type, buttons,fn)
{
    var msgType;
    if (Ext.isEmpty(msg))
    {
        msg = com.freesky.em8.gl.common.loadingMSG;
    }
    if (Ext.isEmpty(title))// 默认为提示框
    {
        title = '提示';
    }
    if (Ext.isEmpty(type))
    {
        type = Ext.MessageBox.INFO;
    }
    if (Ext.isEmpty(buttons))
    {
        buttons = Ext.MessageBox.OK;
    }
    switch (type)
    {
        case 'INFO' :
            msgType = Ext.MessageBox.INFO;
            break;
        case 'WARN' :
            msgType = Ext.MessageBox.WARNING;
            break;
        default :
            msgType = type;
            break;
    }

    Ext.MessageBox.show(
            {
                msg : msg,
                title : title,
                icon : msgType,
                buttons : buttons,
                fn : fn
            });
}

/**
 * 弹出是否确认框
 * @param {} options 与Ext.MessageBox.show参数一致
 */
com.freesky.em8.gl.common.showYesNo = function(options)
{
	this.showYesNo_options = options;
    Ext.MessageBox.show(
            {
                title : options.title || '提示',
                msg : options.msg,
                closable : false,
                fn : function(result)
                {
                    if (result == "no")
                    {
                        if (this.showYesNo_options.fn) this.showYesNo_options.fn();
                    }
                },
                buttons :
                {
                    yes : '否',
                    no : '是'
                },//为了默认激活否，把是和否反义
                scope : this
            });
}

/**
 * 消息等待...
 * 
 * @param {}
 *            msg
 * @param {}
 *            body
 */
com.freesky.em8.gl.common.wait = function(msg, body)
{
	com.freesky.em8.gl.common.resume();
    
    if (Ext.isEmpty(msg))
    {
        msg = "正在处理，请稍候...";
    }
    if (Ext.isEmpty(body))
    {
        body = top.Ext.getBody();
    }

    com.freesky.em8.gl.common.loadMask = new top.Ext.LoadMask(body,
            {
                msg : msg,
                removeMask : true
            });
    com.freesky.em8.gl.common.loadMask.show();
}

/**
 * 消息等待...
 * 
 * @param {}
 *            msg
 * @param {}
 *            body
 */
com.freesky.em8.gl.common.waitTop = function(msg, body)
{
	com.freesky.em8.gl.common.resume();
    
    if (Ext.isEmpty(msg))
    {
        msg = "正在处理，请稍候...";
    }
    if (Ext.isEmpty(body))
    {
        body = top.Ext.getBody();
    }

    com.freesky.em8.gl.common.loadMask = new top.Ext.LoadMask(body,
            {
                msg : msg,
                removeMask : true
            });
    com.freesky.em8.gl.common.loadMask.show();
}

/**
 * 继续执行，在等待的事务完成后清除等待框,与方法com.freesky.em8.gl.common.wait配合使用
 */
com.freesky.em8.gl.common.resume = function()
{
    if (!Ext.isEmpty(com.freesky.em8.gl.common.loadMask))
    {
        com.freesky.em8.gl.common.loadMask.hide();
        com.freesky.em8.gl.common.loadMask = undefined;
    }
}

//从窗体(formpanel,panel)对象中取得表单控件的值
//@return 如果方法返回false，表示验证未通过，否则返回根据{name:value,.....}组合的json对象
alertValidateMaxLength = true;
com.freesky.em8.gl.common.getTypes = function()
{
//	var array = ['radio','checkbox','textfield','search','searchfield','trigger','xycombobox','numberfield','textarea','datefield','hidden','combo','comboext','xymoneyfield'];
	var array = [];
	array.push('radio');
	array.push('checkbox');
	array.push('textfield');
	array.push('search');
	array.push('searchfield');
	array.push('trigger');
	array.push('xycombobox');
	array.push('numberfield');
	array.push('textarea');
	array.push('datefield');
	array.push('hidden');
	array.push('combo');
	array.push('comboext');
	array.push('xymoneyfield');
	return array;
}
com.freesky.em8.gl.common.getFormValues = function(form)
{
    var executed = false, json = {};
	var array = com.freesky.em8.gl.common.getTypes();
	for(var n = 0; n < array.length; n++)
	{		
		var type = array[n];
		var controls = form.findByType(type);
		//=========用于解决类似合同登记多个tab页可选输入的特殊表单Begin=========
		if(type == 'checkbox' && !executed )
		{	
			executed = true;
			var flag = 0;
			for(var i = 0; i < controls.length; i++)
			{
				//加上配置参数validatable:true的checkbox控件代表选择后才进行表单验证
				if(controls[i].validatable === true)
					if(!controls[i].getValue())flag = 1;				
			}
			if(flag == 1)
			{
				json = {};break;
			}
			n = 0;continue;
		}
		for(var i = 0; i < controls.length; i++)
		{
			var control = controls[i];
			var name = control.getName() || control.getId();
			var value = control.getValue();	
			//控件加上配置参数allowBlank:false或labelSeparator:separator(带红色*样式的全局变量)后，进行非空验证.
			if(control.allowBlank === false || control.labelSeparator === com.freesky.em8.gl.common.separator)
			{
				if(com.freesky.em8.gl.common.isNullOrEmpty(value))
				{
					com.freesky.em8.gl.common.showMessage(control.fieldLabel+'不能为空！');
					return false;
				}
			}
			if(typeof value == 'string')
				value = Ext.util.Format.trim(value);
				
			//alertValidateMaxLength为全局变量，如果值为true(默认true)，表示用消息框弹出校验信息
			if(alertValidateMaxLength === true && control.maxLength > 0)
			{
				var v = value;
				if((v && typeof v != 'string') || v === 0)
					v = Ext.util.Format.trim(v.toString());

				//控件加上maxLength配置参数，将会校验控件值的长度
				if(v && v.length > control.maxLength)
				{
					com.freesky.em8.gl.common.showMessage(control.fieldLabel+'允许输入的最大长度为'+control.maxLength);
					return false;
				}		
			}
			//如果在表单控件上加上配置参数submit:false,则该控件的值不被提交到服务端(默认提交)
			if(control.submit != false)
			{
				if(type == 'datefield')
					value = Ext.util.Format.date(value,control.format);
					
				if(type == 'numberfield')
					if(!value)value = 0;
				
				if(type == 'radio')
				{
					if(!control.checked)continue;
					if(control.hiddenValue !== undefined)
						value = control.hiddenValue;
				}
				if(type == 'checkbox')
				{
					if(control.checked)
					{
						if(control.hiddenValue !== undefined)
							value = control.hiddenValue;
						else
							value = 1;
					}
					else
						value = 0;
				}
				
				if(type == 'hidden')
				{
					var val1 = value, val2;
					//===innername是关联到存储编号的控件的名称。hiddens[i]为存储父全编号控件对象===
					if(control.innername)
					{
						var val2= Ext.util.Format.trim(form.find('name',control.innername)[0].getValue());								
						if(control.level == 1)
						{
							json[name] = val2; continue;
						}
						if(val1)
						{
							json[name] = val1 + control.separator + val2;
							continue;
						}			
						json[name] = val2;	
						continue;
					}	
					//=====type为存储的value值的数据类型=============================
					if(control.type === 'int')
						if(val1)val1 = parseInt(val1);						
			
					json[name] = val1;
					continue;
				}
				json[name] = value;
			}								
		}
	}
	return json;
}
//为窗体赋值
com.freesky.em8.gl.common.setFormValues = function(form, json)
{
    for(var key in json)
    {
		var c = form.find('name', key)[0] || form.findById(key);
		
		if(c)c.setValue(json[key]);
	}
}
//设置控件编辑状态
com.freesky.em8.gl.common.setFormDisabled = function(form, json)
{
    for(var key in json)
    {
		var c = form.find('name', key)[0] || form.findById(key);
		
		if(c){
			if(typeof(json[key]) == 'number'){
				c.setDisabled(json[key] == 1 ? false : true);
			}
			else if(typeof(json[key]) == 'boolean'){
				c.setDisabled(json[key]);
			}
			else{
				c.setDisabled(false);
			}
		}
	}
}
//判断传入的val值是否为空字符串或null、undefined
com.freesky.em8.gl.common.isNullOrEmpty = function(val)
{
	if(typeof val == 'string'){
		var trimRe = /^\s+|\s+$/g;
		val = String(val).replace(trimRe, "");
	}
	return val === null || val === undefined || val === '';
}
//为传入的value值进行四舍五入计算并保留pos位小数
com.freesky.em8.gl.common.formatFloat = function(value,pos)
{
	return Math.round(value*Math.pow(10, pos))/Math.pow(10, pos);
}
//给传入的value字符串染成传入的color颜色
formatColor = function(value, color)
{	
	color = color || 'red';
	
	if(typeof value !== 'string')
		value = String.valueOf(value);

	return "<font color=" + color + ">" + value + "</font>";
}
//arguments[0] <=> count 第一个参数是需要生成空格的数量
//arguments[1] <=> value 第二个参数是需要给传入的value两边加count数量的空格(如果传入该参数的情况下)
com.freesky.em8.gl.common.getBlankSpace = function()
{
	var a = arguments, s = "";
	if(a.length < 1 || a[0] < 1)return s;		
	while(a[0] > 0){
		s += "&nbsp;";
		a[0]--;
	}
	if(a.length > 1) return s + a[1] + s;
	return s;
}
//给值加上单引号
com.freesky.em8.gl.common.setSingleQuotes = function(value)
{
	return "'" + value.toString() + "'";
}
//是否空数组
com.freesky.em8.gl.common.isEmptyArray = function(array){
	if(Ext.isArray(array)){
		return array.length > 0 ? false : true;
	}else if(typeof(array) == 'string'){
		if(array == '[]'){
			return true;
		}else{
			return false;
		}
	}else{
		com.freesky.em8.gl.common.showMessage("传入的值不是一个数组类型！");
	}
}
//是否空对象
com.freesky.em8.gl.common.isEmptyObject = function(obj){
	if(typeof(obj) == 'object'){
		var i = 0;
		for(var key in obj){
			i++; break;
		}
		return i > 0 ? false : true;
	}else if(typeof(obj) == 'string'){
		if(obj == '{}'){
			return true;		
		}else{
			return false;
		}
	}else{
		com.freesky.em8.gl.common.showMessage("传入的值不是一个对象类型！");
	}
}
//ajax异步请求服务器方法
com.freesky.em8.gl.common.request = function(url, json, callback, scope)
{
	com.freesky.em8.gl.common.wait();
    Ext.Ajax.request(
    {
        url : url,
        params : json,
        success : function(response, options)
        {
        	//判断服务端是否执行正确
            if (com.freesky.em8.gl.common.isSuccess(response))
            {                    
                com.freesky.em8.gl.common.$REQUEST_SUCCESS = true;// 在点确定按钮如果有错误信息用此全局变量判断是否需关闭窗口
                
                if (!Ext.isEmpty(callback))
                {
                    callback.call(scope, response.responseText, options);
                }
            }
        },
        failure : com.freesky.em8.gl.common.ajaxFailureHandler.createDelegate(this)
    });
}

/**
 * 人民币数字转中文
 * 
 * @param {}
 *            currencyDigits
 * @return {String}
 */
com.freesky.em8.gl.common.convertCurrency = function(currencyDigits)
{
    // Constants:
    var MAXIMUM_NUMBER = 99999999999.99;
    // Predefine the radix characters and currency symbols for output:
    var CN_ZERO = "零";
    var CN_ONE = "壹";
    var CN_TWO = "贰";
    var CN_THREE = "叁";
    var CN_FOUR = "肆";
    var CN_FIVE = "伍";
    var CN_SIX = "陆";
    var CN_SEVEN = "柒";
    var CN_EIGHT = "捌";
    var CN_NINE = "玖";
    var CN_TEN = "拾";
    var CN_HUNDRED = "佰";
    var CN_THOUSAND = "仟";
    var CN_TEN_THOUSAND = "万";
    var CN_HUNDRED_MILLION = "亿";
    var CN_SYMBOL = "人民币";
    var CN_DOLLAR = "元";
    var CN_TEN_CENT = "角";
    var CN_CENT = "分";
    var CN_INTEGER = "整";

    // Variables:
    var integral; // Represent integral part of digit number.
    var decimal; // Represent decimal part of digit number.
    var outputCharacters; // The output result.
    var parts;
    var digits, radices, bigRadices, decimals;
    var zeroCount;
    var i, p, d;
    var quotient, modulus;

    // Validate input string:
    currencyDigits = currencyDigits.toString();
    if (currencyDigits == "")
    {
        // alert("Empty input!");
        return "";
    }
    if (currencyDigits.match(/[^-,.\d]/) != null)
    {
        return "";
    }
    /*
     * if ((currencyDigits) .match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) ==
     * null) { alert("Illegal format of digit number!"); return ""; }
     */

    // Normalize the format of input digits:
    currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma
    // delimiters.
    currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the
    // beginning.
    // Assert the number is not greater than the maximum number.
    if (Number(currencyDigits) > MAXIMUM_NUMBER)
    {
        return "金额超出最大限制...";
    }

    // Process the coversion from currency digits to characters:
    // Separate integral and decimal parts before processing coversion:
    parts = currencyDigits.split(".");
    if (parts.length > 1)
    {
        integral = parts[0];
        decimal = parts[1];
        // Cut down redundant decimal digits that are after the second.
        decimal = decimal.substr(0, 2);
    }
    else
    {
        integral = parts[0];
        decimal = "";
    }
    // Prepare the characters corresponding to the digits:
    digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN,
            CN_EIGHT, CN_NINE);
    radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
    bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
    decimals = new Array(CN_TEN_CENT, CN_CENT);
    // Start processing:
    outputCharacters = "";
    // Process integral part if it is larger than 0:
    if (Number(integral) > 0)
    {
        zeroCount = 0;
        for (i = 0; i < integral.length; i++)
        {
            p = integral.length - i - 1;
            d = integral.substr(i, 1);
            quotient = p / 4;
            modulus = p % 4;
            if (d == "0")
            {
                zeroCount++;
            }
            else
            {
                if (zeroCount > 0)
                {
                    outputCharacters += digits[0];
                }
                zeroCount = 0;
                outputCharacters += digits[Number(d)] + radices[modulus];
            }
            if (modulus == 0 && zeroCount < 4)
            {
                outputCharacters += bigRadices[quotient];
            }
        }
        outputCharacters += CN_DOLLAR;
    }
    // Process decimal part if there is:
    if (decimal != "")
    {
        for (i = 0; i < decimal.length; i++)
        {
            d = decimal.substr(i, 1);
            if (d != "0")
            {
                outputCharacters += digits[Number(d)] + decimals[i];
            }
        }
    }
    // Confirm and return the final output string:
    if (outputCharacters == "")
    {
        outputCharacters = CN_ZERO + CN_DOLLAR;
    }
    if (decimal == "" || decimal == 0)
    {
        outputCharacters += CN_INTEGER;
    }
    outputCharacters = outputCharacters;
    return outputCharacters;
}
/**
 * 将循环分成小块处理，避免浏览器脚本失控
 * @param {} array 要处理的数组对象
 * @param {} process 对数组中每个对象的处理函数
 * @param {} callback 可选的回调方法参数，用于执行完 process()函数后回调该方法
 */
com.freesky.em8.gl.common.chunk = function(array, process, callback)
{
    var items = array.concat(); //array.concat(); // clone the array .createDelegate()
    setTimeout(com.freesky.em8.gl.common.chunkPrivate.createDelegate(this, [items, process, callback]), 10);
}

com.freesky.em8.gl.common.chunkPrivate = function(items, process, callback)
{
    var item = items.shift();
    process(item);

    if (items.length > 0)
    {
        setTimeout(arguments.callee.createDelegate(this, [items, process, callback]), 10);
    }
    else
    {
    	callback();
    }
}
