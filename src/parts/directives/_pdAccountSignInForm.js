(function(){
	'use strict';

	var module = angular.module('pd.account');

	module.directive('pdAccountSignInForm', [function () {
		return {
			restrict: 'E',
			template:

			'<form name="form" ng-submit="process()" class="pd-account-sign-in-form">'+
				'<input type="email" placeholder="eMail" ng-model="email" required/>'+
				'<input type="password" placeholder="Password" ng-model="secret" required/>'+
				'<div ng-if="remme"><input type="checkbox" ng-model="rememberme" /> Remember me</div>'+
				'<button type="submit" ng-disabled="form.$invalid">Sign In</button>'+
				'<div ng-if="error" class="hint-error">{{error}}</div>'+
			'</form>',

			replace:true,
			scope:{
				remme:"=rememberMe"
			},
			link: function (scope, iElement, iAttrs) {

			},
			controller:["$scope", "Account", function($scope, Account){

				$scope.process = function(){


					Account.signIn( $scope.email, $scope.secret, $scope.rememberme )
					.success(function(){
						console.log('success');
					})
					.error(function(err){
						$scope.error = err.message;
					});

					$scope.secret = undefined;

				};

			}]
		};
	}]);

}());
