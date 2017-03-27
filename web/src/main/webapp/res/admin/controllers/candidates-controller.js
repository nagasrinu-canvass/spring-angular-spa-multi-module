/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (app) {
    app.controller("candidates.ListController", function ($scope, paginationFactory,
            UserService, CandidatesService) {
        $scope.searchBy = "";
        $scope.listTitle = "Candidates";
        $scope.list;
        $scope.pageSize = 10;
        $scope.loading;
        $scope.currentView = "list";
        $scope.filters = {
            company: undefined
        };
        $scope.offer;
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


        $scope.removeUser = function (user) {
            var value = window.prompt("Enter the phone number : " + user.phone + " to remove this user");
            if (value !== null && value === user.phone) {
                UserService.markUserAsRemoved(user.objectId).then(function (res) {
                    alert("User " + user.fullName + " has been marked as removed");
                    _search();
                });
            } else {
                alert("Action canceled");
            }
        };
        $scope.removeAllUserContacts = function (user) {
            var value = window.prompt("Enter the phone number : " + user.phone + " to remove all contacts");
            if (value !== null && value === user.phone) {
                UserService.removeAllContacts(user.objectId).then(function (res) {
                    alert("User " + user.fullName + " contacts has been removed");
                });
            } else {
                alert("Action canceled");
            }
        };
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

        $scope.onSearch = function (val) {
        };

        function _search() {
            $scope.loading = true;
            CandidatesService.getAll(_processFilters(), $scope.pagination.page - 1, $scope.pagination.limit).then(function (data) {
                $scope.loading = false;
                $scope.pagination.pages = data.totalPages;
                $scope.pagination.total = data.totalElements;
                $scope.list = data.content;
            }, function () {
                $scope.loading = false;
            });
        }
    });

    app.controller("candidates.LeaderboardController", function ($scope,
            CandidatesService, paginationFactory, OffersService) {
        $scope.currentView = "list";
        $scope.listTitle = "Candidates Leaderboard";
        $scope.list;
        $scope.pointsSummary;
        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });

        $scope.filterList = function () {
            return $scope.list;
        };
        OffersService.getPointsSummary().then(function (res) {
            $scope.pointsSummary = res;
        });

        function _search() {
            $scope.loading = true;
            CandidatesService.getLeaderboard($scope.pagination.page - 1, $scope.pagination.limit).then(function (data) {
                $scope.loading = false;
                $scope.pagination.pages = data.totalPages;
                $scope.pagination.total = data.totalElements;
                $scope.list = data.content;
            }, function () {
                $scope.loading = false;
            });
        }

        _search();
    });

    app.controller("candidates.ViewController", function ($scope, $routeParams, CandidatesService) {
        $scope.currentView = "view";
        $scope.user;
        $scope.editableUser;
        $scope.stats;
        $scope.jobRequests;
        $scope.referrals = [];
        $scope.incomingJobs = [];
        $scope.earnAndBurnHistory = [];
        var jobRequestsOpt = {page: 0, completed: false};
        var earnAndBurnHistoryOpt = {page: 0, completed: false};
        var incomingJobsOpt = {page: 0, completed: false};
        var referralsOpt = {page: 0, completed: false};
        var candidateId = $routeParams.candidateId;
        CandidatesService.findOneWithStats(candidateId).then(function (res) {
            $scope.user = res.user;
            $scope.stats = res.stats;
        });

        function setEditableUser(user) {
            $scope.editableUser = CandidatesService.transformToView(user);
        }

        $scope.setView = function (view) {
            if ("edit" === view) {
                setEditableUser($scope.user);
            }
            $scope.currentView = view;

        };
        $scope.updateUser = function (user) {
            // making the clone
            var userModel = CandidatesService.transformToModel(user);
            CandidatesService.update(userModel.objectId, userModel).then(function (res) {
                $scope.user = res;
                $scope.setView("view");
            });
        };

        $scope.loadMoreJobRequests = function () {
            if (jobRequestsOpt.completed !== true) {
                CandidatesService.findAllJobRequests(candidateId).then(function (jobRequests) {
                    $scope.jobRequests = jobRequests;
                    jobRequestsOpt.completed = true;
                });
            }
        };
        $scope.loadMoreIncomingJobs = function () {
            CandidatesService.findAllIncomingJobs(candidateId, incomingJobsOpt.page).then(function (incomingJobs) {
                var items = incomingJobs.content;
                for (var i = 0; i < items.length; i++) {
                    $scope.incomingJobs.push(items[i]);
                }
                incomingJobsOpt.page++;
            });
        };
        $scope.loadMoreReferrals = function () {
            if (referralsOpt.completed !== true) {
                CandidatesService.findAllReferrals(candidateId, referralsOpt.page).then(function (referrals) {
                    var items = referrals.content;
                    referralsOpt.completed = items.length === 0;
                    for (var i = 0; i < items.length; i++) {
                        $scope.referrals.push(items[i]);
                    }
                    referralsOpt.page++;
                });
            }
        };
        $scope.loadMorePointsHistory = function () {
            if (earnAndBurnHistoryOpt.completed !== true) {
                CandidatesService.findAllEarnAndBurnPoints(candidateId, earnAndBurnHistoryOpt.page).then(function (earnAndBurnHistory) {
                    var items = earnAndBurnHistory.content;
                    earnAndBurnHistoryOpt.completed = items.length === 0;
                    for (var i = 0; i < items.length; i++) {
                        $scope.earnAndBurnHistory.push(items[i]);
                    }
                    earnAndBurnHistoryOpt.page++;
                });
            }
        };
    });

    app.controller("user.profileController", function () {
    });

})(angular.module('multplyrAdmin'));