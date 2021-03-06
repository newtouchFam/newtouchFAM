Ext.namespace("Ext.grid"); 

Ext.grid.XyGridSummary = function(config) {
    Ext.apply(this, config);
};

Ext.extend(Ext.grid.XyGridSummary, Ext.util.Observable, {
	
  init : function(grid, columnModel) {
    this.grid = grid;
    this.cm = columnModel || grid.getColumnModel();
    this.view = grid.getView();
    this.sumData = {};
    var v = this.view;
	
    v.onLayout = this.onLayout; // override GridView's onLayout() method
    v.afterMethod('render', this.refreshSummary, this);
    v.afterMethod('refresh', this.refreshSummary, this);
    v.afterMethod('setSumValue', this.test, this);
    v.afterMethod('syncScroll', this.syncSummaryScroll, this);
    v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
    v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
    v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
    v.afterMethod('onUpdate', this.refreshSummary, this);
    v.afterMethod('onRemove', this.refreshSummary, this);
    grid.store.on('load', this.refreshSummary, this);
    grid.store.on('add', this.refreshSummary, this);
    grid.store.on('remove', this.refreshSummary, this);
    grid.store.on('clear', this.refreshSummary, this);

    if (!this.rowTpl) {
      this.rowTpl = new Ext.Template(
        '<div class="x-grid3-summary-row x-grid3-gridsummary-row-offset">',
          '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
            '<tbody><tr>{cells}</tr></tbody>',
          '</table>',
        '</div>'
      );
      this.rowTpl.disableFormats = true;
    }
    this.rowTpl.compile();

    if (!this.cellTpl) {
      this.cellTpl = new Ext.Template(
        '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
          '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on">{value}</div>',
        "</td>"
      );
      this.cellTpl.disableFormats = true;
    }
    this.cellTpl.compile();
  },
  /**
   * 组装合计数据，
   * @param {} rs store的数据集
   * @param {} cs 
   * @return {}
   */
  calculate : function(rs, cs) {
    var data = {}, r, c, cfg = this.cm.config, cf;
    for (var i = 0, len = cs.length; i < len; i++) {
      c = cs[i];
      cf = cfg[i];
      data[c.name] = 0;
      for (var j = 0, jlen = rs.length; j < jlen; j++) {
        r = rs[j];
        if (cf && cf.summaryType) {
          if(cf.summaryType != '合计')
          {
        	  data[c.name] = Ext.grid.XyGridSummary.Calculations[cf.summaryType](data[c.name], r, c.name);
          }
          else
          {
        	  data[c.name] = "合计";
          }
        }
      }
      if(cf && cf.summaryType)
      {
      	if ( cf.XySumToCom && Ext.getCmp(cf.XySumToCom))
      	{
	      	Ext.getCmp(cf.XySumToCom).setValue(data[c.name]);
	    	Ext.getCmp(cf.XySumToCom).fireEvent("change",Ext.getCmp(cf.XySumToCom),data[c.name],this.sumData[c.name]);
      	}
      }
    }
    
    return data;
  },

  onLayout : function(vw, vh) {
    if ('number' != Ext.type(vh)) { 
      return;
    }
    if (!this.grid.getGridEl().hasClass('x-grid-hide-gridsummary')) {
      this.scroller.setHeight(vh - this.summary.getHeight());
    }
  },

  syncSummaryScroll : function() {
    var mb = this.view.scroller.dom;
    this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft;
    this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft; 
  },

  doWidth : function(col, w, tw) {
    var s = this.view.summary.dom;
    s.firstChild.style.width = tw;
    s.firstChild.rows[0].childNodes[col].style.width = w;
  },

  doAllWidths : function(ws, tw) {
    var s = this.view.summary.dom, wlen = ws.length;
    s.firstChild.style.width = tw;
    cells = s.firstChild.rows[0].childNodes;
    for (var j = 0; j < wlen; j++) {
      cells[j].style.width = ws[j];
    }
  },
  setSum:function(name,data)
  {
    var v = {};   
    v[name] = data;
    Ext.apply(this.sumData,v);
  },
  getSum:function()
  {
  	return this.sumData;
  },
  doHidden : function(col, hidden, tw) {
    var s = this.view.summary.dom;
    var display = hidden ? 'none' : '';
    s.firstChild.style.width = tw;
    s.firstChild.rows[0].childNodes[col].style.display = display;
  },
  putSumInfo:null,
  setSumValue : function(jsonV) {
    var cs = this.view.getColumnData();
    var buf = [], c, p = {}, last = cs.length-1;

    for (var i = 0, len = cs.length; i < len; i++) {
      c = cs[i];
      p.id = c.id; 
      p.style = c.style;
      p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
      if (jsonV&&jsonV[c.name]) {
		p.value = jsonV[c.name];
      } else {
        p.value = '';
      }
      if (p.value == undefined || p.value === "") p.value = " ";
      buf[buf.length] = this.cellTpl.apply(p);
    }

    if (!this.view.summaryWrap) {
      this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
        tag: 'div',
        cls: 'x-grid3-gridsummary-row-inner'
      }, true);
    } else {
      this.view.summary.remove();
    }
    this.putSumInfo = this.rowTpl.apply({
      tstyle: 'width:' + this.view.getTotalWidth() + ';',
      cells: buf.join('')
    });
    this.view.summary = this.view.summaryWrap.insertHtml('afterbegin',this.putSumInfo, true);
  },
  refreshSumValue:function() {
    if (!this.view.summaryWrap) {
      this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
        tag: 'div',
        cls: 'x-grid3-gridsummary-row-inner'
      }, true);
    } else {
      this.view.summary.remove();
    }
    this.view.summary = this.view.summaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
  },
  renderSummary : function(o, cs) {
    cs = cs || this.view.getColumnData();
    var cfg = this.cm.config;
    var buf = [], c, p = {}, cf, last = cs.length-1;

    for (var i = 0, len = cs.length; i < len; i++) {
      c = cs[i];
      cf = cfg[i];
      p.id = c.id;
      p.style = c.style;
      p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
      if(typeof(cf)!="undefined" && cf.summaryType == '合计')
      {
    	p.value = '合计';
    	this.setSum(c.name,o.data[c.name]);
      }
      else if (typeof(cf)!="undefined" && (cf.summaryType || cf.summaryRenderer)) 
      {
        p.value = (cf.summaryRenderer || c.renderer)(o.data[c.name], p, o);
        this.setSum(c.name,o.data[c.name]);
      } 
      else 
      {
        p.value = '';
      }
      if (p.value == undefined || p.value === "") p.value = "&#160;";
      buf[buf.length] = this.cellTpl.apply(p);
    }

    return this.rowTpl.apply({
      tstyle: 'width:' + this.view.getTotalWidth() + 'px;',
      cells: buf.join('')
    });
  },
  /**
   * 刷新合计显示
   */
  refreshSummary : function() {
  	if(this.putSumInfo){
  		this.refreshSumValue(this.putSumInfo);
  		return;
  	}
  	var g = this.grid, ds = g.store;
    var cs = this.view.getColumnData();
    var rs = ds.getRange();
    var data = this.calculate(rs, cs);
    var buf = this.renderSummary({data: data}, cs);
    
    if (!this.view.summaryWrap) {
      this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
        tag: 'div',
        cls: 'x-grid3-gridsummary-row-inner'
      }, true);
    } else {
      this.view.summary.remove();
    }
    this.view.summary = this.view.summaryWrap.insertHtml('afterbegin', buf, true);
  },
  

  toggleSummary : function(visible) { // true to display summary row
    var el = this.grid.getGridEl();
    if (el) {
      if (visible === undefined) {
        visible = el.hasClass('x-grid-hide-gridsummary');
      }
      el[visible ? 'removeClass' : 'addClass']('x-grid-hide-gridsummary');

      this.view.layout(); // readjust gridview height
    }
  },

  getSummaryNode : function() {
    return this.view.summary
  }

});

Ext.grid.XyGridSummary.Calculations = {
  'sum' : function(v, record, field) {
  	return Ext.num(Number(v),0)+ Ext.num(Number(record.data[field]), 0);
  },
  'count' : function(v, record, field, data) {
    return data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
  },

  'max' : function(v, record, field, data) {
    var v = record.data[field];
    var max = data[field+'max'] === undefined ? (data[field+'max'] = v) : data[field+'max'];
    return v > max ? (data[field+'max'] = v) : max;
  },

  'min' : function(v, record, field, data) {
    var v = record.data[field];
    var min = data[field+'min'] === undefined ? (data[field+'min'] = v) : data[field+'min'];
    return v < min ? (data[field+'min'] = v) : min;
  },

  'average' : function(v, record, field, data) {
    var c = data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
    var t = (data[field+'total'] = ((data[field+'total'] || 0) + (record.data[field] || 0)));
    return t === 0 ? 0 : t / c;
  }
}