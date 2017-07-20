servicesModule.factory('companySrvc', function(RESTSrvc,settings) {    
    return {
    	/* Все регионы */
        getAll: function(){
            return RESTSrvc.getPromise({method: 'GET', url: settings.server + 'companies'});
        },
        /* Все группы факультета */
        /* getRegions: function(id){
            return RESTSrvc.getPromise({method: 'GET', url: DemoSetting.appName + '/json/region/' + id + '/group'});
        }, */
		/*Сохранить / создать регион */
		save: function(region){
			return RESTSrvc.getPromise({method: 'POST', url: settings.server + 'company', data: company});
		},
		/* Удалить регион по ИД */
		remove: function(id){
			return RESTSrvc.getPromise({method: 'DELETE', url: settings.server + 'company/' + id});
		},
		/* Получить регион по ИД */
		get: function(id){
			return RESTSrvc.getPromise({method: 'GET', url: settings.server + 'company/' + id});
		}

    }
});