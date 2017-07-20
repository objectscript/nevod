controllersModule.controller('regionController', function ($scope, $routeParams, NgMap, regionSrvc, resourceSrvc, $rootScope, $location, regionResourceSrvc) {
    var vm = this;
    //var polyList = [];
	$scope.regionEdit = true;
	$scope.name;
	$scope.code;
	
	$scope.regionId;
	
	$scope.showResources = false;
	$scope.currentResource;
	$scope.resources = [];
	$scope.resourcesInTable = [];
	
    $scope.currentPolygon = "";
    $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBKWojtxkjHuh44CNE8mw9S-nX3qWeLHGM"
   
    var rid = $routeParams.regionid;
	
	$scope.clearContentsOfMap = function(){
		for(var i = 0; i < $rootScope.regionPolygon.length; i++){
			$rootScope.regionPolygon[i].setMap(null);
		}
		
	}
	
	$scope.addResource = function(){
		if($scope.currentResource == null){
			alert("Выберите ресурс из списка");
			return;
		}
		for(var i = 0; i < $scope.resourcesInTable.length; i++){
			if($scope.resourcesInTable[i].code == $scope.currentResource.code){
				alert("Попытка добавить в таблицу уже имеющийся ресурс");
				return;
			}
		}
		
		
		
		$scope.resourcesInTable.push($scope.currentResource);
		regionResourceSrvc.saveResource($scope.currentPolygon.id, $scope.currentResource.id)
	}
	
	$scope.removeResource = function(resourceId){
		var deleted = $scope.resourcesInTable.splice(resourceId, 1);
		alert(deleted.toSource())
		regionResourceSrvc.removeResource($scope.currentPolygon.id, deleted[0].ID);
	}
	
	$scope.showResourceTable = function(){
		$scope.showResources = !$scope.showResources;
		
	}
	
	
	$scope.backToRegionList = function(){
		$location.path('/').replace();
		
	}
	
    NgMap.getMap().then(function (map) {
        vm.map = map;
        if($rootScope.regionPolygon)
        {
                $scope.clearContentsOfMap();
        }
        map.overlayMapTypes.setAt( 0, null);
        $scope.init();
    });

    $scope.openPolygonById = function (region) {
        var triangleCoords = [];
		$scope.name = region.name;
		$scope.code = region.code;
		var summx = 0;
		var summy = 0;
		var x = region.coordinates.length;
		var y = region.coordinates.length;
		
		
		
        for (var i = 0; i < region.coordinates.length; i++) {
            triangleCoords.push({
                lat: region.coordinates[i].latitude,
                lng: region.coordinates[i].longtude
            });
            summx += triangleCoords[i].lat;
			summy += triangleCoords[i].lng;
        }
		if(triangleCoords.length <= 0){
			var mapCenterCoords = vm.map.getCenter();
			var lat = mapCenterCoords.lat();
			var lng = mapCenterCoords.lng();
			var mapZoom = vm.map.getZoom();
			var scaling = 5 / mapZoom;
			

			var triangleCoords = [{
					lat: lat + scaling,
					lng: lng
				},
				{
					lat: lat - scaling,
					lng: lng + scaling
				},
				{
					lat: lat - scaling,
					lng: lng - scaling
				}
			];
			for(var i = 0; i < triangleCoords.length; i++){
				summx += triangleCoords[i].lat;
				summy += triangleCoords[i].lng;
			}
			x = triangleCoords.length;
			y = triangleCoords.length;
		}
		
        var triangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            draggable: false,
            id: region.id,
			code: region.code,
			name: region.name
        });
		
		
        //triangle.setMap(vm.map);
		
		/*
        google.maps.event.addListener(triangle, 'click', function (event) {
          
            //$scope.id = $scope.currentPolygon.get("id");
        });
		*/
        //polyList.push(triangle);
        triangle.setMap(vm.map);
		$scope.currentPolygon = triangle;
		$scope.name=$scope.currentPolygon.name;
		$scope.code=$scope.currentPolygon.code;
        $rootScope.regionPolygon.push(triangle);
		
		regionResourceSrvc.getAll($scope.currentPolygon.id).then(
					function(data){
						
							for(var i = 0; i < data.data.children.length; i++){
								var parsedResource = data.data.children[i];
								$scope.resourcesInTable.push(parsedResource);

							}
					},
					function(data, status, headers, config){
						
					}
		);
		
		vm.map.setCenter(new google.maps.LatLng(summx/x, summy/y));
    }

    $scope.init = function () {
        /*for (var i = 0; i < polyList.length; i++) {
            polyList[i].setMap(null);
        }*/
		if(!$rootScope.regionPolygon){
			$rootScope.regionPolygon = [];
		}
		
        if ($routeParams.regionid) {
			$scope.regionEdit = false;
            
			regionSrvc.get(rid).then(
                function (data) {
                    $scope.openPolygonById(data.data);
                },
                function (data, status, headers, config) {
			});
			
			
        }
		
		else if($location.path() == '/region/'){
			$scope.regionEdit = true;

		}
		
		else{
			$scope.regionEdit = true;
			
			regionSrvc.getAll().then(
				function(data){
					$scope.openAllRegions(data.data)
				},
				function (data,status,headers,config){
					
				});
		}
		
		resourceSrvc.getAll().then(
				function(data){
					
					for(var i = 0; i < data.data.length; i++){
						var parsedResource = JSON.parse(data.data[i]);
						$scope.resources.push(parsedResource);
					}
				},
				function (data, status, headers, config) {
					
			}
		);
		
    }
	
	$scope.openAllRegions = function(regions){
		
		for(var i = 0; i < regions.length; i++){
			var triangleCoords = [];
			region = JSON.parse(regions[i]);
			
			for (var j = 0; j < region.coordinates.length; j++) {
				
				triangleCoords.push({
					lat: region.coordinates[j].latitude,
					lng: region.coordinates[j].longtude
				});
			
			}
			
			var triangle = new google.maps.Polygon({
				paths: triangleCoords,
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				draggable: false,
				id: region.id,
				code: region.code,
				name: region.name
			});
			
			triangle.setMap(vm.map);

			google.maps.event.addListener(triangle, 'click', function (event) {
				$scope.currentPolygon = this;
			});

			//polyList.push(triangle);
			triangle.setMap(vm.map);
			$rootScope.regionPolygon.push(triangle);
		}
	}

    $scope.openPolygon = function () {

        regionSrvc.get(3).then(
            function (data) {
                alert(data.data.name + '\n' + data.data.coordinates[0].latitude + '\n' + data.data.coordinates[0].longtude);
                $scope.id = data.data.name;

            },
            function (data, status, headers, config) {
                alert(status);
            });
    }


    var isPolygonChosen = function () {
        if ($scope.currentPolygon != "") return true;
        else return false;
    }

    $scope.deletePolygon = function () {
        if (isPolygonChosen()) {
            $scope.currentPolygon.setMap(null);
			regionSrvc.remove($scope.currentPolygon.id)
            $scope.currentPolygon = "";
        } else {
            alert("No polygons chosen");
        }
    }

    $scope.savePolygon = function () {
        if (isPolygonChosen()) {
            $scope.currentPolygon.setOptions({
                editable: false,
                draggable: false
            });

            var vertices = $scope.currentPolygon.getPath();
            var polygonPoints = [];
            for (var i = 0; i < vertices.length; i++) {
                var xy = vertices.getAt(i);
                polygonPoints.push({
                    latitude: xy.lat(),
                    longtude: xy.lng()
                });
            }
			$scope.currentPolygon.name = $scope.name;
			$scope.currentPolygon.code = $scope.code;
			
            var editRegion = JSON.stringify({id: $scope.currentPolygon.id, name: $scope.currentPolygon.name, code: $scope.currentPolygon.code, coordinates: polygonPoints});
			regionSrvc.save(editRegion).then(
				function (data) {
					
					$scope.regionId = parseInt(data.data.id);

				},
				function (data, status, headers, config) {
					
				});
			
        } else {
            alert("No polygons chosen");
        }
    }



    $scope.editPolygon = function () {
        if (isPolygonChosen()) {
				$scope.currentPolygon.setOptions({
					editable: true,
					draggable: true
				});
			$scope.name = $scope.currentPolygon.name;
			$scope.code = $scope.currentPolygon.code;
			
		}
        else alert("No polygons chosen");
    }

    $scope.createPolygon = function () {
        var mapCenterCoords = vm.map.getCenter();
        var lat = mapCenterCoords.lat();
        var lng = mapCenterCoords.lng();
        var mapZoom = vm.map.getZoom();
        var scaling = 5 / mapZoom;


        var triangleCoords = [{
                lat: lat + scaling,
                lng: lng
			},
            {
                lat: lat - scaling,
                lng: lng + scaling
			},
            {
                lat: lat - scaling,
                lng: lng - scaling
			}
		];

        var triangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            draggable: false,
        });

        //polyList.push(triangle);
		$scope.currentPolygon = triangle;
		$rootScope.regionPolygon.push(triangle);
		$scope.currentPolygon.setOptions({editable:true, draggable:true});
		
        google.maps.event.addListener(triangle, 'click', function (event) {
            $scope.currentPolygon = this;
			
            //$scope.id = $scope.currentPolygon.get("id");
        });

        triangle.setMap(vm.map);
    }

})
