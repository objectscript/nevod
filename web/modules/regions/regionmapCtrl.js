controllersModule.controller('regionmapController', function ($scope, $routeParams, NgMap, regionSrvc, resourceSrvc, $rootScope, $location, regionResourceSrvc) {
    var vm = this;
	$scope.regionEdit = true;
	$scope.name;
	$scope.code;
	
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
	
    NgMap.getMap().then(function (map) {
        vm.map = map;
        if($rootScope.regionPolygon)
        {
            $scope.clearContentsOfMap();
        }
        $scope.init();
    });
    
	$scope.backToRegionList = function(){
		$location.path('/').replace();
	}
 
    $scope.init = function () {
		if(!$rootScope.regionPolygon){
			$rootScope.regionPolygon = [];
		}
		
        $scope.regionEdit = false;

        regionSrvc.getAll().then(
            function(data){
                $scope.openAllRegions(data.data);
            },
            function (data,status,headers,config){
                alert(status);
            }
        );

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
	
    function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
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
				strokeColor: '#e1e1e1',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: getRandomColor(),
				fillOpacity: 0.35,
				draggable: false,
				id: region.id,
				code: region.code,
				name: region.name
			});
			
			triangle.setMap(vm.map);

			google.maps.event.addListener(triangle, 'click', function (event) {
				$scope.currentPolygon = this;
                
                var contentString = '<b>'+this.name+'</b><br>' +
                  'Код: ' + this.code +
                  '<br>';
                infoWindow.setContent(contentString);
                infoWindow.setPosition(event.latLng);

                infoWindow.open(vm.map);
                
                regionResourceSrvc.getAll($scope.currentPolygon.id).then(
                function(data){
                        for(var i = 0; i < data.data.children.length; i++){
                            var parsedResource = JSON.parse(data.data.children[i]);
                            $resourcesInTable.push(parsedResource);
                        }
                },
                function(data, status, headers, config){
                    }
                );
			});

			//polyList.push(triangle);
			triangle.setMap(vm.map);
			$rootScope.regionPolygon.push(triangle);
		}
        infoWindow = new google.maps.InfoWindow;
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
			regionSrvc.save(editRegion);
			
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
			alert($scope.currentPolygon.id + " " + $scope.currentPolygon.name + " " + $scope.currentPolygon.code);
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
		$scope.name=$scope.currentPolygon.name;
		$scope.code=$scope.currentPolygon.code;
		$scope.currentPolygon.setOptions({editable:true, draggable:true});
		
        google.maps.event.addListener(triangle, 'click', function (event) {
            $scope.currentPolygon = this;
			
            //$scope.id = $scope.currentPolygon.get("id");
        });

        triangle.setMap(vm.map);
    }

})
