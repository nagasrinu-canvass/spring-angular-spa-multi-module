/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (app) {
    app.controller("referralsController", function ($scope, Util, paginationFactory, ReferralService) {
        $scope.searchBy = "";
        $scope.listTitle = "Referrals";
        $scope.list;
        $scope.pageSize = 10;
        $scope.loading;
        $scope.currentView = "list";
        $scope.offer;
        $scope.filters = {
            date: Util.getDefaultDateRange(),
            referredBy: undefined,
            postedBy: undefined,
            company: undefined,
            jobId: undefined,
            postType: 'BY_CANDIDATE'
        };
        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });
        function _processFilters() {
            return {
                referredBy: $scope.filters.referredBy && $scope.filters.referredBy.key,
                postedBy: $scope.filters.postedBy && $scope.filters.postedBy.key,
                company: $scope.filters.company && $scope.filters.company.value,
                jobId: $scope.filters.jobId && $scope.filters.jobId.key,
                startDate: $scope.filters.date.startDate,
                endDate: $scope.filters.date.endDate,
                postType: $scope.filters.postType
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
            var filters = _processFilters();
            ReferralService.getAll(filters, $scope.pagination.page - 1, $scope.pageSize).then(function (data) {
                $scope.loading = false;
                var referrals = data.referrals;
                $scope.pagination.pages = referrals.totalPages;
                $scope.pagination.total = referrals.totalElements;
                var list = referrals.content;
                var candidateJobs = DataTransformer.transformToKeyMap(data.candidateJobs, 'objectId');
                var managerJobs = DataTransformer.transformToKeyMap(data.managerJobs, 'objectId');
                for (var i = 0; i < list.length; i++) {
                    var entry = list[i];
                    var jobSrc = entry.postType === 'BY_CANDIDATE' ? candidateJobs : managerJobs;
                    entry.job = {objectId: entry.postId, jobTitle: jobSrc[entry.postId] && jobSrc[entry.postId].jobTitle};
                }
                $scope.list = list;
            }, function () {
                $scope.loading = false;
            });
        }
// initially calling the search
//_search();
    });
})(angular.module('multplyrAdmin'));