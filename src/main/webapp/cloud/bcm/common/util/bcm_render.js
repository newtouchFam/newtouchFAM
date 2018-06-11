bcm = {};


/**
 * 预算控制RenderMapData
 */
bcm.renderdata = {};
/*预算控制方式*/
bcm.renderdata.CtrlType = [ [ -1, "不控制" ], [ 0, "柔性" ], [ 1, "刚性" ] ];
/*预算控制周期*/
bcm.renderdata.CtrlPeriod = [ [ 1, '月控' ], [ 2, '季控' ], [ 3, '半年控' ], [ 4, '年控' ] ];
/*预算控制属性*/
bcm.renderdata.CtrlAttr = [ [ 1, '滚动控制' ], [ 2, '本期控制' ] ];


/**
 * Render
 */
bcm.render = {};
/**
 * 预算控制方式Render
 */
bcm.render.CtrlType = function(value)
{
	return ssc.common.RenderUtil.MapRender(value, bcm.renderdata.CtrlType);
};
/**
 * 预算控制周期Render
 */
bcm.render.CtrlPeriod = function(value)
{
	return ssc.common.RenderUtil.MapRender(value, bcm.renderdata.CtrlPeriod);
};
/**
 * 预算控制属性Render
 */
bcm.render.CtrlAttr = function(value)
{
	return ssc.common.RenderUtil.MapRender(value, bcm.renderdata.CtrlAttr);
};
