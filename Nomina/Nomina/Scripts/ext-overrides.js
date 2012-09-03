Ext.ns('Ext.ux');
 
 Ext.ux.AspNetJsonReader = Ext.extend(Ext.data.JsonReader, {
    read: function(response) {
	
        var json = response.responseText;
        var o = Ext.util.JSON.decode(json);
        o = o.d; // Take care of the extra wrapper that ASP.NET adds
        if (!o) {
            throw { message: "JsonReader.read: Json object not found" };
        }
        return this.readRecords(o);
    }
});

Ext.ux.AspNetHttpProxy = Ext.extend(Ext.data.HttpProxy, {
	doRequest : function(action, rs, params, reader, cb, scope, arg) {
        var  o = {
            method: (this.api[action]) ? this.api[action]['method'] : undefined,
            request: {
                callback : cb,
                scope : scope,
                arg : arg
            },
            reader: new Ext.ux.AspNetJsonReader(reader.meta),
            callback : this.createCallback(action, rs),
            scope: this
        };

        // If possible, transmit data using jsonData || xmlData on Ext.Ajax.request (An installed DataWriter would have written it there.).
        // Use std HTTP params otherwise.
        
        o.jsonData = params;
        
        // Set the connection url.  If this.conn.url is not null here,
        // the user must have overridden the url during a beforewrite/beforeload event-handler.
        // this.conn.url is nullified after each request.
        this.conn.url = this.buildUrl(action, rs);

        if(this.useAjax){

            Ext.applyIf(o, this.conn);

            // If a currently running request is found for this action, abort it.
            if (this.activeRequest[action]) {
                ////
                // Disabled aborting activeRequest while implementing REST.  activeRequest[action] will have to become an array
                // TODO ideas anyone?
                //
                //Ext.Ajax.abort(this.activeRequest[action]);
            }
            this.activeRequest[action] = Ext.Ajax.request(o);
        }else{
            this.conn.request(o);
        }
        // request is sent, nullify the connection url in preparation for the next request
        this.conn.url = null;
    },
	listeners:{
		exception:function(){
		}
	}
});




Ext.ux.TreeLoaderAsp = Ext.extend(Ext.tree.TreeLoader, {
    requestData: function (node, callback, scope) {
        if (this.fireEvent("beforeload", this, node, callback) !== false) {
            if (this.directFn) {
                var args = this.getParams(node);
                args.push(this.processDirectResponse.createDelegate(this, [{ callback: callback, node: node, scope: scope}], true));
                this.directFn.apply(window, args);
            } else {
				
				if (this.objConf){ // LMNT - Objeto de configuracion con parametros a enviar en el request
					this.jsonData = Ext.apply(this.objConf, { node:node.id });
				} else {
					this.jsonData = this.getParams(node);
				}
				
                this.transId = Ext.Ajax.request({
                    method: this.requestMethod,
                    url: this.dataUrl || this.url,
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    //jsonData: this.getParams(node),
					jsonData: this.jsonData,
                    success: this.handleResponse,
                    failure: this.handleFailure,
                    scope: this,
                    argument: { callback: callback, node: node, scope: scope}
                });
            }
        } else {
            // if the load is cancelled, make sure we notify
            // the node that we are done
            this.runCallback(callback, scope || node, []);
        }
    },

    processResponse: function (response, node, callback, scope) {
        var json = response.responseText;
        try {
            var o = response.responseData || Ext.decode(json);
            o = o.d;
            node.beginUpdate();
            for (var i = 0, len = o.length; i < len; i++) {
                var n = this.createNode(o[i]);
                if (n) {
                    node.appendChild(n);
                }
            }
            node.endUpdate();
            this.runCallback(callback, scope || node, [node]);
        } catch (e) {
            this.handleFailure(response);
        }
    }
});

Ext.reg('treeloaderasp',Ext.ux.TreeLoaderAsp);


Ext.override(Ext.Button, {
	allowDepress: false
});


Ext.override(Ext.form.BasicForm, {
	getFieldValues : function(form) {
		var fElements = this.el.dom.elements, 
			name, 
			data = {}, 
			type;

		Ext.each(fElements, function(element){
			name = element.name;
			type = element.type;
	
			if (!element.disabled && name) {
				data[name] = this.findField(name).getValue();
			}
		}, this);
		return data;
	}
});


Ext.Ajax.addListener('requestexception',function(conn, response, options ){

	var titulo;
	var mensaje;
			
	if (response.status==500){
		//Dependiendo del idioma mostrar el mensaje de perdida de sesion
		titulo='Subproceso anulado.';
		mensaje='La sesi&oacute;n ha caducado, &iquest;Desea iniciar una nueva sesi&oacute;n?';
		//console.log("response"); console.log(response);	
		
		var respuesta=Ext.decode(response.responseText);		

		if (respuesta.Message=='Subproceso anulado.'){
			Sexy.confirm('<h1>' + titulo + ' </h1><p> ' + mensaje + '</p>', {
				onComplete: function (returnvalue) {
					if (!returnvalue) return false;				
					window.location.href="Default.aspx";
				}
			},  'Aceptar', 'Cancelar', '#BFDBFF', 0.4);
		}else{
			if(respuesta.Message!=undefined){
				mensaje=respuesta.Message;
			}
			MensajeInfo('Error en la comunicaci&oacute;n', mensaje, 'Aceptar', '#BFDBFF', 0.4);
		}
	}else{	
		MensajeInfo('Error en la comunicaci&oacute;n', 'Se perdi&oacute; la conexi&oacute;n con el servidor.', 'Aceptar', '#BFDBFF', 0.4);
	
	}
});
	
	/*
Ext.data.DataProxy.addListener('exception', function(proxy, type, action, options, res) {        

	if (res.status==500){
		Ext.Msg.show({
			title:'La sesi&oacute;n ha caducado',
			msg: 'Imposible continuar con el proceso.<br/>Presione aceptar para iniciar sesi&oacute;n.',
			buttons: Ext.Msg.OK,
			minWidth :200,
			fn: function(btn, text){
				window.location = "index.php";
			},
			animEl: 'elId',
			icon: Ext.MessageBox.WARNING
		});
		//Ext.Msg.alert("Error","La sessi&oacute;n ha expirado");
	}
});*/

Ext.override(Ext.form.TriggerField, {
	customWrapCls:'',
	onRender : function(ct, position){
        this.doc = Ext.isIE ? Ext.getBody() : Ext.getDoc();
        Ext.form.TriggerField.superclass.onRender.call(this, ct, position);
        this.wrap = this.el.wrap({cls: 'x-form-field-wrap x-form-field-trigger-wrap '+this.customWrapCls});
        this.trigger = this.wrap.createChild(this.triggerConfig ||
                {tag: "img", src: Ext.BLANK_IMAGE_URL, alt: "", cls: "x-form-trigger " + this.triggerClass});
        this.initTrigger();
        if(!this.width){
            this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
        }
        this.resizeEl = this.positionEl = this.wrap;
    }	
});




Ext.override(Ext.form.ComboBox, {
	//customWrapCls:'erpCombo'
});

Ext.override(Ext.form.DateField, {
	//customWrapCls:'erpDatefield'
});