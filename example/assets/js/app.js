var app = angular.module('app', [
    'pd.account',
    'ui.router'
]);

app.config([
    '$stateProvider',
    'AccountProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function (
        $stateProvider,
        AccountProvider,
        $urlRouterProvider,
        $locationProvider
    ) {
        $locationProvider.html5Mode(false);

        $urlRouterProvider.otherwise('/');

        AccountProvider.config({
            afterSignInRoute: '/account',
            signInRoute:'/login'
        });

        AccountProvider.Service.prototype._signinRequest = function(data, success, error) {
            success({
                username:'plati',
                email:'mail@platdesign.de'
            });
        };

    $stateProvider
        .state('home', {
            template:'<h1>Home</h1>',
            url:'/'
        })
        .state('account', {
            template:'<h1>Account</h1>{{Account.username}}',
            resolve: AccountProvider.onlineRequired('/login'),
            controller:function(){
                console.log("account-ctrl called")
            },
            url:'/account'

        })
        .state('login', {
            template:'<pd-account-doorman />',
            url:'/login',
            resolve: AccountProvider.offlineRequired('/')
        })


}]);


app.controller('appCtrl',['$scope', 'Account', function ($scope, Account) {
    $scope.Account = Account;
}])
