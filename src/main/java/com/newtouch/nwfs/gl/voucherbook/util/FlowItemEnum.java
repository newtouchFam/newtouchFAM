package com.newtouch.nwfs.gl.voucherbook.util;

public class FlowItemEnum 
{
	String FlowItemEnumNumeric(int index)
	{
	    String[] num ={  "一、", "二、", "三、", "四、", "五、", "六、", "七、", "八、", "九、", "十、"};
	    return num[index];
	}
	
	String spaceIndex(int index)
	{
	    String[] num ={  "", "    ", "        ", 
	    		"            ", "                ", 
	    		"                    ", "                        ", 
	    		"                            ", "                                ", 
	    		"                                        "};
	    return num[index];
	}

    public String change(int num)
    {
    	String han = FlowItemEnumNumeric(num);
    	return han;
    }
    
    public String spaceChange(int num)
    {
    	String han = spaceIndex(num);
    	return han;
    }
    
    public static void main(String[] args)
    {
    	FlowItemEnum f = new FlowItemEnum();
    	System.out.println(f.change(1));
    }
}
