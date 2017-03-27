/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    /**
     * 
     * @param {type} dataURI
     * @returns {Window.dataURItoBlob.bb|Blob}
     */
    window.dataURItoBlob = function (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab], {"type": mimeString});
        return bb;
    };


    var module = angular.module("cnvCommon", []);
    module.directive('fileInput', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    element.bind('change', function () {
                        $parse(attributes.fileInput)
                                .assign(scope, element[0].files);
                        scope.$apply();
                    });
                }
            };
        }
    ]);

    module.factory('S3Service', function ($http, $q) {
        function S3DirectUploader(bucketName, credentials, opts) {
            this.bucketName = bucketName;
            this.credentials = credentials || null;
            this.opts = opts || null;
            this.url = opts.url;
            this.initilized = this.credentials === null;
            this.timeout = false;
            this.fileProgressInPercent = 0;
            this.init();
        }
        S3DirectUploader.prototype = {
            init: function () {
                var ME = this;
                $http.get(ME.url, {
                    params: {bucket: ME.bucketName}
                }).then(function (res) {                    
                    ME.credentials = res.data;
                    // ME.bucketName = res.data.buc
                    ME.initialized = true;
                }, function (err) {
                    console.log("error in uploading");
                    console.log(err.status);
                });
                return this;
            },
            onUpload: function () {
                console.log("Uploaded ----");
            },
            ready: function (_cb) {
                return this.afterLoad(_cb);
            },
            afterLoad: function (_cb) {
                var ME = this;
                if (ME.initialized !== true) {
                    window.setTimeout(function () {
                        ME.afterLoad(_cb);
                    }, 250);
                    return this;
                } else {
                    _cb.call(ME);
                }
                return this;
            },
            upload: function (fileName, file, _cb) {
                var ME = this;
                var fd = new FormData();
                var key = fileName;

                console.log("File to be uploaded");
                console.log(file.size);

                fd.append('key', key);
                fd.append('acl', 'public-read');
                fd.append('Content-Type', file.type);
                fd.append('x-amz-meta-uuid', '14365123651274');
                fd.append('x-amz-server-side-encryption', 'AES256');
                fd.append('X-Amz-Credential', ME.credentials.amzCredential);
                fd.append('X-Amz-Algorithm', ME.credentials.algorithm);
                fd.append('X-Amz-Date', ME.credentials.date);
                fd.append('policy', ME.credentials.p);
                fd.append('X-Amz-Signature', ME.credentials.sg);
                fd.append("file", file);
                var xhr = new XMLHttpRequest();
                xhr.addEventListener("load", function (fileName, resourceId, evt) {}, false);
                xhr.onerror = function () {
                    console.log("error uplaoding file");
                    console.log(JSON.stringify(arguments));
                };
                xhr.onreadystatechange = function () {

                    if (xhr.readyState == 4) {
                        console.log("checking xhr");
                        console.log(xhr);

                        var _status = "SUCCESS";
                        if (xhr.status == 0) {
                            _status = "TIME_OUT"
                        }
                        if (_cb) {
                            _cb(ME.credentials.url + fileName, _status)
                        }
                    }
                };
                xhr.upload.onprogress = function (e) {
                    console.log("in progress");
                    var percentComplete = Math.ceil((e.loaded / e.total) * 100);
                    if (!isNaN(percentComplete)) {
                        ME.fileProgressInPercent = percentComplete;
                        ME.onProgress(percentComplete);
                    }
                };
                xhr.open("POST", ME.credentials.url, true);
                console.log("near the end");
                xhr.send(fd);
                if (ME.timeout) {
                    var _lastCount = 0;
                    var _lastProgress = ME.fileProgressInPercent;
                    window.setInterval(function () {
                        if (ME.fileProgressInPercent >= 100) {
                            clearInterval();
                            return;
                        }
                        if (ME.fileProgressInPercent === _lastProgress && ME.fileProgressInPercent < 100) {
                            if (++_lastCount == 3) {
                                console.log("Upload is aborted");
                                xhr.abort();
                                clearInterval();
                                return;
                            }
                        } else {
                            _lastCount = 0
                        }
                        _lastProgress = ME.fileProgressInPercent;
                    }, 2000)
                }
            },
            onProgress: function (percentComplete) {
                console.log("uploaded: ", percentComplete + "%")
            }
        };

        return {
            create: function (bucketName, credentials, opts) {
                return new S3DirectUploader(bucketName, credentials, opts);
            }
        };
    });

    module.directive('cnvPagination', function () {
        return {
            scope: {
                page: '=',
                pages: '=',
                onchange: '&'
            },
            controller: function ($scope, $timeout) {

                function triggerChange() {
                    $timeout(function () {
                        $scope.onchange();
                    });
                }

                $scope.next = function () {
                    if ($scope.page < $scope.pages) {
                        $scope.page++;
                        triggerChange();
                    }
                };
                $scope.previous = function () {
                    if ($scope.page > 1) {
                        $scope.page--;
                        triggerChange();
                    }
                };
                $scope.setPage = function (page, force) {
                    // disabling the loading same page again and again
                    if (!force && $scope.page !== page) {
                        $scope.page = page;
                        triggerChange();
                    }
                };
            },
            replace: true,
            template: '<div class="pagination pagination-container" ng-show="pages>1">'
                    + '<ul class="pagination no-margin">'
                    + '<li><a ng-click="setPage(1)" action="first" class="small-button" style="text-decoration: none; ">&lt;&lt;</a></li>'
                    + '<li><a ng-click="previous()" action="previous" class="small-button" style="text-decoration: none;">&lt;</a></li>'
                    + '<li><a><input type="text" ng-model="page" ng-change="setPage(page)" action="gotoPage" size="1" value="1" style="width: 25px;height: 15px;font-size: 11px; text-align:center;"> of <span>{{pages}}</span></a></li>'
                    + '<li><a ng-click="next()" action="next" class="small-button" style="text-decoration: none;">&gt;</a></li>'
                    + '<li><a ng-click="setPage(pages)" ng-click="change1()" action="last" class="small-button" style="text-decoration: none;">&gt;&gt;</a></li>'
                    + '</ul>'
                    + '</div>'
        };
    });
    module.factory('paginationFactory', function () {
        /**
         *              
         * @param {Object} opts
         * @returns {hotel_L69.hotel_L122.Pagination}
         */
        function Pagination(opts) {
            this.opts = opts || {};
            this.page = 1;
            this.pages = 0;
            this.total = 0;
            this.limit = opts.limit || 10;
        }
        Pagination.prototype = {
            change: function () {
                (this.opts.onChange || angular.noop)();
            }
        };
        function _create(opts) {
            return new Pagination(opts || {});
        }
        return {
            create: _create
        };
    });

    module.directive('cnvLoadMore', function () {
        return {
            scope: {
                onloadmore: '&'
            },
            controller: function ($scope, $timeout) {
                $scope.loadMore = function () {
                    $timeout(function () {
                        $scope.onloadmore();
                    });
                };
                // initially calling
                $scope.loadMore();
            },
            transclude: true,
            template: [
                '<div>',
                '<div ng-transclude></div>', // body of the load more comes here
                '<p class="text-center"><button type="button" class="btn btn-default btn-flat" ng-click="loadMore()">Load More</button></p>',
                '</div>'
            ].join('')
        };
    });
})();

