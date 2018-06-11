Ext.namespace("com.freesky.em8.gl.common");

Ext.Ajax.on('requestexception', com.freesky.em8.gl.common.ajaxRequestException);// ajax访问的异常处理

/**
 * 保留供wf的自定义控件使用
 * @param {} This
 * @param {} node
 * @param {} response
 */
function showExtLoadException(This, node, response)
{
    com.freesky.em8.gl.common.responseHandler(response);
}


/**
 * 判断服务端响应是否执行成功
 * 
 * @param {}
 *            response
 * @return {Boolean}
 */
com.freesky.em8.gl.common.isSuccess = function(response)
{
    com.freesky.em8.gl.common.resume();
    var rs = {};
    
    if (Ext.isEmpty(response.responseText)) return true;
    
    var text = response.responseText.trim();
    
    if (Ext.isEmpty(text)) return true;

    try
    {
        rs = Ext.decode(text);
    }
    catch (ex)
    {
        com.freesky.em8.gl.common.showMessage('请返回JSON格式的数据！', '警告', Ext.MessageBox.WARNING);
        return false;
    }
    if (Ext.isEmpty(rs.success) || rs.success)
    {
        return true;
    }

    if (Ext.isEmpty(rs.errDesc) && Ext.isEmpty(rs.msg))
    {
        rs.errDesc = "JSON数据格式不正确。";
    }
    if (!Ext.isEmpty(rs.msg))
    {
    	rs.errDesc = rs.msg;	
    }
    com.freesky.em8.gl.common.showMessage(rs.errDesc, '警告', Ext.MessageBox.WARNING);

    return false;
}

/**
 * 处理服务端的响应
 * 
 * @param {}
 *            response
 */
com.freesky.em8.gl.common.responseHandler = function(response)
{
    com.freesky.em8.gl.common.resume();
    var status = response.status;
    var text = response.responseText.trim();

    switch (status)
    {
        case 404 :
            com.freesky.em8.gl.common.showMessage("请求url不可用", '警告', Ext.MessageBox.WARNING);
            break;
        case 200 :
            return com.freesky.em8.gl.common.isSuccess(response);
        default :
            com.freesky.em8.gl.common.showMessage(status + "," + text, '警告', Ext.MessageBox.WARNING);
            break;
    }
}

/**
 * 供dataStore Load使用
 * 
 * @param {}
 *            This
 * @param {}
 *            node
 * @param {}
 *            response
 * @param {}
 *            dataerror
 */
com.freesky.em8.gl.common.dataStoreLoadException = function(This, node, response, dataerror)
{
    if (Ext.isEmpty(dataerror))
    {
        com.freesky.em8.gl.common.showMessage(response.responseText.trim(), '警告', Ext.MessageBox.WARNING);
        return;
    }
    com.freesky.em8.gl.common.responseHandler(response);
}

/**
 * 供tree Load使用
 * 
 * @param {}
 *            This
 * @param {}
 *            node
 * @param {}
 *            response
 */
com.freesky.em8.gl.common.treeLoadException = function(This, node, response)
{
    com.freesky.em8.gl.common.responseHandler(response);
}

/**
 * 供tree Load使用
 * 
 * @param {}
 *            This
 * @param {}
 *            node
 * @param {}
 *            response
 */
com.freesky.em8.gl.common.treeLoadHandler = function(This, node, response)
{
    com.freesky.em8.gl.common.isSuccess(response);
}

/**
 * 供Form Load方法使用
 * 
 * @param {}
 *            form
 * @param {}
 *            action
 */
com.freesky.em8.gl.common.formLoadFailureHandler = function(form, action)
{
    com.freesky.em8.gl.common.responseHandler(action.response);
}

/**
 * 供ajax调用使用
 * 
 * @param {}
 *            response
 * @param {}
 *            options
 */
com.freesky.em8.gl.common.ajaxFailureHandler = function(response, options)
{
    com.freesky.em8.gl.common.responseHandler(response);
}

/**
 * 供ajax调用使用
 * 
 * @param {}
 *            conn
 * @param {}
 *            response
 * @param {}
 *            options
 */
com.freesky.em8.gl.common.ajaxRequestException = function(conn, response, options)
{
    com.freesky.em8.gl.common.responseHandler(response);
}
