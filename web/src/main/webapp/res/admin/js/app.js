/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    var app = angular.module('appAdmin', ['ngRoute', 'app.adminModule']);
    var TMPL_BASE_PATH = "/res/admin/pages";
    app.config(function ($routeProvider) {
        $routeProvider
                .when('/dashboard', {
                    templateUrl: TMPL_BASE_PATH + '/dashboard.html',
                    controller: 'dashboardController'
                });
    });

    // create the controller and inject Angular's $scope
    app.controller('mainController', function ($rootScope, $scope, $location, $route, $location) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';

        $scope.changeView = function (view) {
            $location.path(view);
        };

    });

    app.controller('dashboardController', function ($scope, DashboardService, Util) {
        var syncing = false;
        $scope.statusCounts = {};
    });

    app.controller("sidebarController", function ($rootScope, $element, $location) {
        $rootScope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            var path = '#' + $location.$$path.slice(1);
            $element.find('.active').removeClass('active');
            var $ele = $element.find('[href="' + path + '"]');
            $ele.parents('li').addClass('active');
        });
    });

})();