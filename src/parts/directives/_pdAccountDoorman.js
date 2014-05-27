(function(){
	'use strict';

	var module = angular.module('pd.account');

	module.directive('pdAccountDoorman', [function () {
		return {
			restrict: 'E',
			template:
			
			'<div ng-switch on="a">'+
				'<div ng-switch-default>'+
					'<pd-account-sign-in-form></pd-account-sign-in-form>'+
					'No account? <a href="" ng-click="s(1)">Sign up</a>.'+
				'</div>'+
				'<div ng-switch-when="1">'+
					'<pd-account-sign-up-form></pd-account-sign-up-form>'+
					'Already an account? <a href="" ng-click="s()">Sign in</a>.'+
				'</div>'+
			'</div>',

			replace:true,
			scope:{},
			link: function (scope, iElement, iAttrs) {
				
			},
			controller:["$scope", "Account", function($scope, Account){
				$scope.s = function(val) {
					$scope.a = val;
				};
			}]
		};
	}]);

}());