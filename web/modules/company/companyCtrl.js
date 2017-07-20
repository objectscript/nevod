controllersModule.controller('companyController', function ($scope, $routeParams, NgMap, companySrvc,regionSrvc,$rootScope) {
    var vm = this;
    var polyList = [];
	var regionEdit = true;
	
    $scope.currentPolygon = "";
    $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBKWojtxkjHuh44CNE8mw9S-nX3qWeLHGM"
    $scope.id = 0;
    companySrvc.get($routeParams.companyid).then(
                function (company) {
                     $scope.company = company.data;
                },
                function (data, status, headers, config) {
                    alert(status);
                });
    //$scope.companyName = company.name;
    var rid = 3;//companySrvc.get($routeParams.companyid);

    NgMap.getMap().then(function (map) {
        vm.map = map;
        if($rootScope.regionPolygon)
            {
                $rootScope.regionPolygon.setMap(null);
            }
        map.overlayMapTypes.setAt( 0, null);
        $scope.init();
    });

    $scope.openPolygonById = function (region) {
        var triangleCoords = [];
        //alert(region);
        for (var i = 0; i < region.coordinates.length; i++) {
            triangleCoords.push({
                lat: region.coordinates[i].latitude,
                lng: region.coordinates[i].longtude
            });
            //alert(triangleCoords[i]);
        }

        var triangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            draggable: false,
            indexID: rid,
        });

        triangle.addListener('click', function (e) {
            alert("Hello in Poligon" + this.indexID);
        });

        triangle.setMap(vm.map);

        google.maps.event.addListener(triangle, 'click', function (event) {
            currentPolygon = triangle;
            //$scope.id = currentPolygon.get("indexID");
        });

        polyList.push(triangle);
        triangle.setMap(vm.map);
        $rootScope.regionPolygon=triangle;
    }

    $scope.init = function () {
        for (var i = 0; i < polyList.length; i++) {
            polyList[i].setMap(null);
        }

        if ($routeParams.companyid) {
			regionEdit = false;
            regionSrvc.get(rid).then(
                function (data) {
                    $scope.openPolygonById(data.data);
                },
                function (data, status, headers, config) {

                });
        }
		else{
			
			regionSrvc.getAll().then(
				function(data){
					$scope.openAllRegions(data.data)
				},
				function (data,status,headers,config){
					
				});
		}
    }
	
	$scope.openAllRegions = function(regions){
		for(var i = 0; i < regions.length; i++){
			
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
        if (currentPolygon != "") return true;
        else return false;
    }

    $scope.deletePolygon = function () {
        if (isPolygonChosen()) {
            currentPolygon.setMap(null);
            currentPolygon = "";
        } else {
            alert("No polygons chosen");
        }
    }

    $scope.savePolygon = function () {
        if (isPolygonChosen()) {
            currentPolygon.setOptions({
                editable: false,
                draggable: false
            });

            var vertices = currentPolygon.getPath();
            var polygonPoints = [];
            for (var i = 0; i < vertices.length; i++) {
                var xy = vertices.getAt(i);
                polygonPoints.push({
                    latitude: xy.lat(),
                    longtude: xy.lng()
                });
            }
            var editRegion = JSON.stringify({id: currentPolygon.indexID, name: "asd", code: "123", coordinates: polygonPoints});
			regionSrvc.save(editRegion);
			
        } else {
            alert("No polygons chosen");
        }
    }



    $scope.editPolygon = function () {
        if (isPolygonChosen()) currentPolygon.setOptions({
            editable: true,
            draggable: true
        });
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
            indexID: polyList.length + 1,
        });

        polyList.push(triangle);

        google.maps.event.addListener(triangle, 'click', function (event) {
            currentPolygon = triangle;
            alert("Hello in Poligon" + triangle.paths[0].lat);
            //$scope.id = currentPolygon.get("indexID");
        });

        triangle.setMap(vm.map);
    }

})
