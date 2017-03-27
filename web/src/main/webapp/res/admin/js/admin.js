/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    window.multplyr = angular.module("cnv.multplyr", [
        'ngSanitize',
        'cnvCommon',
        'com.naga.basic',
        'ui.select',
        'daterangepicker',
        'uiCropper']);
    window.application = window.multplyr;
    var S3_API_PATH = "/admin/api/g_3s_c";
    var API_BASE_PATH = "/admin/api";
    var PAGE_SIZE = 10;


    window.DataTransformer = {
        transformToKeyMap: function (list, key) {
            var obj = {};
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    obj[list[i][key]] = list[i];
                }
            }

            return obj;
        }
    };

    /**
     * App Utilities
     */
    multplyr.service('Util', function ($q, $http) {
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

    multplyr.factory('s3DirectUploader', function (S3Service) {
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
     * Offers Service
     */
    multplyr.service('DashboardService', function ($http, $q) {
        var BASE_PATH = "/admin/api/dashboard";
        this.getCounts = function () {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/counts", {
                params: {}
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    /**
     * Offers Service
     */
    multplyr.service('OffersService', function ($http, $q) {
        var BASE_PATH = "/admin/api/rewards";

        this.saveOffer = function (offer) {
            var deferred = $q.defer();
            var path = BASE_PATH + "/offers";
            if (offer.objectId) {
                path += ("/" + offer.objectId);
            }
            $http.post(path, offer).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getAll = function (pageIndex, pageSize) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/offers", {
                params: {
                    pageNumber: pageIndex,
                    pageSize: pageSize
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.setStatus = function (offerId, status) {
            var deferred = $q.defer();
            $http.put(BASE_PATH + "/offers/" + offerId + "/status?status=" + status, {
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.getAllPurchases = function (pageIndex, pageSize) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/purchases", {
                params: {
                    pageNumber: pageIndex,
                    pageSize: pageSize
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.getPurchaseDetails = function (purchaseId) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/purchases/" + purchaseId, {
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.updatePurchaseStatus = function (purchaseId, status, comments) {
            var deferred = $q.defer();
            $http.put(BASE_PATH + "/purchases/" + purchaseId + "?status=" + status + "&comments=" + comments, {
                params: {
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getPointsSummary = function () {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/points-summary", {
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    multplyr.service('UserService', function ($http, $q) {
        var BASE_PATH = "/admin/api/users";
        this.transformToView = function (user) {
            var copy = angular.copy(user);
            if (copy.city) {
                copy._city = {key: copy.city.objectId, value: copy.city.name};
                if (copy.city.state) {
                    copy._state = {key: copy.city.state.objectId, value: copy.city.state.name};
                }
            }
            if (copy.industry) {
                copy._industry = {key: copy.industry.objectId, value: copy.industry.name};
            }
            if (copy.education) {
                copy._education = {key: copy.education.objectId, value: copy.education.name};
            }
            if (copy.skills) {
                var skills = copy.skills;
                var _skills = [];
                for (var i = 0; i < skills.length; i++) {
                    _skills.push({key: skills[i].objectId, value: skills[i].name});
                }
                copy._skills = _skills;
            }
            return copy;
        };
        this.transformToModel = function (user) {
            var copy = angular.copy(user);
            if (copy._city) {
                copy.city = {objectId: copy._city.key, name: copy._city.value};
            }
            if (copy._state) {
                copy.city.state = {objectId: copy._state.key, name: copy._state.value};
            }
            if (copy._industry) {
                copy.industry = {objectId: copy._industry.key, name: copy._industry.value};
            }
            if (copy._education) {
                copy.education = {objectId: copy._education.key, name: copy._education.value};
            }
            if (copy._skills) {
                var _skills = copy._skills;
                var skills = [];
                for (var i = 0; i < _skills.length; i++) {
                    skills.push({objectId: _skills[i].key, name: _skills[i].value});
                }
                copy.skills = skills;
            }
            return copy;
        };

        this.removeAllContacts = function (userId) {
            var deferred = $q.defer();
            $http.delete(BASE_PATH + "/" + userId + "/contacts", {}).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.markUserAsRemoved = function (userId) {
            var deferred = $q.defer();
            $http.delete(BASE_PATH + "/" + userId, {}).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    /**
     * Candidates Service
     */
    multplyr.service('CandidatesService', function ($http, $q, UserService) {
        var BASE_PATH = "/admin/api/candidates";

        this.transformToView = function (user) {
            return UserService.transformToView(user);
        };
        this.transformToModel = function (user) {
            return UserService.transformToModel(user);
        };

        this.getAll = function (filters, pageIndex, pageSize) {
            var params = angular.copy(filters || {});
            params.pageNumber = pageIndex;
            params.pageSize = pageSize;
            var deferred = $q.defer();
            $http.get(BASE_PATH, {
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.update = function (candidateId, data) {
            var deferred = $q.defer();
            $http.put(BASE_PATH + "/" + candidateId, data).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.findOne = function (candidateId) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/" + candidateId, {}).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.findOneWithStats = function (candidateId) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/" + candidateId + "/with-stats", {}).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.findAllJobRequests = function (candidateId) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/" + candidateId + "/job-requests", {}).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.findAllReferrals = function (candidateId, page) {
            var deferred = $q.defer();
            page = page | 0;
            $http.get(BASE_PATH + "/" + candidateId + "/referrals/aggregated-list", {
                params: {pageNumber: page}
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.findAllIncomingJobs = function (candidateId, page) {
            var deferred = $q.defer();
            page = page | 0;
            $http.get(BASE_PATH + "/" + candidateId + "/incoming", {
                params: {pageNumber: page}
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.findAllEarnAndBurnPoints = function (candidateId, page) {
            var deferred = $q.defer();
            page = page | 0;
            $http.get(BASE_PATH + "/" + candidateId + "/rewards/points-earn-burn-history", {
                params: {pageNumber: page, pageSize: PAGE_SIZE}
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };



        this.getLeaderboard = function (pageIndex, pageSize) {
            var params = {};
            params.pageNumber = pageIndex;
            params.pageSize = pageSize;
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/leaderboard", {
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    /**
     * Managers Service
     */
    multplyr.service('ManagersService', function ($http, $q, UserService) {
        var BASE_PATH = "/admin/api/managers";

        this.transformToView = function (user) {
            user = UserService.transformToView(user);
            if (user.managerInfo && user.managerInfo.roleType) {
                var roleType = user.managerInfo.roleType;
                for (var role in roleType) {
                    if (roleType[role] === true) {
                        user._roleType = role;
                    }
                }
            }
            return user;
        };
        this.transformToModel = function (user) {
            user = UserService.transformToModel(user);
            if (user._roleType) {
                user.managerInfo.roleType = {
                    companyHiringManager: false,
                    companyRecruiter: false,
                    externalRecruiter: false
                };
                user.managerInfo.roleType[user._roleType] = true;
            }
            return user;
        };

        this.getAll = function (filters, pageIndex, pageSize) {
            var params = angular.copy(filters || {});
            params.pageNumber = pageIndex;
            params.pageSize = pageSize;
            var deferred = $q.defer();
            $http.get(BASE_PATH, {
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.update = function (managerId, data) {
            var deferred = $q.defer();
            $http.put(BASE_PATH + "/" + managerId, data).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.findOne = function (managerId) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/" + managerId, {}).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.findAllIncoming = function (managerId, page) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/" + managerId + "/incoming", {
                params: {pageNumber: page, pageSize: PAGE_SIZE}
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.findAllOutgoing = function (managerId, page) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/" + managerId + "/outgoing", {
                params: {pageNumber: page, pageSize: PAGE_SIZE}
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.findAllPurcases = function (managerId, page) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/" + managerId + "/purchases", {
                params: {pageNumber: page, pageSize: PAGE_SIZE}
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getCreditsInfo = function (managerId) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/" + managerId + "/credits", {}).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.addJobCredits = function (managerId, credits) {
            var deferred = $q.defer();
            $http.put(BASE_PATH + "/" + managerId + "/credits?credits=" + credits, {}).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    /**
     * Managers Service
     */
    multplyr.service('ReferralService', function ($http, $q) {
        var BASE_PATH = "/admin/api/referrals";

        this.getAll = function (filters, pageIndex, pageSize) {
            var params = filters || {};
            params.pageNumber = pageIndex;
            params.pageSize = pageSize;
            params.filters = JSON.stringify(filters);
            var deferred = $q.defer();
            $http.get(BASE_PATH, {
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    /**
     * Managers Service
     */
    multplyr.service('NotificationService', function ($http, $q) {
        var BASE_PATH = "/internal-api/push-notification";

        this.pushNotification = function (notification) {
            console.log(notification)
            var deferred = $q.defer();
            $http.post(BASE_PATH, notification).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    /**
     * Jobs Service
     */
    multplyr.service('JobsService', function ($http, $q) {
        var BASE_PATH = "/admin/api/jobs";

        this.getAll = function (filters, pageIndex, pageSize) {
            var deferred = $q.defer();
            var params = angular.copy(filters || {});
            params.pageNumber = pageIndex;
            params.pageSize = pageSize;
            params.filters = JSON.stringify(filters);
            $http.get(BASE_PATH, {
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.getApplicationsForJob = function (jobPostType, jobId, pageNumber, pageSize) {
            var deferred = $q.defer();
            var params = {
                jobPostType: jobPostType, jobId: jobId,
                pageNumber: pageNumber, pageSize: pageSize
            };
            $http.get(BASE_PATH + "/" + jobId + "/applications", {
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.getAllSkills = function (pageNumber, pageSize) {
            var deferred = $q.defer();
            var params = {
                pageNumber: pageNumber, pageSize: pageSize
            };
            $http.get(BASE_PATH + "/skills", {
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getAllLocations = function (pageNumber, pageSize) {
            var deferred = $q.defer();
            var params = {
                pageNumber: pageNumber, pageSize: pageSize
            };
            $http.get(BASE_PATH + "/locations", {
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    /**
     * 
     */
    multplyr.service('SettingsService', function ($http, $q) {
        this.getConfiguration = function () {
            var deferred = $q.defer();
            $http.get(API_BASE_PATH + "/configuration").success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.saveConfiguration = function (configuration) {
            var deferred = $q.defer();
            $http.post(API_BASE_PATH + "/configuration", configuration).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    /**
     * Offers Service
     */
    multplyr.service('ProductService', function ($http, $q) {
        var BASE_PATH = "/admin/api";

        this.save = function (offer) {
            var deferred = $q.defer();
            var path = BASE_PATH + "/products";
            if (offer.objectId) {
                path += ("/" + offer.objectId);
            }
            $http.post(path, offer).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getAll = function (pageIndex, pageSize) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/products", {
                params: {
                    pageNumber: pageIndex,
                    pageSize: pageSize
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    /**
     * Offers Service
     */
    multplyr.service('SuggestionService', function ($http, $q) {
        var BASE_PATH = "/admin/api/filters";
        var DEFAULT_SUGGESTION_SIZE = 10;

        this.getUserNames = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/user-names", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getCompanyNames = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/user-companies", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getJobPostCompanyNames = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/jobpost-companies", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getSkills = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/skills", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getEducations = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/educations", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getIndustries = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/industries", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getCities = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/cities", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getStates = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/states", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getJobRequestFilters = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/job-requests", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        this.getJobPostFilters = function (keyword) {
            var deferred = $q.defer();
            $http.get(BASE_PATH + "/job-posts", {
                params: {
                    keyword: keyword,
                    pageNumber: 0,
                    pageSize: DEFAULT_SUGGESTION_SIZE
                }
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    });

    multplyr.service('FeedbackService', function ($http, $q) {
        var BASE_PATH = "/admin/api/feedbacks";
        this.getAllFeedback = function (filters, pageNumber, pageSize) {
            var deferred = $q.defer();
            var params = {
                filters: JSON.stringify(filters),
                pageNumber: pageNumber, pageSize: pageSize
            };
            $http.get(BASE_PATH, {
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    });
})();