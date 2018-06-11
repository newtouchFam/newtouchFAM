package com.newtouch.nwfs.gl.vouchermanager.util;

import java.text.SimpleDateFormat;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;
public class JsonDateValueProcessor  implements JsonValueProcessor 
{
	private String format="yyyy-MM-dd";
	public Object processArrayValue(Object arg0, JsonConfig arg1) {
	// TODO Auto-generated method stub
	return process(arg0);
	}


	private Object process(Object arg0) {
	// TODO Auto-generated method stub
	SimpleDateFormat sdf=new SimpleDateFormat(format);
	return sdf.format(arg0);
	}


	public Object processObjectValue(String arg0, Object arg1, JsonConfig arg2) {
	// TODO Auto-generated method stub
	return process(arg1);
	}
}
