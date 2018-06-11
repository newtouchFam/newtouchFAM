package com.newtouch.nwfs.gl.vouchermanager.util;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import net.sf.json.JSONObject;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import com.newtouch.cloud.common.EntityUtil;

/**
 * 
 * @author rockyee
 * 
 */
public class CommonHelper
{
    /**
     * 禁止实例化
     */
    private CommonHelper()
    {

    }

    /**
     * 默认除法运算精度
     */
    private static final int DEF_DIV_SCALE = 10;

    /**
     * 四舍五入
     * 
     * @param d
     * @param decimals
     * @return
     */
    public static double round(double d, int scale)
    {
        return round(new BigDecimal(Double.toString(d)), scale).doubleValue();
    }

    /**
     * 四舍五入
     * 
     * @param bd
     * @param scale
     * @return
     */
    public static BigDecimal round(BigDecimal bd, int scale)
    {
        if (scale < 0)
        {
            throw new IllegalArgumentException("参数scale只能为0或正整数");
        }
        return bd.setScale(scale, RoundingMode.HALF_UP);
    }

    /**
     * 
     * 提供精确的加法运算。
     * 
     * @param d1
     *            被加数
     * 
     * @param d2
     *            加数
     * 
     * @return 两个参数的和
     */

    public static double add(double d1, double d2)
    {
        BigDecimal bd1 = new BigDecimal(Double.toString(d1));
        BigDecimal bd2 = new BigDecimal(Double.toString(d2));

        return bd1.add(bd2).doubleValue();
    }

    /**
     * 提供精确的减法运算。
     * 
     * @param d1
     *            被减数
     * @param d2
     *            减数
     * @return 两个参数的差
     */

    public static double sub(double d1, double d2)
    {
        BigDecimal bd1 = new BigDecimal(Double.toString(d1));
        BigDecimal bd2 = new BigDecimal(Double.toString(d2));

        return bd1.subtract(bd2).doubleValue();
    }

    /**
     * 
     * 提供精确的乘法运算。
     * 
     * @param d1
     *            被乘数
     * 
     * @param d2
     *            乘数
     * 
     * @return 两个参数的积
     */

    public static double mul(double d1, double d2)
    {
        BigDecimal bd1 = new BigDecimal(Double.toString(d1));
        BigDecimal bd2 = new BigDecimal(Double.toString(d2));

        return bd1.multiply(bd2).doubleValue();
    }

    /**
     * 
     * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到小数点以后10位，以后的数字四舍五入。
     * 
     * @param d1
     *            被除数
     * 
     * @param d2
     *            除数
     * 
     * @return 两个参数的商
     */

    public static double div(double d1, double d2)
    {
        return div(d1, d2, DEF_DIV_SCALE);
    }

    /**
     * 
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指定精度，以后的数字四舍五入。
     * 
     * @param d1
     *            被除数
     * 
     * @param d2
     *            除数
     * 
     * @param scale
     *            表示表示需要精确到小数点以后几位。
     * 
     * @return 两个参数的商
     */
    public static double div(double d1, double d2, int scale)
    {
        if (scale < 0)
        {
            throw new IllegalArgumentException("参数scale只能为0或正整数");
        }
        BigDecimal bd1 = new BigDecimal(Double.toString(d1));
        BigDecimal bd2 = new BigDecimal(Double.toString(d2));

        return bd1.divide(bd2, scale, RoundingMode.HALF_UP).doubleValue();
    }

    /**
     * 左补齐字符串
     * 
     * @param strSource
     *            原字符串
     * @param nTotalSize
     *            补齐后的总长度
     * @param ch
     *            要补齐的字符
     * @return
     */
    public static String padLeft(String strSource, int nTotalSize, char ch)
    {
        int nCount = (strSource != null ? nTotalSize - strSource.length() : nTotalSize);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < nCount; i++)
        {
            sb.append(ch);
        }
        if (strSource != null) sb.append(strSource);

        return sb.toString();
    }

    /**
     * 右补齐字符串
     * 
     * @param strSource
     *            原字符串
     * @param nTotalSize
     *            补齐后的总长度
     * @param ch
     *            要补齐的字符
     * @return
     */
    public static String padRight(String strSource, int nTotalSize, char ch)
    {
        int nCount = (strSource != null ? nTotalSize - strSource.length() : nTotalSize);

        StringBuilder sb = new StringBuilder();
        if (strSource != null) sb.append(strSource);
        for (int i = 0; i < nCount; i++)
        {
            sb.append(ch);
        }

        return sb.toString();
    }

    /***
     * 验证变量值是否为空或者NULL
     * 
     * @param value
     * @return 返回true表示为空或者NULL
     */
    public static <T> Boolean isNullOrEmpty(T value) throws Exception
    {
        if (value == null)
        {
            return true;
        }
        if (value instanceof String)
        {
            if ("".equals(((String) value).trim())) return true;
        }
        if (value instanceof HashMap<?, ?>)
        {
            if (((HashMap<?, ?>) value).isEmpty()) return true;
        }

        return false;
    }

    /**
     * 获取查询条件实体
     * 
     * @param <T>
     * @param jsonString
     *            为空时返回空的实体
     * @param c
     * @return
     */
    public static <T> T getFilter(String jsonString, Class<T> c) throws Exception
    {
        if (jsonString == null || jsonString.equals(""))
        {
            try
            {
                return c.newInstance();
            }
            catch (InstantiationException e)
            {
                throw new Exception("不能实例化该类，InstantiationException异常");
            }
            catch (IllegalAccessException e)
            {
                throw new Exception("不能实例化该类，IllegalAccessException异常");
            }
        }
        else
        {
        	return EntityUtil.EntityFromJSON(jsonString, c);
        }
    }
    
    public static String getJsonValue(JSONObject jo, String key) throws Exception
    {
        Object obj = jo.get(key);
        if (obj == null)
            throw new Exception("参数错误，未包含" + key + "节点");
        
        return obj.toString();
    }

    
    public static <T> String getDbName(Class<T> cls, String filedName) throws Exception
    {
        String name = "";
        
        List<Field> lFileds = new ArrayList<Field>();
        lFileds.addAll(Arrays.asList(cls.getSuperclass().getDeclaredFields()));
        lFileds.addAll(Arrays.asList(cls.getDeclaredFields()));
        
        Map<String,AttributeOverride> mAttr = new HashMap<String,AttributeOverride>();
        AttributeOverrides atts = cls.getAnnotation(AttributeOverrides.class);
        if (atts != null)
        {
            AttributeOverride att[] = atts.value();
            for (int i = 0; i < att.length; i++)
            {
                AttributeOverride a = att[i];
                if (!isNullOrEmpty(a.name())) mAttr.put(a.name(), a); 
            }
        }
        
        for(Field f : lFileds)
        {
            name = "";
            if (filedName.equalsIgnoreCase(f.getName()))
            {
                Column c = f.getAnnotation(Column.class);
                if (c != null)
                {
                    if (!isNullOrEmpty(c.name())) name = c.name();
                }
                
                if (mAttr.containsKey(f.getName()))
                {
                    AttributeOverride att = mAttr.get(f.getName());
                    Column cc = att.column();
                    if (cc != null)
                    {
                        if (!isNullOrEmpty(cc.name())) name = cc.name();
                    }
                }
                
                if (isNullOrEmpty(name)) name = f.getName();
                break;
            }            
        }
        return name;
    }
    /**
     * 从xml串构造Document对象
     * 
     * @param strXml
     * @return
     */
    public static Document getDocument(String strXml) throws Exception
    {
        Document document = null;

        if (strXml.length() == 0)
        {
            throw new Exception("xml串为空，无法构建实体对象！");
        }
        try
        {
            document = DocumentHelper.parseText(strXml);
        }
        catch (DocumentException e)
        {
            throw new Exception("xml格式不正确：" + e.getMessage());
        }
        return document;

    }
    /**
     * 将8位的日期转化为10位的日期格式
     * @param date
     * @return
     */
    public static String parseDate(String date)
    {
        String date_10 = " ";
        if (date == null || " ".equals(date) || date.length() != 8)
        {
            date_10 = " ";
        }
        else
        {
            String y = date.substring(0, 4);
            String m = date.substring(4, 6);
            String d = date.substring(6, 8);
            date_10 = y + "-" + m + "-" + d;
        }
        return date_10;
    }
    
    /**
     * 关闭CallableStatement
     * @param proc
     */
    public static void closeCallableStatement(CallableStatement proc)
    {
        if (proc != null)
        {
            try
            {
                proc.close();
            }
            catch (SQLException e)
            {
                e.printStackTrace();
            }
        }
    }
    
    /**
     * 判断字符串是否超出指定的小数位
     * @param value
     * @param scale
     * @return
     */
    public static boolean isOverScale(String value, int scale)
    {
        boolean result = false;
        String[] strs = value.split("[.]");
        if (strs[1].length() > scale)
        {
            result = true;
        }
        return result;
    }
    
    /**
     * 判断字符串是否超出指定的小数位
     * @param value
     * @param scale
     * @return
     */
    public static boolean isOverScale(BigDecimal value, int scale)
    {
        boolean result = false;
        if(value.scale() > scale)
        {
            result = true;
        }
        return result;
    }
    
    public static boolean isInDate(Date date, String strDateBegin,  
            String strDateEnd) 
    {  
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
        String strDate = sdf.format(date);  
        // 截取当前时间时分秒  
        int strDateH = Integer.parseInt(strDate.substring(11, 13));  
        int strDateM = Integer.parseInt(strDate.substring(14, 16));  
        int strDateS = Integer.parseInt(strDate.substring(17, 19));  
        // 截取开始时间时分秒  
        int strDateBeginH = Integer.parseInt(strDateBegin.substring(0, 2));  
        int strDateBeginM = Integer.parseInt(strDateBegin.substring(3, 5));  
        int strDateBeginS = Integer.parseInt(strDateBegin.substring(6, 8));  
        // 截取结束时间时分秒  
        int strDateEndH = Integer.parseInt(strDateEnd.substring(0, 2));  
        int strDateEndM = Integer.parseInt(strDateEnd.substring(3, 5));  
        int strDateEndS = Integer.parseInt(strDateEnd.substring(6, 8));  
        if ((strDateH >= strDateBeginH && strDateH <= strDateEndH)) {  
            // 当前时间小时数在开始时间和结束时间小时数之间  
            if (strDateH > strDateBeginH && strDateH < strDateEndH) {  
                return true;  
                // 当前时间小时数等于开始时间小时数，分钟数在开始和结束之间  
            } else if (strDateH == strDateBeginH && strDateM >= strDateBeginM  
                    && strDateM <= strDateEndM) {  
                return true;  
                // 当前时间小时数等于开始时间小时数，分钟数等于开始时间分钟数，秒数在开始和结束之间  
            } else if (strDateH == strDateBeginH && strDateM == strDateBeginM  
                    && strDateS >= strDateBeginS && strDateS <= strDateEndS) {  
                return true;  
            }  
            // 当前时间小时数大等于开始时间小时数，等于结束时间小时数，分钟数小等于结束时间分钟数  
            else if (strDateH >= strDateBeginH && strDateH == strDateEndH  
                    && strDateM <= strDateEndM) {  
                return true;  
                // 当前时间小时数大等于开始时间小时数，等于结束时间小时数，分钟数等于结束时间分钟数，秒数小等于结束时间秒数  
            } else if (strDateH >= strDateBeginH && strDateH == strDateEndH  
                    && strDateM == strDateEndM && strDateS <= strDateEndS) {  
                return true;  
            } else {  
                return false;  
            }  
        } else {  
            return false;  
        }  
    }  
}
