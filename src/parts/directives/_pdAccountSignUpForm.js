(function(){
	'use strict';

	var module = angular.module('pd.account');

	module.directive('pdAccountSignUpForm', [function () {
		return {
			restrict: 'E',
			template:

			'<form name="form" ng-submit="process()" class="pd-account-sign-up-form">'+
				'<input type="text" placeholder="Username" ng-model="username" required/>'+
				'<input type="email" placeholder="eMail" ng-model="email" required/>'+

				'<input type="password" placeholder="Password" ng-model="secret" required/>'+
				'<button class="btn pd-account-button btn-submit btn-signup" type="submit" ng-disabled="form.$invalid">Sign Up</button>'+
			'</form>',

			replace:true,
			scope:{

			},
			link: function (scope, iElement, iAttrs) {

			},
			controller:["$scope", "Account", function($scope, Account){

				$scope.process = function(){
					Account.signUp( $scope.email, $scope.secret, {
						username: $scope.username
					});
				};

			}]
		};
	}]);

}());
