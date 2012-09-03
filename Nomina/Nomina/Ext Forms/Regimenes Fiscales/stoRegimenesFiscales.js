/*
 * File: stoRegimenesFiscales.js
 * Date: Wed Aug 29 2012 20:39:21 GMT-0600 (Hora verano, Montañas (México))
 * 
 * This file was generated by Ext Designer version 1.1.2.
 * http://www.sencha.com/products/designer/
 *
 * This file will be auto-generated each and everytime you export.
 *
 * Do NOT hand edit this file.
 */

stoRegimenesFiscales = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        stoRegimenesFiscales.superclass.constructor.call(this, Ext.apply({
            storeId: '',
            idProperty: 'CodigoRegimen',
            root: 'datos',
            api: {
                read: '/Home/listar',
                create: '/Home/crear',
                update: '/Home/guardar',
                destroy: '/Home/eliminar'
            },
            fields: [
                {
                    name: 'CodigoRegimen',
                    type: 'int'
                },
                {
                    name: 'NombreRegimen',
                    type: 'string'
                },
                {
                    name: 'PideCURP',
                    type: 'string'
                },
                {
                    name: 'Activo',
                    type: 'string'
                }
            ]
        }, cfg));
    }
});
new stoRegimenesFiscales();