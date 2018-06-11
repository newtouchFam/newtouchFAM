/**
 * @namespace
 */
Ext.namespace("ssc.component");

/**
 * 缩写定义
 */
DialogButtonTypeEnum = ssc.component.DialogButtonTypeEnum;
DialogButtonStyleEnum = ssc.component.DialogButtonStyleEnum;
DialogEditModeEnum = ssc.component.DialogEditModeEnum;
BaseDialog = ssc.component.BaseDialog;

/**
 * 对话框默认按钮类型枚举
 */
ssc.component.DialogButtonTypeEnum = {};
/**
 * 包括“确定”、“取消”按钮
 */
ssc.component.DialogButtonTypeEnum.OkCancel = "okcancel";
/**
 * 仅包括“关闭”按钮
 */
ssc.component.DialogButtonTypeEnum.Close = "close";
/**
 * 未定义
 */
ssc.component.DialogButtonTypeEnum.Other = "other";

/**
 * @namespace
 * 对话框按钮风格
 */
ssc.component.DialogButtonStyleEnum = {};
/**
 * 按钮风格为this.buttons
 */
ssc.component.DialogButtonStyleEnum.Default = "default";
/**
 * 按钮风格为Ext.Toolbar
 */
ssc.component.DialogButtonStyleEnum.ToolBar = "toolbar";

/**
 * @class
 * 对话框编辑类型枚举
 */
ssc.component.DialogEditModeEnum = {};
/**
 * 增加、新建
 */
ssc.component.DialogEditModeEnum.Add = "add";
/**
 * 修改、更新
 */
ssc.component.DialogEditModeEnum.Update = "update";
/**
 * 查看
 */
ssc.component.DialogEditModeEnum.View = "view";
/**
 * 其他
 */
ssc.component.DialogEditModeEnum.Other = "other";
/**
 * 未定义
 */
ssc.component.DialogEditModeEnum.None = "none";

/**
 * @class
 * 基本对话框<br>
 * @extends Ext.Window<br>
 * 一、支持特性：<br>
 * 1.支持行为动作1)选择对话框2)编辑对话框<br>
 * 2.初始化部分布局样式和按钮，也支持自定义扩充按钮<br>
 * 3.默认可拖动大小和最大化<br>
 *
 * 二、使用方式
 * 1.对话框布局
 * 构造时传入参数
 * title、height、width等Ext.Window自带参数
 * xy_ButtonType	对话框默认按钮，包括“确定”“取消”2个按钮，或者“关闭”1个按钮
 * xy_ButtonStyle	按钮风格，包括默认的Window.Buttons或者Toolbar
 *
 * 2.行为模式
 * xy_EditMode		编辑模式，包括新增、修改、或其他，一般在作为编辑对话框时使用
 *
 * 3.事件
 * 构造时传入参数
 * xy_ParentObjHandle	parent调用方句柄;
 * xy_OKClickEvent		点击“确定”按钮后的回调函数句柄
 * xy_CancelClickEvent	点击“取消”按钮后的回调函数句柄
 * xy_CloseClickEvent	点击“关闭”按钮后的回调函数句柄
 *
 * 实现abstract函数
 * baseConfirmValid		实现点击“确定”按钮验证函数，返回true或false
 * initButtonConfig_Sub	自定义处理按钮
 */
ssc.component.BaseDialog = Ext.extend(Ext.Window,
{
	/**
	 * ==========默认值==========
	 */
	title : "基本对话框",
	width : 400,
	height : 320,
	resizable : false,
	maximizable : true,
	modal : true,
	layout : "fit",
	buttonAlign : "right",

	/**
	 * ==========外观与行为==========
	 */
	/* 对话框默认按钮类型 */
	xy_ButtonType : ssc.component.DialogButtonTypeEnum.OkCancel,

	/* 对话框按钮风格 */
	xy_ButtonStyle : ssc.component.DialogButtonStyleEnum.Default,

	/* 编辑模式 使用ssc.component.DialogEditModeEnum枚举 */
	xy_EditMode : ssc.component.DialogEditModeEnum.None,

	/**
	 * ==========事件==========
	 */
	/* 调用方对象 */
	xy_ParentObjHandle : null,

	/**
	 * 调用方回调处理函数，点击按钮后触发
	 */
	/* 点击“确定”按钮后的回调函数 */
	xy_OKClickEvent : Ext.emptyFn,
	/* 点击“取消”按钮后的回调函数 */
	xy_CancelClickEvent : Ext.emptyFn,
	/* 点击“关闭”按钮后的回调函数 */
	xy_CloseClickEvent : Ext.emptyFn,

	/**
	 * ==========内部成员==========
	 */
	/* 内部使用 */
	m_ModalResult : null,
	/* 按钮设置列表 */
	m_ButtonConfig : [],	

	initComponent : function()
	{
		this.initButton();

		this.initEvent();

		ssc.component.BaseDialog.superclass.initComponent.call(this);
	},
	/**
	 * @private
	 * 初始化按钮Config
	 */
	initButton : function()
	{
		this.m_ButtonConfig = [];
		if (this.xy_ButtonType === ssc.component.DialogButtonTypeEnum.OkCancel)
		{
			if (this.xy_ButtonStyle === ssc.component.DialogButtonStyleEnum.Default)
			{
				this.m_ButtonConfig = [
				{
					text : "确定",
//					iconCls : "xy-icon-ok_trans",
					handler : this.btn_OkEvent,
					scope : this
				},
				{
					text : "取消",
//					iconCls : "xy-cross",
					handler : this.btn_CancelEvent,
					scope : this
				} ];
			}
			else if (this.xy_ButtonStyle === ssc.component.DialogButtonStyleEnum.ToolBar)
			{
				this.m_ButtonConfig = [ "->",
				{
					text : "确定",
					iconCls : 'xy-icon-ok_trans',
					handler : this.btn_OkEvent,
					scope : this
				}, "-",
				{
					text : "取消",
					iconCls : "xy-cross",
					handler : this.btn_CancelEvent,
					scope : this
				} ];
			}
		}
		else if (this.xy_ButtonType === ssc.component.DialogButtonTypeEnum.Close)
		{
			if (this.xy_ButtonStyle === ssc.component.DialogButtonStyleEnum.Default)
			{
				this.m_ButtonConfig = [
				{
					text : "关闭",
/*					iconCls : "xy-close",*/
					handler : this.btn_CloseEvent,
					scope : this
				} ];
			}
			else if (this.xy_ButtonStyle === ssc.component.DialogButtonStyleEnum.ToolBar)
			{
				this.m_ButtonConfig = [ "->",
				{
					text : "关闭",
					iconCls : "xy-close",
					handler : this.btn_CloseEvent,
					scope : this
				} ];
			}
		}

		this.initButtonConfig_Sub();

		if (this.xy_ButtonStyle === ssc.component.DialogButtonStyleEnum.Default)
		{
			this.buttons = this.m_ButtonConfig;
		}
		else if (this.xy_ButtonStyle === ssc.component.DialogButtonStyleEnum.ToolBar)
		{
			this.bbar = new Ext.Toolbar(
			{
				items : this.m_ButtonConfig
			});
		}
	},
	/**
	 * 自定义按钮config，允许在子类中扩展其他按钮
	 * 由子类实现
	 * @private
	 * @abstract
	 * @return void
	 */
	initButtonConfig_Sub : function()
	{
		
	},
	/**
	 * 初始化按钮事件
	 * @private
	 */
	initEvent : function()
	{
		this.addEvents
		(
			/**
			 * 点击“确定”按钮触发事件
			 * ok(Ext.Window this)
			 */
			"result_ok",
			/**
			 * 点击“取消”按钮触发事件
			 * cancel(Ext.Window this)
			 */
			"result_cancel",
			/**
			 * 点击“关闭”按钮触发事件
			 * close(Ext.Window this)
			 */
			"result_close"
		);
		
		if (this.xy_ParentObjHandle !== null
				&& typeof (this.xy_ParentObjHandle) === "object")
		{
			if (this.xy_OKClickEvent !== null && this.xy_OKClickEvent !== undefined)
			{
				this.on("result_ok", this.xy_OKClickEvent, this.xy_ParentObjHandle);				
			}
			
			if (this.xy_CancelClickEvent !== null && this.xy_CancelClickEvent !== undefined)
			{
				this.on("result_cancel", this.xy_CancelClickEvent, this.xy_ParentObjHandle);				
			}

			if (this.xy_CloseClickEvent !== null && this.xy_CloseClickEvent !== undefined)
			{
				this.on("result_close", this.xy_CloseClickEvent, this.xy_ParentObjHandle);				
			}
		}
	},
	/**
	 * 点击“确定”按钮事件
	 * @private
	 */
	btn_OkEvent : function()
	{
		if (this.baseConfirmValid() !== true)
		{
			return;
		}

		if (this.hasListener("result_ok"))
		{
			this.fireEvent("result_ok", this);
		}

		this.closeDialog();
	},
	/**
	 * 点击“取消”按钮事件
	 * @private
	 */
	btn_CancelEvent : function()
	{
		if (this.hasListener("result_cancel"))
		{
			this.fireEvent("result_cancel", this);
		}

		this.closeDialog();
	},
	/**
	 * 点击“关闭”按钮事件
	 * @private
	 */
	btn_CloseEvent : function()
	{
		if (this.hasListener("result_close"))
		{
			this.fireEvent("result_close", this);
		}

		this.closeDialog();
	},
	/**
	 * 点击“确定”按钮后验证方法，可加入校验过程或者提交过程
	 * 由子类实现
	 * @private
	 * @abstract
	 * @retrun boolean
	 */
	baseConfirmValid : function()
	{
		return true;
	},
	/**
	 * 关闭窗口
	 * @private
	 */
	closeDialog : function()
	{
		if (this.closeAction === "close")
		{
			this.close();
		}
		else if (this.closeAction === "hide")
		{
			this.hide();
		}
		else
		{
			this.close();
		}
	},
	/**
	 * 标准校验成功过程，一般在baseConfirmValid内使用
	 * @private
	 */
	baseSuccessCallbackFun : function(response, options)
	{
		var data = Ext.decode(response.responseText);

		if (data.success)
		{
			this.m_ModalResult = true;
		}
		else
		{
			MsgUtil.alert(data.msg);
			this.m_ModalResult = false;
		}
	},
	/**
	 * 标准校验失败过程，一般在baseConfirmValid内使用
	 * @private
	 */
	baseFailureCallbackFun : function(response, options)
	{
		var data = Ext.decode(response.responseText);
		MsgUtil.alert(data.msg);
		
		this.m_ModalResult = false;
	}
});
Ext.reg("ssc.component.basedialog", ssc.component.BaseDialog);