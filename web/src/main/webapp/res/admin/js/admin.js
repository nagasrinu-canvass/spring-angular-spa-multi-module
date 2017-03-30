/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    window.module = angular.module("app.adminModule", [
        'ngSanitize',
        'cnvCommon',
        'com.naga.basic']);
    window.application = window.module;
    var S3_API_PATH = "/admin/api/g_3s_c";
    /**
     * App Utilities
     */
    module.service('Util', function ($q, $http) {
        /**
         * Converts the given ary as a map object with key value
         * @param {type} array
         * @param {type} keysMap
         * @returns {undefined}
         */
        this.convertToMap = function (array, keysMap) {
            var map = {};
            for (var key in keysMap) {
                map[key] = array[keysMap[key]];
            }
            return map;
        };

        this.syncContacts = function () {
            var deferred = $q.defer();
            var path = "/internal-api/sync-contacts";
            $http.get(path, {}).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.getDefaultDateRange = function () {
            return {
                startDate: moment().add(-30, 'days').startOf('day'),
                endDate: moment().endOf('day'),
            };
        };
    });

    module.factory('s3DirectUploader', function (S3Service) {
        return {
            /**
             * Creates the S3 Instance with the given bucket and folder
             * @param {type} bucket
             * @param {type} folder
             * @returns {unresolved}
             */
            create: function (bucket, folder) {
                return S3Service.create(bucket, null, {url: S3_API_PATH});
            }
        };
    });

    /**
     * Dashboard Service
     */
    module.service('DashboardService', function ($http, $q) {
        this.getCounts = function () {
            var deferred = $q.defer();
            deferred.resolve("success");
            return deferred.promise;
        };
    });
})();