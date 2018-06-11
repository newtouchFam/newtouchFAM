/**
 *   @author <a href="mailto:awingedsteed@yahoo.com.cn">mashengwen</a>
 */

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";

//统一的对loadexception的提示处理
if(Ext.data.Store){
	var _constructorFn$=Ext.data.Store.prototype.constructor;
	Ext.data.Store.prototype.constructor=function(A){
		_constructorFn$.call(this,A);
		if(!this.hasListener('loadexception')){
			this.on('loadexception',showExtLoadException);
		}
	}
}

if(Ext.grid.GridView){
	Ext.apply(Ext.grid.GridView.prototype, {
		deferEmptyText:false,
		emptyText:'没有记录!'
	})
}


//统一的对loadexception的提示处理
if(Ext.tree.TreeLoader){
	var _constructorL$=Ext.tree.TreeLoader.prototype.constructor;
	Ext.tree.TreeLoader.prototype.constructor=function(A){
		_constructorL$.call(this,A);
		if(!this.hasListener('loadexception')){
			this.on('loadexception',showExtLoadException);
		}
	}
}

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "确定",
      cancel : "取消",
      yes    : "是",
      no     : "否"
   };
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
	  displayInfo: true,
	  displayMsg: '第{0}条到{1}条,共{2}条',
	  emptyMsg: "无记录!",
	  beforePageText:'第',
	  afterPageText:'页 共{0}页',
	  firstText:'首页',
	  prevText:'上一页',
	  nextText:'下一页',
	  lastText:'尾页',
	  refreshText:'刷新'
 });
}

Ext.override(Ext.menu.DateMenu,{         
    render : function(){         
        Ext.menu.DateMenu.superclass.render.call(this);         
        if(Ext.isGecko){         
            this.picker.el.dom.childNodes[0].style.width = '178px';         
            this.picker.el.dom.style.width = '178px';         
        }         
    }         
}); 

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "今天",
      minText           : "日期在最小日期之前",
      maxText           : "日期在最大日期之后",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : '下月 (Control+Right)',
      prevText          : '上月 (Control+Left)',
      monthYearText     : '选择一个月 (Control+Up/Down 来改变年)',
      todayTip          : "{0} (空格键选择)",
      format            : "y年m月d日",
      okText            : "确定",
      cancelText        : "取消"
   });
}

if(Ext.isEmpty){
	Ext.isEmpty=function(v, allowBlank){
		if(v === null || v === undefined){
			return true;			
		}
		
		if(v instanceof Array){
			if(0==v.length){
				return true;
			}
		}else if(v instanceof String||typeof v=='string'){
			if(v.trim()==''){
				return true;
			}
		}
        return  false;
    }
}

