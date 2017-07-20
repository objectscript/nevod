'use strict';
//dddxddddddвddde

/*===========================================================================================
Регионы
===========================================================================================*/

servicesModule.factory('totalQuotaSrvc', function(RESTSrvc,settings) {    
    return {
    	/* Все регионы */
        getAllResources: function(){
            return RESTSrvc.getPromise({method: 'GET', url: settings.server + 'resourcies'});
        },
        /* Все группы факультета */
        /* getRegions: function(id){
            return RESTSrvc.getPromise({method: 'GET', url: DemoSetting.appName + '/json/region/' + id + '/group'});
        }, */
		/*Сохранить / создать регион */
		save: function(region){
			return RESTSrvc.getPromise({method: 'POST', url: settings.server + 'region/save', data: region});
		},
		/* Удалить регион по ИД */
		remove: function(id){
			return RESTSrvc.getPromise({method: 'DELETE', url: settings.server + 'delregion/' + id});
		},
		/* Получить регион по ИД */
		get: function(id){
			return RESTSrvc.getPromise({method: 'GET', url: settings.server + 'region/' + id});
		}
		
    }
});
