package com.newtouch.nwfs.gl.vouchermanager.entity;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class BaseTreeData2Entity
{
    @Id
    protected String id;
    protected String code;
    protected String name;
    protected String text;
    protected int leaf;
    
    public BaseTreeData2Entity() 
    {
		super();
	}

	public BaseTreeData2Entity(String id, String code, String name,
			String text, int leaf) 
    {
		super();
		this.id = id;
		this.code = code;
		this.name = name;
		this.text = text;
		this.leaf = leaf;
	}

	public String getId()
    {
        return id;
    }
    
    public void setId(String id)
    {
        this.id = id;
    }
    
    public String getCode()
    {
        return code;
    }
    
    public void setCode(String code)
    {
        this.code = code;
    }
    
    public String getName()
    {
        return name;
    }
    
    public void setName(String name)
    {
        this.name = name;
    }
    
    public String getText()
    {
        return text;
    }
    
    public void setText(String text)
    {
        this.text = text;
    }

	public int getLeaf()
	{
		return leaf;
	}

	public void setLeaf(int leaf)
	{
		this.leaf = leaf;
	}
          
}
