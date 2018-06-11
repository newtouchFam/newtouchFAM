Ext.grid.XyEditorGridPanel = Ext.extend(Ext.grid.XyGridPanel, {
	clicksToEdit : 2,
	plugins : null,
	isEditor : true,
	XyIsSum :  true,
	detectEdit : false,
	autoEncode : false,
	trackMouseOver : false,
	initComponent : function() {
		Ext.grid.XyEditorGridPanel.superclass.initComponent.call(this);
		if (!this.selModel) {
			this.selModel = new Ext.grid.CellSelectionModel();
		}
		this.activeEditor = null;
		this.addEvents("beforeedit", "afteredit", "validateedit");
		if ( this.XyIsSum === true )
		{
			this.summary = new Ext.grid.XyGridSummary();
			if(this.plugins && this.plugins.length > 0)
			{
				this.plugins[this.plugins.length] = this.summary;
			}
			else
			{
				this.plugins = [this.summary];
			}
		}
	},
	getSummary : function() {
		return this.summary;
	},
	initEvents : function() {
		Ext.grid.XyEditorGridPanel.superclass.initEvents.call(this);
		this.on("bodyscroll", this.stopEditing, this, [true]);
		if (this.clicksToEdit == 1) {
			this.on("cellclick", this.onCellDblClick, this);
		} else {
			if (this.clicksToEdit == "auto" && this.view.mainBody) {
				this.view.mainBody.on("mousedown", this.onAutoEditClick, this);
			}
			this.on("celldblclick", this.onCellDblClick, this);
		}
		this.getGridEl().addClass("xedit-grid");
	},
	onCellDblClick : function(B, C, A) {
		this.startEditing(C, A);
	},
	onAutoEditClick : function(C, B) {
		if (C.button !== 0) {
			return
		}
		var E = this.view.findRowIndex(B);
		var A = this.view.findCellIndex(B);
		if (E !== false && A !== false) {
			this.stopEditing();
			if (this.selModel.getSelectedCell) {
				var D = this.selModel.getSelectedCell();
				if (D && D.cell[0] === E && D.cell[1] === A) {
					this.startEditing(E, A);
				}
			} else {
				if (this.selModel.isSelected(E)) {
					this.startEditing(E, A);
				}
			}
		}
	},
	onEditComplete : function(B, D, A) {
		this.editing = false;
		this.activeEditor = null;
		B.un("specialkey", this.selModel.onEditorKey, this.selModel);
		var C = B.record;
		var F = this.colModel.getDataIndex(B.col);
		D = this.postEditValue(D, A, C, F);
		if (this.colModel.config[B.col].complex !== undefined
				&& this.colModel.config[B.col].complex) {
			var E = {};
			if (D == null) {
				E = {
					grid : this,
					record : C,
					field : F,
					originalValue : A,
					value : D,
					row : B.row,
					column : B.col,
					cancel : false
				};
				if (this.fireEvent("validateedit", E) !== false && !E.cancel) {
					C.set(F, E.value, "", "");
					delete E.cancel;
					this.fireEvent("afteredit", E);
				}

			} else if (D[this.colModel.config[B.col].editor.field.valueField] != "") {
				E = {
					grid : this,
					record : C,
					field : F,
					originalValue : A,
					value : D,
					row : B.row,
					column : B.col,
					cancel : false
				};
				if (this.fireEvent("validateedit", E) !== false && !E.cancel) {
					C
							.set(
									F,
									E.value,
									D[this.colModel.config[B.col].editor.field.displayField],
									D[this.colModel.config[B.col].editor.field.valueField]);
					delete E.cancel;
					this.fireEvent("afteredit", E);
				}
			}
		} else if (this.colModel.config[B.col].datecomplex !== undefined
				&& this.colModel.config[B.col].datecomplex) {
			if (String(D) !== String(A)) {
				var E = {
					grid : this,
					record : C,
					field : F,
					originalValue : A,
					value : D,
					row : B.row,
					column : B.col,
					cancel : false
				};
				if (this.fireEvent("validateedit", E) !== false && !E.cancel) {
					C.set(F, E.value.format("Y-m-d"));
					delete E.cancel;
					this.fireEvent("afteredit", E);
				}
			}
		} else {
			if (String(D) !== String(A)) {
				var E = {
					grid : this,
					record : C,
					field : F,
					originalValue : A,
					value : D,
					row : B.row,
					column : B.col,
					cancel : false
				};
				if (this.fireEvent("validateedit", E) !== false && !E.cancel) {
					C.set(F, E.value);
					delete E.cancel;
					this.fireEvent("afteredit", E);
				}
			}
		}
		this.view.focusCell(B.row, B.col);
	},
	startEditing : function(F, B) {
		this.stopEditing();
		if (this.colModel.isCellEditable(B, F)) {
			this.view.ensureVisible(F, B, true);
			var C = this.store.getAt(F);
			var E = this.colModel.getDataIndex(B);
			var D = {
				grid : this,
				record : C,
				field : E,
				value : C.data[E],
				row : F,
				column : B,
				cancel : false
			};
			if (this.fireEvent("beforeedit", D) !== false && !D.cancel) {
				this.editing = true;
				var A = this.colModel.getCellEditor(B, F);
				if (!A.rendered) {
					A.render(this.view.getEditorParent(A));
				}
(function		() {
					A.row = F;
					A.col = B;
					A.record = C;
					A.on("complete", this.onEditComplete, this, {
								single : true
							});
					A
							.on("specialkey", this.selModel.onEditorKey,
									this.selModel);
					this.activeEditor = A;
					var G = this.preEditValue(C, E);
					A.startEdit(this.view.getCell(F, B), G);
				}).defer(50, this);
			}
		}
	},
	preEditValue : function(A, B) {
		return this.autoEncode && typeof value == "string" ? Ext.util.Format
				.htmlDecode(A.data[B]) : A.data[B];
	},
	postEditValue : function(C, A, B, D) {
		return this.autoEncode && typeof C == "string" ? Ext.util.Format
				.htmlEncode(C) : C;
	},
	stopEditing : function(A) {
		if (this.activeEditor) {
			this.activeEditor[A === true ? "cancelEdit" : "completeEdit"]();
		}
		this.activeEditor = null;
	}
});
Ext.reg('xyeditgrid', Ext.grid.XyEditorGridPanel);