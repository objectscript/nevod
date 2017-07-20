'use strict';
//dddxddddddвddde

/*===========================================================================================
Регионы
===========================================================================================*/

servicesModule.factory('resourceSrvc', function(RESTSrvc,settings) {    
    return {
    	/* Все ресурсы */
        getAll: function(){
            return RESTSrvc.getPromise({method: 'GET', url: settings.server + 'resourcies'});
        },
        
		/*Сохранить / создать регион */
		save: function(region){
			return RESTSrvc.getPromise({method: 'POST', url: settings.server + 'saveres', data: region});
		},
		/* Удалить регион по ИД */
		remove: function(id){
			return RESTSrvc.getPromise({method: 'DELETE', url: settings.server + 'region/' + id});
		},
		/* Получить регион по ИД */
		get: function(id){
			return RESTSrvc.getPromise({method: 'GET', url: settings.server + 'region/' + id});
		}

    }
});
