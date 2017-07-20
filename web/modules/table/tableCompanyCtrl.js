controllersModule.controller('tableCompanyController', function ($scope,$location, companySrvc) {

	$scope.companies = []; //= [1,2,3];

	$scope.editCompany = function (id) {
		$location.path('/company/'+id).replace();
	}

	$scope.removeCompany = function (id) {


	}
	$scope.init = function () {
		companySrvc.getAll().then(function (data) {
			//alert(data.data.toSource());
			for (var i = 0; i < data.data.length; i++) {
				$scope.companies.push(JSON.parse(data.data[i]));
				//alert(JSON.parse(data.data[i]).name +' '+ (data.data[i]).id);
			}
			//$scope.companies = data.data.children
		}, function (data, status, headers, config) {
			alert(status);
		});
    }
})