(function(){
	'use strict';

	var module = angular.module('pd.account');

	module.directive('pdAccountSignInForm', [function () {
		return {
			restrict: 'E',
			template:
			
			'<form name="form" ng-submit="process()" class="pd-account-sign-in-form">'+
				'<h1>SignIn</h1>'+
				'<input type="text" placeholder="Username" ng-model="username" required/>'+
				'<input type="password" placeholder="Password" ng-model="secret" required/>'+
				'<button type="submit" ng-disabled="form.$invalid">Sign In</button>'+
				'<div ng-if="error" class="hint-error">{{error}}</div>'+
			'</form>',

			replace:true,
			scope:{

			},
			link: function (scope, iElement, iAttrs) {
				
			},
			controller:["$scope", "Account", function($scope, Account){
				
				$scope.process = function(){
					

					Account.signIn( $scope.username, $scope.secret )
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