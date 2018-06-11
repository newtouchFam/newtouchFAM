
sm = {};

sm.renderdata = {};
/* 用户状态 */
sm.renderdata.UserStatus = [ [ 0, "正常" ], [ 1, "未激活" ], [ 2, "已锁定" ] ];
/* 角色-应用范围 */
sm.renderdata.RoleType = [ [ 0, "系统级" ], [ 1, "公司级" ] ];


/**
 * Render
 */
sm.render = {};
/**
 * 用户状态
 */
sm.render.UserStatus = function(value)
{
	return ssc.common.RenderUtil.MapRender(value, sm.renderdata.UserStatus);
};

sm.render.RoleType = function(value)
{
	return ssc.common.RenderUtil.MapRender(value, sm.renderdata.RoleType);
};
