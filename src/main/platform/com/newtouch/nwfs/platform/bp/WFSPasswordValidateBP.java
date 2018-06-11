package com.newtouch.nwfs.platform.bp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newtouch.cloud.security.ifx.IPasswordValidateBP;
import com.newtouch.cloud.security.result.ValidateResult;
import com.newtouch.nwfs.platform.encrypt.PasswordEncrypt;

/**
 * 密码验证服务
 */
@Service
@Transactional
public class WFSPasswordValidateBP
{
	@Autowired
	private IPasswordValidateBP passwordValidateBP;

	/**
	 * 未登录的情况下，输入旧密码，修改新密码
	 * @param loginName		账号登录名称
	 * @param password_old	旧密码(明文)
	 * @param password_new	新密码(明文)
	 * @param sessionID		浏览器SessionID
	 * @return
	 */
	public ValidateResult updatePassword(String loginName, String password_old, String password_new,
			String sessionID) throws Exception
	{
		/**
		 * 解密
		 */
		String password_Old_Decrypted = PasswordEncrypt.decrypt(password_old, 12);
		String password_New_Decrypted = PasswordEncrypt.decrypt(password_new, 12);

		ValidateResult result =  this.passwordValidateBP.loginValidateAndUpdatePassword(loginName, password_Old_Decrypted, password_New_Decrypted, sessionID);

		/**
		 * 处理返回信息和返回标志
		 */
		return result;
	}
}