(function(){
	'use strict';

	var module = angular.module('pd.account');

	module.directive('pdAccountButton', [function () {
		return {
			restrict: 'E',
			template:
			'<button class="btn pd-account-button" ng-class="class" ng-click="process()">'+
				'{{label()}}'+
			'</button></div>',
			replace:true,
			scope:{

			},
			link: function (scope, iElement, iAttrs) {

			},
			controller:["$scope", "Account", "$location", function($scope, Account, $location){


				$scope.class = {
					'btn-singin':Account.isOnline
				};

				$scope.label = function() {
					if( Account.isOnline() ) {
						return 'Sign out';
					} else {
						return 'Sign In';
					}
				};

				$scope.process = function() {
					if( !Account.isOnline() ) {
						$location.path( Account.config.get('signInRoute') );
					} else {
						Account.signOut();
					}
				};
			}]
		};
	}]);

}());
