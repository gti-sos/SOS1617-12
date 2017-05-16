angular
    .module("sos1617-12-app")
    .controller("FSSCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("FSS controller initialized");

        $scope.url = "/api/v2/free-software-stats";
        $scope.apikey = "1234";
        $scope.reqStatus = "Welcome";
        $scope.apikeyWarning = "";



        $scope.currentPage = 1;
        $scope.totalPages = null;
        $scope.numPages = 0;
        $scope.size = 10;
        $scope.offset = 0;


        function refresh() {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    $scope.stats = response.data;
                    $scope.numPages = Math.ceil(response.data.length / $scope.size);
                    $scope.totalPages = new Array($scope.numPages);

                });

        }

        //pagination

        $scope.goToPage = function(page) {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey + "&limit=" + $scope.size + "&offset=" + (((page + 1) * $scope.size) - $scope.size))
                .then(function(response) {
                        $scope.stats = response.data;
                        console.log($scope.url + "?apikey=" + $scope.apikey + "&limit=" + $scope.size + "&offset=" + ((page + 1 * $scope.size) - $scope.size));
                        $scope.apikeyWarning = "";
                        $scope.currentPage = page + 1;
                        console.log("Current page: " + $scope.currentPage);

                    }, err

                );
        };

        $scope.nextPage = function() {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey + "&limit=" + $scope.size + "&offset=" + ((($scope.currentPage + 1) * $scope.size) - $scope.size))
                .then(function(response) {
                        $scope.stats = response.data;
                        console.log($scope.url + "?apikey=" + $scope.apikey + "&limit=" + $scope.size + "&offset=" + (($scope.currentPage + 1 * $scope.size) - $scope.size));
                        $scope.apikeyWarning = "";
                        $scope.currentPage = $scope.currentPage + 1;
                        console.log("Current page: " + $scope.currentPage);

                    }, err

                );
        };


        $scope.previousPage = function() {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey + "&limit=" + $scope.size + "&offset=" + ((($scope.currentPage - 1) * $scope.size) - $scope.size))
                .then(function(response) {
                        $scope.stats = response.data;
                        console.log($scope.url + "?apikey=" + $scope.apikey + "&limit=" + $scope.size + "&offset=" + (($scope.currentPage + 1 * $scope.size) - $scope.size));
                        $scope.apikeyWarning = "";
                        $scope.currentPage = $scope.currentPage - 1;
                        console.log("Current page: " + $scope.currentPage);

                    }, err

                );
        };

        $scope.changeSizeList = function() {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey + "&limit=" + $scope.size + "&offset=" + ($scope.currentPage * $scope.size - $scope.size))
                .then(function(response) {
                        $scope.stats = response.data;
                        console.log("URL" + $scope.url + "?apikey=" + $scope.apikey + "&limit=" + $scope.size + "&offset=" + ($scope.currentPage * $scope.size - $scope.size));
                        console.log("Current Page: " + $scope.currentPage);
                        $scope.apikeyWarning = "";
                        $http
                            .get($scope.url + "?apikey=" + $scope.apikey)
                            .then(function(response) {
                                console.log("La apikey es= " + $scope.apikey);
                                $scope.numPages = Math.ceil(response.data.length / $scope.size);
                                $scope.totalPages = new Array($scope.numPages);
                                for (var i = 0; i < ($scope.totalPages.length); i++) {
                                    console.log($scope.totalPages.length);
                                    $scope.totalPages[i] = i + 1;
                                }
                                console.log("Numero de páginas: " + $scope.numPages);
                            });
                    }, err

                );
        };






        var err = function errHandler(err) {
            if (err.status === 403) {
                console.log("INFOWEB: Invalid Apikey");
                $scope.stats = null;
                $scope.apikeyWarning = "Valid apikey must be provided";
            }
            if (err.status === 401) {
                console.log("INFOWEB: Apikey unprovided");
                $scope.stats = null;
                $scope.apikeyWarning = "An apikey must be provided";
            }
            if (err.status === 400) {
                console.log("INFOWEB: 400 Bad request");
                $scope.reqStatus = "Incorrect stats, please check the fields";
            }
            if (err.status === 409) {
                console.log("INFOWEB: 409 Conflict");
                $scope.reqStatus = "That stat already exists";
            }

        };

        $scope.retrieveList = function() {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    $scope.stats = response.data;
                    console.log("La apikey es= " + $scope.apikey);
                    console.log(response);
                    $scope.apikeyWarning = "";
                }, err);
        };

        //Function for reset search
        $scope.resetSearch = function() {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    $scope.stats = response.data;
                    console.log("La apikey es= " + $scope.apikey);
                    console.log(response);
                    $scope.apikeyWarning = "";
                    $scope.reqStatus = "Welcome";
                    $scope.statQuery = "";
                }, err);
        };

        //loadInitialData
        $scope.loadInitialData = function() {
            $http.
            get($scope.url + "/loadInitialData" + "?apikey=" + $scope.apikey)
                .then(function() {
                    console.log("Initial stats loaded");
                    $scope.reqStatus = "Initial stats loaded";
                    refresh();
                }, err);
        };

        // GET a year or university
        $scope.searchStat = function() {
            //$scope.statQuery = parseInt($scope.statQuery);
            if (isNaN($scope.statQuery)) {
                $http
                    .get($scope.url + "?province=" + $scope.statQuery + "&apikey=" + $scope.apikey)
                    .then(function(response) {
                        console.log("Searching stat with province" + $scope.statQuery);
                        $scope.reqStatus = "Stats with province " + $scope.statQuery;
                        $scope.stats = response.data;
                    }, function(err) {
                        console.log("No matches");
                        if (err.status === 403) {
                            console.log("INFOWEB: Invalid Apikey");
                            console.log("Apikey INCORRECTA");
                            $scope.stats = null;
                            $scope.apikeyWarning = "Valid apikey must be provided";
                        }
                        if (err.status === 401) {
                            console.log("INFOWEB: Apikey unprovided");
                            console.log("Apikey INCORRECTA");
                            $scope.stats = null;
                            $scope.apikeyWarning = "Valid apikey must be provided";

                        }
                        if (err.status === 404) {
                            console.log("INFOWEB: No matches");
                            $scope.stats = null;
                            $scope.reqStatus = "No matches with province " + $scope.statQuery;
                            $scope.apikeyWarning = "";
                        }

                    });
            }
            else {
                $http
                    .get($scope.url + "/" + $scope.statQuery + "?apikey=" + $scope.apikey)
                    .then(function(response) {
                        console.log("Searching stat with year" + $scope.statQuery);
                        $scope.reqStatus = "Stats with year " + $scope.statQuery;
                        $scope.stats = response.data;
                    }, function(err) {
                        console.log("No matches");
                        if (err.status === 403) {
                            console.log("INFOWEB: Invalid Apikey");
                            console.log("Apikey INCORRECTA");
                            $scope.stats = null;
                            $scope.apikeyWarning = "Valid apikey must be provided";
                        }
                        if (err.status === 401) {
                            console.log("INFOWEB: Apikey unprovided");
                            console.log("Apikey INCORRECTA");
                            $scope.stats = null;
                            $scope.apikeyWarning = "Valid apikey must be provided";

                        }
                        if (err.status === 404) {
                            console.log("INFOWEB: No matches");
                            $scope.stats = null;
                            $scope.reqStatus = "No matches with year " + $scope.statQuery;
                            $scope.apikeyWarning = "";
                        }

                    });
            }

        };


        //POST over a collection
        $scope.addStat = function() {
            if ($scope.newStat) {
                $scope.newStat.year = Number($scope.newStat.year);
                $scope.newStat.diffusion = Number($scope.newStat.diffusion);
                $scope.newStat.ranking = Number($scope.newStat.ranking);
            }
            $http
                .post($scope.url + "?apikey=" + $scope.apikey, $scope.newStat)
                .then(function(response) {
                    console.log("Stat added");
                    $scope.reqStatus = "Stat created";
                    refresh();
                }, err);
        };


        //DELETE over a single resource
        $scope.deleteStat = function(university, year) {
            $http
                .delete($scope.url + "/" + university + "/" + year + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    console.log("Deleting stat: " + university + "-" + year);
                    $scope.reqStatus = "Stat deleted";
                    refresh();
                });
        };

        //DELETE over a collection

        $scope.deleteAllStats = function() {
            $http
                .delete($scope.url + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    console.log("Deleting all stats");
                    $scope.reqStatus = "All stats was been deleted";
                    refresh();
                });
        };



        refresh();

    }]);
