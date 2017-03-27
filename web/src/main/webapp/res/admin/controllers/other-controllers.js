/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (app) {
    app.controller('notificationsController', function ($scope, NotificationService) {
        $scope.pushNotification = function (notification) {
            $scope.loading = true;
            console.log(notification)
            NotificationService.pushNotification(notification).then(function (data) {
                $scope.loading = false;
                alert("Push notification is sent successfully!");
            }, function () {
                $scope.loading = false;
            });
        };
    });

    app.controller("offersController", function ($scope, s3DirectUploader, paginationFactory, OffersService) {
        $scope.searchBy = "";
        $scope.listTitle = "Offers List";
        $scope.list;
        $scope.pageSize = 10;
        $scope.pageNumber = 1;
        $scope.totalPages = 0;
        $scope.loading;
        $scope.currentView = "list";
        $scope.offer;
        $scope.myImage = '';
        $scope.myCroppedImage = '';

        var imageUploader = s3DirectUploader.create('multplyr-test');
        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });

        $scope.filterList = function () {
            return $scope.list;
        };
        $scope.setView = function (viewName) {
            if (viewName === 'create') {
                $scope.offer = {};
            }
            $scope.myImage = '';
            $scope.currentView = viewName.toLowerCase();
        };
        $scope.edit = function (offer) {
            $scope.offer = offer;
            $scope.setView('edit');
        };
        function _save(offer) {
            OffersService.saveOffer(offer).then(function (data) {
                $scope.loading = false;
                $scope.currentView = "list";
                _search();
            }, function () {
                $scope.loading = false;
            });
        }
        $scope.saveOffer = function (offer) {
            $scope.loading = true;
            //var offer = $scope.offer;            
            if (typeof offer.imageUrl !== 'string') {
                var fileName = "offers_" + new Date().getTime() + ".jpg";
                var file = window.dataURItoBlob($scope.myCroppedImage);
                imageUploader.upload(fileName, file, function (uploadedUrl) {
                    if (uploadedUrl) {
                        offer.imageUrl = uploadedUrl;
                        _save(offer);
                    }
                });
            } else {
                _save(offer);
            }
        };
        $scope.search = function () {
            $scope.pagination.page = 1;
            //$scope.pageNumber = 1;
            _search();
        };
        $scope.changeStatus = function (offer, status) {
            $scope.loading = true;
            OffersService.setStatus(offer.objectId, status).then(function (data) {
                $scope.loading = false;
                offer.status = status;
            }, function () {
                $scope.loading = false;
            });
        };

        $scope.$watch('offer.imageUrl', function (newValue, oldValue) {
            if (newValue && typeof newValue !== 'string') {
                var file = newValue[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function ($scope) {
                        $scope.myImage = evt.target.result;
                    });
                };
                reader.readAsDataURL(file);
            }
        });
        function _search() {
            $scope.loading = true;
            OffersService.getAll($scope.pagination.page - 1, $scope.pageSize).then(function (data) {
                $scope.loading = false;
                var offers = data.offers;
                $scope.pagination.pages = offers.totalPages;
                $scope.pagination.total = offers.totalElements;
                var list = offers.content;
                var statusCountsMap = DataTransformer.transformToKeyMap(data.statusCounts, 'offerId');
                console.log(statusCountsMap);
                for (var i = 0; i < list.length; i++) {
                    var entry = list[i];
                    entry.statusCounts = {};
                    if (statusCountsMap[entry.objectId]) {
                        entry.statusCounts.redeemed = statusCountsMap[entry.objectId].redeemed || 0;
                        entry.statusCounts.inProcess = statusCountsMap[entry.objectId].inProcess || 0;
                        entry.statusCounts.fullFilled = statusCountsMap[entry.objectId].fullFilled || 0;
                    }
                }
                $scope.list = list;
            }, function () {
                $scope.loading = false;
            });
        }
        // initially calling the search
        _search();
    });

    app.controller("offers.PurchasesController", function ($scope, $window, paginationFactory, OffersService) {
        $scope.searchBy = "";
        $scope.listTitle = "Purchases List";
        $scope.list;
        $scope.pageSize = 10;
        $scope.pageNumber = 1;
        $scope.totalPages = 0;
        $scope.loading;
        $scope.currentView = "list";
        $scope.purchase;
        $scope.purchaseDetails;
        $scope.myImage = '';
        $scope.myCroppedImage = '';  
        var purchaseDetailsModal = $('[purchase-details-dialog]');
        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });

        $scope.filterList = function () {
            return $scope.list;
        };
        $scope.setView = function (viewName) {
            if (viewName === 'create') {
                $scope.purchase = {};
            }
            $scope.currentView = viewName.toLowerCase();
        };
        $scope.edit = function (purchase) {
            $scope.purchase = purchase;
            $scope.setView('edit');
        };

        $scope.savePurchase = function (purchase) {
            $scope.loading = true;
            OffersService.updatePurchaseStatus(purchase.objectId, purchase.redemptionStatus, purchase.comments).then(function (data) {
                $scope.loading = false;
                $scope.currentView = "list";
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
        $scope.showPurchaseDetails = function (purchase) {
            $scope.purchaseDetails = {};
            purchaseDetailsModal.modal().show();
            OffersService.getPurchaseDetails(purchase.objectId).then(function (res) {                
                $scope.purchaseDetails = res;
            });
        };

        function _search() {
            $scope.loading = true;
            OffersService.getAllPurchases($scope.pagination.page - 1, $scope.pageSize).then(function (data) {
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

    app.controller('jobsController', function ($scope, Util, paginationFactory, JobsService) {
        $scope.searchBy = "";
        $scope.listTitle = "Jobs List";
        $scope.list;
        $scope.pageSize = 10;
        $scope.loading;
        $scope.currentView = "list";
        $scope.jobPostType = "BY_CANDIDATE"; //DEFAULT
        $scope.companySuggestionSource;
        $scope.filters = {
            jobPostType: 'BY_CANDIDATE',
            status: '',
            date: Util.getDefaultDateRange(),
            user: undefined,
            company: undefined,
            skills: [],
            cities: []
        };
        var keyExtracter = function (obj) {
            return obj.key;
        };
        function _processFilters() {
            return {
                jobPostType: $scope.filters.jobPostType,
                status: $scope.filters.status,
                user: $scope.filters.user && $scope.filters.user.key,
                company: $scope.filters.company && $scope.filters.company.value,
                startDate: $scope.filters.date.startDate,
                endDate: $scope.filters.date.endDate,
                skills: $scope.filters.skills.map(keyExtracter),
                cities: $scope.filters.cities.map(keyExtracter)
            };
        }

        // watching the filter for any changes
        $scope.$watch('filters', function () {
            $scope.pagination.page = 1;
            $scope.companySuggestionSource = $scope.filters.jobPostType === 'BY_MANAGER' ? 'jobpost' : '';
            _search();
        }, true);

        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });

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

        $scope.switchJobPostType = function () {
            $scope.pagination.page = 1;
            _search();
        };

        function _search() {
            $scope.loading = true;
            var filters = _processFilters();
            console.log(filters);
            JobsService.getAll(filters, $scope.pagination.page - 1, $scope.pageSize).then(function (data) {
                $scope.loading = false;
                $scope.pagination.pages = data.totalPages;
                $scope.pagination.total = data.totalElements;
                $scope.list = data.content;
            }, function () {
                $scope.loading = false;
            });
        }
    });

    app.controller('jobs.FeedbackController', function ($scope, $routeParams,
            paginationFactory, FeedbackService) {
        $scope.listTitle = "Feedback";
        $scope.filters = {option1: ''};
        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });
        $scope.filterList = function () {
            return $scope.list;
        };
        function _processFilters() {
            return {
                option1: $scope.filters.option1
            };
        }
        // watching the filter for any changes
        $scope.$watch('filters', function () {
            $scope.pagination.page = 1;
            _search();
        }, true);

        function _search() {
            $scope.loading = true;
            var filters = _processFilters();
            FeedbackService.getAllFeedback(filters, $scope.pagination.page - 1, $scope.pagination.limit).then(function (data) {
                $scope.loading = false;
                if (data && data.content) {
                    $scope.list = data.content;
                    $scope.pagination.pages = data.totalPages;
                    $scope.pagination.total = data.totalElements;
                }
            }, function () {
                $scope.loading = false;
            });
        }
    });

    app.controller('jobs.SkillsController', function ($scope, $routeParams,
            paginationFactory, JobsService) {
        $scope.listTitle = "Skills";
        $scope.currentView = "list";
        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });
        $scope.filterList = function () {
            return $scope.list;
        };

        function _search() {
            $scope.loading = true;
            JobsService.getAllSkills($scope.pagination.page - 1, $scope.pagination.limit).then(function (data) {
                $scope.loading = false;
                if (data && data.content) {
                    $scope.list = data.content;
                    $scope.pagination.pages = data.totalPages;
                    $scope.pagination.total = data.totalElements;
                }
            }, function () {
                $scope.loading = false;
            });
        }

        _search();
    });

    app.controller('jobs.LocationsController', function ($scope, $routeParams,
            paginationFactory, JobsService) {
        $scope.listTitle = "Locations";
        $scope.currentView = "list";
        $scope.pagination = paginationFactory.create({
            onChange: function () {
                _search();
            }
        });
        $scope.filterList = function () {
            return $scope.list;
        };

        function _search() {
            $scope.loading = true;
            JobsService.getAllLocations($scope.pagination.page - 1, $scope.pagination.limit).then(function (data) {
                $scope.loading = false;
                if (data && data.content) {
                    $scope.list = data.content;
                    $scope.pagination.pages = data.totalPages;
                    $scope.pagination.total = data.totalElements;
                }
            }, function () {
                $scope.loading = false;
            });
        }

        _search();
    });

})(angular.module('multplyrAdmin'));


