'use strict';
//dddxddddddвddde

/*===========================================================================================
Регионы
===========================================================================================*/

servicesModule.factory('regionResourceSrvc', function(RESTSrvc,settings) {    
    return {
    	/* Получить все ресурсы региона */
        getAll: function(idReg){
            return RESTSrvc.getPromise({method: 'GET', url: settings.server + 'getresreg/' + idReg});
        },
		/*Сохранить ресурс для региона*/
		saveResource: function(idReg, idRes){
			return RESTSrvc.getPromise({method: 'POST', url: settings.server + 'setresreg/' + idReg + '/' + idRes});
		},
		/* Удалить регион по ИД */
		removeResource: function(idReg, idRes){
			return RESTSrvc.getPromise({method: 'DELETE', url: settings.server + 'delresreg/' + idReg + '/' + idRes});
		},
    }
});



