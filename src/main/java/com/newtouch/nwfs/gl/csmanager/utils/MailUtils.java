package com.newtouch.nwfs.gl.csmanager.utils;

import java.io.IOException;
import java.util.Date;
import java.util.Properties;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

/**
 * 邮件工具类
 * @author YH
 *
 */	
public class MailUtils {
    public static Session createSession(Properties prop, final String username,  final String password) {
        // 创建验证器
        Authenticator auth = new Authenticator() {
        	@Override  
            protected PasswordAuthentication getPasswordAuthentication() {  
                return new PasswordAuthentication(username, password);
            }
        };
        // 获取session对象
        return Session.getInstance(prop, auth);
    }
    
    public static void setInfo(String host, Properties prop) {
    	//Properties prop = new Properties();
    	prop.setProperty("mail.smtp.host", host);        
	    prop.setProperty("mail.smtp.auth", "true"); 
	    // 发送邮件协议名称  
	    prop.setProperty("mail.transport.protocol", "smtp"); 
	    prop.setProperty("mail.smtp.port", "465");
	     
	    prop.setProperty("mail.smtp.ssl.enable", "true");//设置是否使用ssl安全连接  ---一般都
	    prop.setProperty("mail.debug", "true");
		    	
    }
    
    /**
     * 发送指定的邮件
     * 
     * @param mail
     */
    public static void send(Session session, final Mail mail) throws MessagingException,
            IOException {

        MimeMessage msg = new MimeMessage(session);// 创建邮件对象
        msg.setFrom(new InternetAddress(mail.getFrom()));// 设置发件人
        msg.setRecipients(RecipientType.TO, mail.getToAddress());// 设置收件人
        msg.setSentDate(new Date());// 设置发信时间

        msg.setSubject(mail.getSubject());// 设置主题

        Multipart parts=new MimeMultipart();
   	     BodyPart part=new MimeBodyPart();// 创建部件集对象
        part.setContent(mail.getContent(), "text/html;charset=utf-8");// 设置邮件文本内容
        parts.addBodyPart(part);// 把部件添加到部件集中

        msg.setContent(parts);// 给邮件设置内容
        Transport.send(msg);// 发邮件
    }
}