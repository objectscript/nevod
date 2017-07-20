controllersModule.controller('headerController', function ($scope, $location) {
    $scope.location = $location;
    $scope.items = [
        {
            title: 'Регионы',
            path: '/regionslist',
            img: 'region.png'
        },
        {
            title: 'Ресурсы',
            path: '/resource',
            img: 'resource.png'
        },
        {
            title: 'Компании',
            path: '/companieslist',
            img: 'company.png',
           /*  items: [
                {
                    title: 'Справочник',
                    path: '/company/editor'
                },
                {
                    title: 'Отчеты',
                    path: '/company/report'
                }
            ] */
        }
    ];


    $scope.isCurrentPath = function (item) {
        if (item.items) {
            var x=item.items.some(it => it.path == $location.path()) || item.path == $location.path();
            return item.items.some(it => it.path == $location.path()) || item.path == $location.path();
        }
        if (item.paths) {
            var x = item.paths.some(it => it == $location.path()) || item.path == $location.path();
            return item.paths.some(it => it == $location.path()) || item.path == $location.path();
        }
        var x=$location.path();
        return item.path == $location.path();
    }

});

directivesModule.directive('headerNavbar', function () {
    return {
        replace: true,
        scope: true,
        templateUrl: 'modules/header/header.html',

        controller: 'headerController'
    }
});