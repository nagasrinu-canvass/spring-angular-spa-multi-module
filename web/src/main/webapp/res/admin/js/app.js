/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    var app = angular.module('multplyrAdmin', ['ngRoute', 'cnv.multplyr']);
    app.constant('Currency', ['INR', 'USD']);

    var TMPL_BASE_PATH = "/res/admin/pages";
    app.config(function ($routeProvider) {
        $routeProvider
                .when('/dashboard', {
                    templateUrl: TMPL_BASE_PATH + '/dashboard.html',
                    controller: 'dashboardController'
                })
                .when('/candidates', {
                    templateUrl: TMPL_BASE_PATH + '/candidates/list.html',
                    controller: 'candidates.ListController'
                })
                .when('/candidates/leaderboard', {
                    templateUrl: TMPL_BASE_PATH + '/candidates/leaderboard.html',
                    controller: 'candidates.LeaderboardController'
                })
                .when('/candidates/:candidateId', {
                    templateUrl: TMPL_BASE_PATH + '/candidates/candidate.html',
                    controller: 'candidates.ViewController'
                })
                .when('/managers', {
                    templateUrl: TMPL_BASE_PATH + '/managers/list.html',
                    controller: 'managersController'
                })
                .when('/managers/:managerId', {
                    templateUrl: TMPL_BASE_PATH + '/managers/manager.html',
                    controller: 'manager.ViewController'
                })
                .when('/referrals', {
                    templateUrl: TMPL_BASE_PATH + '/referrals/list.html',
                    controller: 'referralsController'
                })
                .when('/push-notifications', {
                    templateUrl: TMPL_BASE_PATH + '/pushNotifications.html',
                    controller: 'notificationsController'
                })
                .when('/rewards/offers', {
                    templateUrl: TMPL_BASE_PATH + '/rewards/offers.html',
                    controller: 'offersController'
                })
                .when('/rewards/purchases', {
                    templateUrl: TMPL_BASE_PATH + '/rewards/purchases.html',
                    controller: 'offers.PurchasesController'
                })
                .when('/jobs', {
                    templateUrl: TMPL_BASE_PATH + '/jobs/list.html',
                    controller: 'jobsController'
                })
                .when('/jobs/skills', {
                    templateUrl: TMPL_BASE_PATH + '/jobs/skills.html',
                    controller: 'jobs.SkillsController'
                })
                .when('/jobs/locations', {
                    templateUrl: TMPL_BASE_PATH + '/jobs/locations.html',
                    controller: 'jobs.LocationsController'
                })
                .when('/jobs/feedback', {
                    templateUrl: TMPL_BASE_PATH + '/jobs/feedback.html',
                    controller: 'jobs.FeedbackController'
                })
                .when('/about', {
                    templateUrl: '/res/test.html',
                    controller: 'aboutController'
                })
                .when('/settings/configuration', {
                    templateUrl: TMPL_BASE_PATH + '/settings/configuration.html',
                    controller: 'settingsController'
                }).
                when('/settings/products', {
                    templateUrl: TMPL_BASE_PATH + '/settings/products.html',
                    controller: 'productsController'
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
        $scope.dashboard = {};
        $scope.statusCounts = {};

        DashboardService.getCounts().then(function (res) {
            $scope.dashboard = res;
            var counts = res.statusCounts;
            var obj = {total: 0};
            for (var i = 0; i < counts.candidates.length; i++) {
                var entry = counts.candidates[i];
                if (obj[entry.jobApplicationStatus] === undefined) {
                    obj[entry.jobApplicationStatus] = 0;
                }
                obj[entry.jobApplicationStatus] += entry.count;
                obj.total += entry.count;
            }
            for (var i = 0; i < counts.managers.length; i++) {
                var entry = counts.managers[i];
                if (obj[entry.jobApplicationStatus] === undefined) {
                    obj[entry.jobApplicationStatus] = 0;
                }
                obj[entry.jobApplicationStatus] += entry.count;
                obj.total += entry.count;
            }
            $scope.statusCounts = obj;
        });

        $scope.syncContacts = function () {
            if (syncing === false) {
                syncing = true;
                Util.syncContacts().then(function (res) {
                    alert("Contact syncing is completed");
                    syncing = false;
                }, function (err) {
                    syncing = false;
                });
            } else {
                alert("Contact syncing is in progress");
            }
        };
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