/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (app) {
    app.controller("productsController", function ($scope, Currency, paginationFactory, ProductService) {
        $scope.searchBy = "";
        $scope.listTitle = "Products List";
        $scope.list;
        $scope.pageSize = 10;
        $scope.pageNumber = 1;
        $scope.totalPages = 0;
        $scope.loading;
        $scope.currentView = "list";
        $scope.currency = Currency;
        $scope.product;
        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });

        $scope.filterList = function () {
            return $scope.list;
        };
        $scope.setView = function (viewName) {
            if (viewName === "create") {
                $scope.product = {currency: 'INR'};
            }
            $scope.currentView = viewName.toLowerCase();
        };
        $scope.saveProduct = function (product) {
            $scope.loading = true;
            ProductService.save(product).then(function (data) {
                $scope.loading = false;
                $scope.setView("list");
                _search();
            }, function () {
                $scope.loading = false;
            });
        };
        $scope.search = function () {
            $scope.pagination.page = 1;
            //$scope.pageNumber = 1;
            _search();
        };
        $scope.edit = function (product) {
            $scope.product = product;
            $scope.currentView = "edit";
        };

        function _search() {
            $scope.loading = true;
            ProductService.getAll($scope.pagination.page - 1, $scope.pageSize).then(function (data) {
                $scope.loading = false;
                $scope.pagination.pages = data.totalPages;
                $scope.pagination.total = data.totalElements;
                $scope.list = data.content;
            }, function () {
                $scope.loading = false;
            });
        }
        // initially calling the search
        _search();
    });
})(angular.module('multplyrAdmin'));


