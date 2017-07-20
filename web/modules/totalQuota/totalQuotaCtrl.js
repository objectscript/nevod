controllersModule.controller('totalQuotaController', function ($scope,$location, totalQuotaSrvc) {

	$scope.regions = []; //= [1,2,3];

	$scope.hidder = true;
	$scope.hide = function(){
		$scope.hidder = !$scope.hidder;
	}
	

	$(document).ready(function () {
    $('#yellow-trigger').click(function () {
        $('#red-box').hide();
        $('#yellow-box').fadeIn('slow');
    });

    $('#red-trigger').click(function () {
        $('#yellow-box').hide();
        $('#red-box').fadeIn('slow');     
    });
});

	$scope.editRegion = function (id) {
		$location.path('/region/'+id).replace();
	}

	$scope.removeRegion = function (item) {
		$scope.regions.splice($scope.regions.indexOf(item),1);
		regionSrvc.remove(item.id);
		
		//$location.path('/regionlist').replace()

	}
	
	$scope.addRegion = function (){
		$location.path('/region/').replace()
	}
	
	$scope.init = function () {
		totalQuotaSrvc.getAll().then(function (data) {
			//alert(data.data.toSource());
			for (var i = 0; i < data.data.length; i++) {
				$scope.regions.push(JSON.parse(data.data[i]));
				//alert(JSON.parse(data.data.children[i]).coordinates[0]);
			}
			//$scope.regions = data.data.children
		}, function (data, status, headers, config) {
			alert(status);
		});
	}
	/* var init = function(){
			//regionSrvc.getAll().then(
				//function (data) {
					//alert(data.data.children[0].name+'\n'+data.data.children[0].coordinates[0].latitude+'\n'+data.data.coordinates[0].longtude);
					//alert(JSON.parse(data.data));
					//var x= data.data.children["name"];
					//$scope.regions = x;
					alert(x);
				},
				function (data, status, headers, config) {
					alert(status);
				});
	};
	
	init(); */


})