package com.newtouch.nwfs.gl.vouchermanager.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tgl_voucher_numberings")
public class NumberingEntity
{
    @Id
    private String uqnumberingid;
    private String varname;
    private String varvoucherhave;
    private String varvoucherno;
    private String vardebithave;
    private String vardebitno;
    private String varcredithave;
    private String varcreditno;
    
    public String getUqnumberingid()
    {
        return uqnumberingid;
    }
    public void setUqnumberingid(String uqnumberingid)
    {
        this.uqnumberingid = uqnumberingid;
    }
    public String getVarname()
    {
        return varname;
    }
    public void setVarname(String varname)
    {
        this.varname = varname;
    }
    public String getVarvoucherhave()
    {
        return varvoucherhave;
    }
    public void setVarvoucherhave(String varvoucherhave)
    {
        this.varvoucherhave = varvoucherhave;
    }
    public String getVarvoucherno()
    {
        return varvoucherno;
    }
    public void setVarvoucherno(String varvoucherno)
    {
        this.varvoucherno = varvoucherno;
    }
    public String getVardebithave()
    {
        return vardebithave;
    }
    public void setVardebithave(String vardebithave)
    {
        this.vardebithave = vardebithave;
    }
    public String getVardebitno()
    {
        return vardebitno;
    }
    public void setVardebitno(String vardebitno)
    {
        this.vardebitno = vardebitno;
    }
    public String getVarcredithave()
    {
        return varcredithave;
    }
    public void setVarcredithave(String varcredithave)
    {
        this.varcredithave = varcredithave;
    }
    public String getVarcreditno()
    {
        return varcreditno;
    }
    public void setVarcreditno(String varcreditno)
    {
        this.varcreditno = varcreditno;
    }
    
}
