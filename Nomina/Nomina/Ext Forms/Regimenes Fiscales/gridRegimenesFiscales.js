/*
 * File: gridRegimenesFiscales.js
 * Date: Wed Aug 29 2012 19:23:24 GMT-0600 (Hora verano, Montañas (México))
 * 
 * This file was generated by Ext Designer version 1.1.2.
 * http://www.sencha.com/products/designer/
 *
 * This file will be generated the first time you export.
 *
 * You should implement event handling and custom methods in this
 * class.
 */

gridRegimenesFiscales = Ext.extend(gridRegimenesFiscalesUi, {
    initComponent: function() {
        gridRegimenesFiscales.superclass.initComponent.call(this);
		
		this.store=new stoRegimenesFiscales({			
			writer:new Ext.data.JsonWriter({
				encode: true,
				writeAllFields: true // write all fields, not just those that changed
			})
		});
		var defaultData = {
			CodigoRegimen : 0,
			NombreRegimen : '',
			PideCURP : 'Si',
			Activo : 'Si'
		}
		
		this.bottomToolbar.bind(this.store);
		this.bottomToolbar.doRefresh();
		
		var p =  new this.store.recordType(defaultData, 0);
		console.log(p);
		this.btnNuevo.on('click',function(){
						console.log(p);
						this.store.insert(0,p);
						},this
		
		);
		
		
    }
});
Ext.reg('gridRegimenesFiscales',gridRegimenesFiscales);
