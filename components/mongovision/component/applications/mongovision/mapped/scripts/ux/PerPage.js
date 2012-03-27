//
// Copyright 2010-2011 Three Crickets LLC.
//
// The contents of this file are subject to the terms of the Apache License
// version 2.0: http://www.opensource.org/licenses/apache2.0.php
// 
// Alternatively, you can obtain a royalty free commercial license with less
// limitations, transferable or non-transferable, directly from Three Crickets
// at http://threecrickets.com/
//

/**
 * Ext.ux.PerPage
 *
 * A PagingToolbar plugin allowing the user to change the page size with a
 * combobox.
 *
 * Config options: 'pageSizeOptions' is an array of the options, 'label' is the
 * text to show after the combobox.
 */

Ext.define('Ext.ux.PerPage', {
	constructor: function(config) {
		this.data = [];
		for (var o = 0, length = config.pageSizeOptions.length; o < length; o++) {
			this.data.push({id: String(config.pageSizeOptions[o])});
		}
		this.label = config.label;
	},
	
	init: function(toolbar) {
		toolbar.add({
			// ComboBox to allow user to change page size; this seems overly complicated,
			// but that's just because the Ext JS ComboBox is such a flexible widget ;)
			xtype: 'combo',
			store: Ext.create('Ext.data.Store', {
				fields: ['id'],
				data: this.data
			}),
			queryMode : 'local',
			value: String(toolbar.store.pageSize),
			width: 60,
			displayField: 'id',
			valueField: 'id',
			editable: false,
			forceSelection: true,
			listeners: {
				select: Ext.bind(function(combo, selections) {
					this.store.pageSize = parseInt(selections[0].get('id'));
					this.store.load();
					// Undocumented function
					//this.doLoad(this.cursor);
				}, toolbar)
			}
		}, {
			xtype: 'tbtext',
			text: this.label
		}, '-');
	}
});
