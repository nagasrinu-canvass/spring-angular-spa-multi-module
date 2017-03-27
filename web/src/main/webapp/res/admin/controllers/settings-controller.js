/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (app) {
    app.controller('settingsController', function ($scope) {
    });

    app.controller('settings.awardsController', function ($scope, SettingsService) {
        $scope.config = {
            awards: {}
        };

        $scope.loading = true;
        SettingsService.getConfiguration().then(function (config) {
            $scope.loading = false;
            $scope.config = config;
        });

        $scope.saveConfiguration = function () {
            $scope.loading = true;
            SettingsService.saveConfiguration($scope.config).then(function () {
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
            });
        };
    });
})(angular.module('multplyrAdmin'));


