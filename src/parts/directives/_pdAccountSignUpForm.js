(function(){
	'use strict';

	var module = angular.module('pd.account');

	module.directive('pdAccountSignUpForm', [function () {
		return {
			restrict: 'E',
			template:
			
			'<form ng-submit="process()" class="pd-account-sign-up-form">'+
				'<h1>SignUp</h1>'+
				'<input type="text" placeholder="Username" ng-model="username" />'+
				'<input type="text" placeholder="eMail" ng-model="email" />'+

				'<input type="password" placeholder="Password" ng-model="secret" />'+
				'<button type="submit">Sign Up</button>'+
			'</form>',

			replace:true,
			scope:{

			},
			link: function (scope, iElement, iAttrs) {

			},
			controller:["$scope", "Account", function($scope, Account){
				
				$scope.process = function(){
					Account.signUp( $scope.email, $scope.username, $scope.secret );
				};
			
			}]
		};
	}]);

}());