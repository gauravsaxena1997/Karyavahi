/*!
 * AngularJS controllers
 * Version: 1
 *
 * Copyright 2016 Janaagraha.  
 *
 * Author: Jeeva D <jeevananthamcse@gmail.com>
 * Related to project of Swachh Bharath
 */
//app.controller('AppCtrl', function ($scope, $location, $http, Data, $window) {
//    
//});
var app = angular.module('myApp', ['ui.bootstrap', 'chart.js']);
app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }]);
app.controller('authCtrl', function ($scope, $location, $http, $window, $timeout) {
    $scope.isanalytics = false;
    //initially set those objects to null to avoid undefined error
	if($window.location.pathname == "/login")
        $('#loginModal').modal('show');
    else if($window.location.pathname == "/register") {
        $('#loginModal').modal('show');
		$scope.isLogin = true;
    }
    if($window.location.pathname == "/forgotpassword"){
          $scope.forgotPassword={};
            $scope.forgotPassword.email = $window.location.search.split('=')[1];
         $('#newPasswordModal').modal('show');
     }
        if($window.location.pathname == "/analytics")
         $scope.isanalytics = false;
    $scope.login = {};
    $scope.mobile_number = '';
    $scope.changePassword = function (user) {
        $http.defaults.headers.post[globalConfig.csrf_token_name] = getCookie(globalConfig.csrf_cookie_name);
        $http.post('/Authenticate/reset_password', {
            user: user
        }).success(function (results) {
            if (results.status == "success") {
                $window.location.href = globalConfig.siteURL + results.redirect + '#/complaint/list';
            } else if (results.status == "error") {
                $scope.invalid_password = results.message;
            }
        });
    };
    $scope.doLogin = function (user) {
        $http.defaults.headers.post[globalConfig.csrf_token_name] = getCookie(globalConfig.csrf_cookie_name);
        $http.post('/Authenticate/ajax_login', {
            user: user
        }).success(function (results) {
            if (results.status == "success") {
                // $location.path('dashboard');
                if(results.role_id == 10){
                  $window.location.href = globalConfig.siteURL + results.redirect + '#/complaint/approval'; 
                } else if (results.role_id == 9){
                    $window.location.href = globalConfig.siteURL + results.redirect + '#/report/mouhdata';
                }else{
                    $window.location.href = globalConfig.siteURL + results.redirect + '#/complaint/list';
                }
            } else if (results.status == "error") {
                $scope.invalid_login = results.message;
            }
        });
    };
    $scope.engLogin = function (user) {
        $scope.mobile_number = user.mobile;
        $http.defaults.headers.post[globalConfig.csrf_token_name] = getCookie(globalConfig.csrf_cookie_name);
        $http.post('/Authenticate/ajax_engineer_login', {
            user: user
        }).success(function (results) {
            if (results.status == "success") {
                $('#loginModal').modal('hide');
                $scope.userId = results.user_id;
                $('#modalEngineerLogin').modal('show');
            } else if (results.status == "error") {
                $scope.invalid_login = results.message;
            }
        });
    };
    $scope.sendMail = function(email){
        $http.defaults.headers.post[globalConfig.csrf_token_name] = getCookie(globalConfig.csrf_cookie_name);
        $http.post('/Authenticate/forgot_password', {
            data: email
        }).success(function (results) {
            if (results.status == "success") {
                $('#loginModal').modal('hide');
                $('#forgotInstruction').modal('show');
            } else if (results.status == "error") {
                $scope.invalid_email = results.message;
            }
        });
    }
    
    $scope.otpResend = function (mobile, userId) {
        $http.defaults.headers.post[globalConfig.csrf_token_name] = getCookie(globalConfig.csrf_cookie_name);
        $http.post('/Authenticate/otp_resend', {number: mobile, user: userId}).success(function (results) {
            if (results.status == "success") {

            }
        });
    }
    $scope.otpVerification = function (otp, user) {
        $http.defaults.headers.post[globalConfig.csrf_token_name] = getCookie(globalConfig.csrf_cookie_name);
        $http.post('/Authenticate/engineer_login', {otp: otp, userId: user}).success(function (results) {
            if (results.status == "success") {
                $window.location.href = globalConfig.siteURL + results.redirect + '#/complaint/list';
            } else if (results.status == "error") {
                console.log(results.message);
                $scope.invalid_otp = results.message;
            }
        });
    }
    $http.get('/settings/get_statelist/').then(function (response) {
       $scope.states = response.data.result;
       $timeout(function () {
             $('#states').trigger('chosen:updated');
         }, 0, false);
    });
    $scope.getDistrict = function (state) {
        $http.get('/settings/get_districtlist/' + state).then(function (response) {
       $scope.districts = response.data.result;
       $scope.ulbs = [];
       $timeout(function () {
             $('#district').trigger('chosen:updated');
             $('#ulb').trigger('chosen:updated');
         }, 0, false);
       });
    }
    $scope.getUlbs = function (dist) {
        $http.get('/settings/get_ulbslist/' + dist).then(function (response) {
       $scope.ulbs = response.data.result;
       $timeout(function () {
             $('#ulb').trigger('chosen:updated');
         }, 0, false);
       });
    }
    
    $scope.doRegister = function (user) {
        if ($scope.registerForm.$invalid) {
            return false;
        }
        $http.defaults.headers.post[globalConfig.csrf_token_name] = getCookie(globalConfig.csrf_cookie_name);
        $http.post('/Settings/admin_register', {
            user: user
        }).success(function (results) {
            if (results.status == "success") {
                $scope.register = {};
                $timeout(function () {
                        $('#states').trigger('chosen:updated');
                        $('#district').trigger('chosen:updated');
                        $('#ulb').trigger('chosen:updated');
                    }, 0, false);
                 
                $('#loginModal').modal('hide');
                $('#thankYouModel').modal('show');
            } else if (results.status == "error") {
                $scope.invalid_register = results.message;
            }
        });
    };
    /**
     * 
     * 
     */
    /*$scope.initialize = function () {
        console.log('initializing');
        var input = document.getElementById('location');
        var options = {componentRestrictions: {country: 'in'}};

        var autocomplete = new google.maps.places.Autocomplete(input, options);

        //var autocomplete_end = new google.maps.places.Autocomplete(input_end);
        google.maps.event.addListener(autocomplete, 'place_changed', function () {

            var place = autocomplete.getPlace();
            $scope.register.location = place.formatted_address;
            if (typeof place.geometry != 'undefined') {
                $scope.register.latitude = place.geometry.location.lat();
                $scope.register.longitude = place.geometry.location.lng();
                angular.forEach(place.address_components, function (value, key) {
                    if (value.types.indexOf("locality") != -1) {
                        $scope.register.locality = value.long_name;
                    }
                });
                NextpageNumber = 0;
            } else {
                $(".pac-container").hide();
                var firstResult = $(".pac-container .pac-item:first").text();
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({"address": firstResult}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $scope.register.latitude = results[0].geometry.location.lat();
                        $scope.register.longitude = results[0].geometry.location.lng();
                        angular.forEach(place.address_components, function (value, key) {
                            if (value.types.indexOf("locality") != -1) {
                                $scope.register.locality = value.long_name;
                            }
                        });
                        NextpageNumber = 0;
                        //$scope.get_complaints();
                    }
                });
                $("#location").val(firstResult);
            }
        });
    }*/
    //$scope.initialize();
});

app.controller('navCtrl', function ($scope, Data, $window) {
    $scope.logout = function () {
        Data.get('/Authenticate/logout').then(function (results) {
            Data.toast(results);
            $window.location.href = '/';
        });
    }
});
app.controller('rankingDashboardCtrl', function ($scope, $http, $timeout) {
    $scope.analytics = [];
    $scope.loading = false;
    /* pagination settings */
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 9;
    $scope.maxSize = 5;
    $scope.state = 'DESC';
    $scope.orderby = 'id';
    $scope.type = 'city';

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    /*on page change*/
    $scope.pageChanged = function () {
        getResultsPage();
    };
    /* pagination settings */


    /***Date range***/
    $scope.day = 7;
    $scope.setDays = function (day) {
        $scope.day = day;
        $scope.getComplaintData();
    };
    //population list
    $scope.populationList = [{id:1,title:'>= 10 LAKH'},{id:2,title:'< 10 LAKH'}];
    $timeout(function () {
             $('#population').trigger('chosen:updated');
         }, 0, false);
    //sorting list
    $scope.sortList = [{id:1,title:'User Engagement'},{id:2,title:'User Happiness'},{id:3,title:'ULB Response'}];
    $timeout(function () {
             $('#sortList').trigger('chosen:updated');
         }, 0, false);
    //Watch for date changes
    /***Date range***/
    $scope.getList = function (type) {
        $scope.type = type;
        $scope.currentPage = 1;
        getResultsPage();
    };
    $scope.setPopulationType = function (type) {
        $scope.populationType = type;
        $scope.currentPage = 1;
        getResultsPage();
    };
    $scope.setSortType = function (Val) {
        $scope.filterby = Val;
        $scope.currentPage = 1;
        getResultsPage();
    };
    $http.get('/settings/get_statelist/').then(function (response) {
       $scope.stateList = response.data.result;
       $timeout(function () {
             $('#stateList').trigger('chosen:updated');
         }, 0, false);
    });
    /*$http.get('/settings/get_ulblist_from_city/').then(function (response) {
       $scope.citiesList = response.data.result;
       $timeout(function () {
             $('#citiesList').trigger('chosen:updated');
         }, 0, false);
    });*/
    $scope.populationType = 3;
    $scope.city = 0;
    $scope.state = 0;
    $scope.filterby = 0;
    getResultsPage();
    function getResultsPage() {
        $scope.loading = true;
        //$http.get('/analytic/get_analytics/' + $scope.type + '/' + $scope.itemsPerPage + '/' + $scope.currentPage,
        $http.get('/analytic/get_ranking_dashboard/' + $scope.city + '/' + $scope.state + '/' + $scope.populationType + '/' + $scope.filterby + '/' + $scope.itemsPerPage + '/' + $scope.currentPage,
                {filters: $scope.filter}).success(function (response) {
            $scope.loading = false;
            $scope.analytics = response.result;
            $scope.totalItems = response.total_count;
        });
    }
    $scope.getState = function (key) {
        $scope.population = key;
        getResultsPage(); 
        //Fetch district on the basis of state
        $http.get('settings/get_state_by_population/' + $scope.population).then(function (response) {
            $scope.stateList = response.data.result;
            $timeout(function () {
                $('#stateList').trigger('chosen:updated');
            }, 0, false);
        });
    }
    $scope.getCities = function (key) {
        $scope.state = key;
        //Fetch district on the basis of state
        $http.get('settings/get_cities_by_state/'+ $scope.population +'/'+ $scope.state).then(function (response) {
            $scope.citiesList = response.data.result;
            $timeout(function () {
                $('#citiesList').trigger('chosen:updated');
            }, 0, false);
        });
       getResultsPage();
    }
    $scope.getResultByCity = function(key){
        $scope.city = key; 
        getResultsPage();
    }
    $scope.getFilter = function (key){
        $scope.filterby = key; 
        getResultsPage();
    }
    //for filtering location
     $scope.location = '';

    $scope.getLocation = function (val) {
        return $http.get('/analytic/get_location/' + val).then(function (response) {
           return response.data.result;
        });
    };
    $scope.getCitydata = function(){
        if($scope.location.id){
            $scope.city = $scope.location.id;
                $http.get('/analytic/get_city_bucket/' + $scope.location.id).then(function (response) {
                $scope.setPopulationType(response.data);
            });
        }
    }
    $scope.redirectToRanking = function(){
        if($scope.location.id){
            $scope.city = $scope.location.id;
            window.location=window.globalConfig.baseURL+'rank/'+$scope.location.id;
        }
    }
    $scope.searchClose = function(){
        $scope.city = 0;
        $scope.location = '';
        getResultsPage();
    }
    $scope.redirectPage = function(key){
       window.location=window.globalConfig.baseURL+'city/'+key;
    }
});
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
       });
    };
});
app.controller('engineerDashboardCtrl', function($scope, $http, $timeout) {
    $scope.analytics = [];
    $scope.loading = false;
    /* pagination settings */
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 9;
    $scope.maxSize = 5;
    $scope.state = 'DESC';
    $scope.orderby = 'id';
    $scope.type = 'city';

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    /*on page change*/
    $scope.pageChanged = function () {
        getResultsPage();
    };
    /* pagination settings */


    /***Date range***/
    $scope.day = 7;
    $scope.setDays = function (day) {
        $scope.day = day;
        $scope.getComplaintData();
    };
    
    //Watch for date changes
    /***Date range***/
    $scope.getList = function (type) {
        $scope.type = type;
        $scope.currentPage = 1;
        getResultsPage();
    };
    $scope.setRankType = function (type) {
        $scope.setTabType = type;
        $scope.currentPage = 1;
        getResultsPage();
    };
    $scope.setSortType = function (Val) {
        $scope.filterby = Val;
        $scope.currentPage = 1;
        getResultsPage();
    };
    $http.get('/settings/get_statelist/').then(function (response) {
        $scope.stateList = response.data.result;
        $timeout(function () {
            $('#stateList').trigger('chosen:updated');
        }, 0, false);
    });
    /*$http.get('/settings/get_ulblist_from_city/').then(function (response) {
     $scope.citiesList = response.data.result;
     $timeout(function () {
     $('#citiesList').trigger('chosen:updated');
     }, 0, false);
     });*/
    $scope.setTabType = 1;
    $scope.city = 0;
    $scope.state = 0;
    $scope.filterby = 0;
    getResultsPage();
    function getResultsPage() {
        $scope.loading = true;
        //$http.get('/analytic/get_analytics/' + $scope.type + '/' + $scope.itemsPerPage + '/' + $scope.currentPage,
        $http.get('/analytic/get_engineer_ranking_dashboard/' + $scope.city + '/' + $scope.state + '/' + $scope.setTabType + '/' + $scope.filterby + '/' + $scope.itemsPerPage + '/' + $scope.currentPage,
                {filters: $scope.filter}).success(function (response) {
            $scope.loading = false;
            $scope.analytics = response.result;
            $scope.totalItems = response.total_count;
        });
    }
    $scope.getState = function (key) {
        $scope.population = key;
        getResultsPage();
        //Fetch district on the basis of state
        $http.get('settings/get_state_by_population/' + $scope.population).then(function (response) {
            $scope.stateList = response.data.result;
            $timeout(function () {
                $('#stateList').trigger('chosen:updated');
            }, 0, false);
        });
    }
    $scope.getCities = function (key) {
        $scope.state = key;
        //Fetch district on the basis of state
        $http.get('settings/get_cities_by_state/' + $scope.population + '/' + $scope.state).then(function (response) {
            $scope.citiesList = response.data.result;
            $timeout(function () {
                $('#citiesList').trigger('chosen:updated');
            }, 0, false);
        });
        getResultsPage();
    }
    $scope.getResultByCity = function (key) {
        $scope.city = key;
        getResultsPage();
    }
    $scope.getFilter = function (key) {
        $scope.filterby = key;
        getResultsPage();
    }
    //for filtering location
    $scope.location = '';

    $scope.getLocation = function (val) {
        return $http.get('/analytic/get_engineerName/' + val).then(function (response) {
            return response.data.result;
        });
    };
    $scope.getCitydata = function () {
        if ($scope.location.id) {
            $scope.city = $scope.location.id;
               $scope.setTabType = 1;
               getResultsPage();
            }
    }
    $scope.redirectToRanking = function () {
        if ($scope.location.id) {
            $scope.city = $scope.location.id;
            window.location = window.globalConfig.baseURL + 'rank/' + $scope.location.id;
        }
    }
    $scope.searchClose = function () {
        $scope.city = 0;
        $scope.location = '';
        getResultsPage();
    }
    $scope.redirectPage = function (key) {
        window.location = window.globalConfig.baseURL + 'city/' + key;
    }
    
});
