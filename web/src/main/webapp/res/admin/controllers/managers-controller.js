/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (app) {
    app.controller("managersController", function ($scope, paginationFactory, ManagersService) {
        $scope.searchBy = "";
        $scope.listTitle = "Managers List";
        $scope.list;
        $scope.pageSize = 10;
        $scope.loading;
        $scope.currentView = "list";
        $scope.offer;
        $scope.filters = {
            company: undefined
        };
        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });
        function _processFilters() {
            return {
                keyword: $scope.filters.keyword,
                company: $scope.filters.company && $scope.filters.company.value
            };
        }

        // watching the filter for any changes
        $scope.$watch('filters', function () {
            $scope.pagination.page = 1;
            _search();
        }, true);


        $scope.filterList = function () {
            return $scope.list;
        };

        $scope.setView = function (viewName) {
            $scope.currentView = viewName.toLowerCase();
        };

        $scope.search = function () {
            $scope.pagination.page = 1;
            _search();
        };

        function _search() {
            $scope.loading = true;
            ManagersService.getAll(_processFilters(), $scope.pagination.page - 1, $scope.pageSize).then(function (data) {
                $scope.loading = false;
                $scope.pagination.pages = data.totalPages;
                $scope.pagination.total = data.totalElements;
                $scope.list = data.content;
            }, function () {
                $scope.loading = false;
            });
        }
    });

    app.controller("manager.ViewController", function ($scope, $routeParams, ManagersService) {
        // Local variables
        $scope.currentView = "view";
        var managerId = $routeParams.managerId;
        var outgoingOpt = {page: 0, completed: false};
        var incomingOpt = {page: 0, completed: false};
        var purchasesOpt = {page: 0, completed: false};

        // Scope Variables
        $scope.user;
        $scope.editableUser;
        $scope.incoming = [];
        $scope.outgoing = [];
        $scope.purchases = [];
        $scope.creditsInfo = {};

        ManagersService.findOne(managerId).then(function (manager) {
            $scope.user = manager;
        });
        ManagersService.getCreditsInfo(managerId).then(function (res) {
            $scope.creditsInfo = res;
        });


        function setEditableUser(user) {
            $scope.editableUser = ManagersService.transformToView(user);
        }
        $scope.setView = function (view) {
            if ("edit" === view) {
                setEditableUser($scope.user);
            }
            $scope.currentView = view;

        };
        $scope.updateUser = function (user) {
            // making the clone
            var userModel = ManagersService.transformToModel(user);
            ManagersService.update(userModel.objectId, userModel).then(function (res) {
                $scope.user = res;
                $scope.setView("view");
            });
        };


        $scope.loadMoreOutgoing = function () {
            if (outgoingOpt.completed !== true) {
                ManagersService.findAllOutgoing(managerId, outgoingOpt.page).then(function (outgoing) {
                    var items = outgoing.content;
                    outgoingOpt.completed = items.length === 0;
                    for (var i = 0; i < items.length; i++) {
                        $scope.outgoing.push(items[i]);
                    }
                    outgoingOpt.completed = true;
                });
            }
        };
        $scope.addCredits = function () {
            ManagersService.addJobCredits(managerId, $scope.creditsInfo.newJobCredits).then(function (res) {
                $scope.creditsInfo = res;
            });
        };
        $scope.loadMoreIncoming = function () {
            if (incomingOpt.completed !== true) {
                ManagersService.findAllIncoming(managerId, incomingOpt.page).then(function (incoming) {
                    var items = incoming.content;
                    incomingOpt.completed = items.length === 0;
                    for (var i = 0; i < items.length; i++) {
                        $scope.incoming.push(items[i]);
                    }
                    incomingOpt.page++;
                });
            }
        };
        $scope.loadMorePurchases = function () {
            if (purchasesOpt.completed !== true) {
                ManagersService.findAllPurcases(managerId, purchasesOpt.page).then(function (purchases) {
                    var items = purchases.content;
                    purchasesOpt.completed = items.length === 0;
                    for (var i = 0; i < items.length; i++) {
                        $scope.purchases.push(items[i]);
                    }
                    purchasesOpt.page++;
                });
            }
        };
    });
})(angular.module('multplyrAdmin'));