Ext.namespace('Freesky.Common');
Freesky.Common.XyGridUtil = function() {
	return {
		add : function(grid, record, toRow) {
			grid.stopEditing();
			var p = new Ext.data.XyCalcRecord({});
			var sm = grid.getSelectionModel();
			p.data = record.data;
			grid.getStore().insert(toRow, record);
			sm.selectRow(toRow);
		},
		copy : function(grid, emptyRecord, toRow, config) {
			grid.stopEditing();
			var sm = grid.getSelectionModel();
			var record = sm.getSelected();
			if (record == null) {
				return;
			}
			emptyRecord.beginEdit();
			emptyRecord.data = record.copy().data;
            if ( typeof(config) != 'undefined' )
            {
                emptyRecord.data = Ext.apply(emptyRecord.data, config);    
            }
			grid.getStore().insert(toRow, emptyRecord);
			emptyRecord.commit();
			emptyRecord.endEdit();
			sm.selectRow(toRow);
		},
		del : function(grid) {
			grid.stopEditing();
			var sm = grid.getSelectionModel();
			var record = sm.getSelected();
			if (record == null) {
				return;
			}
			var hasPrevious = sm.hasPrevious();
			if (hasPrevious) {
				grid.getSelectionModel().selectPrevious();
				grid.getStore().remove(record);
			} else {
				grid.getStore().remove(record);
				grid.getSelectionModel().selectFirstRow();
			}
		},
		refreshRowNum : function(grid, colIndex) {
			for (var i = 0, length = grid.getStore().getCount(); i < length; i++) {
				grid.getView().getCell(i, colIndex).firstChild.innerHTML = i
						+ 1;
			}
		}
	}
}();