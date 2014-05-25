(function(){
	'use strict';

	var module = angular.module('pd.account');

	module.provider('Account', [
		"$injector", 
		"AccountConfigProvider", 
		function ($injector, AccountConfig) {
		
		var provider = this;

		



		/**
		 * Set config values
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		this.config = function(obj) {
			AccountConfig.setFromObj(obj);
		};



		/**
		 * Resolvemiddleware to for routes where the user has to be signed in
		 * @param  {Route} otherwiseRoute - An alternative for AccountConfig.onlineRequiredOtherwiseRoute
		 * @return {Promise}
		 */
		this.onlineRequired = function(otherwiseRoute) {
			otherwiseRoute = otherwiseRoute || AccountConfig.get('onlineRequiredOtherwiseRoute');

			return ['$location', '$q', 'Account', '$timeout', function($location, $q, Account, $timeout) {
				var deferred = $q.defer();

				if(! Account.isOnline() ) {
					deferred.reject();
					$timeout(function(){
						 $location.path(otherwiseRoute);
					});
				} else {
					deferred.resolve();
				}

				return deferred.promise;
			}];

		};





		/**
		 * Resolvemiddleware to for routes where the user has to be signed out
		 * @param  {Route} otherwiseRoute - An alternative for _config.offlineRequiredOtherwiseRoute
		 * @return {[type]}                [description]
		 */
		this.offlineRequired = function(otherwiseRoute) {
			otherwiseRoute = otherwiseRoute || AccountConfig.get('offlineRequiredOtherwiseRoute');

			return ['$location', '$q', 'Account', '$timeout', function($location, $q, Account, $timeout) {
				var deferred = $q.defer();

				if( Account.isOnline() ) {
					deferred.reject();
					$timeout(function(){
						 $location.path(otherwiseRoute);
					});
				} else {
					deferred.resolve();
				}

				return deferred.promise;
			}];

		};

		

		
		// ***** SERVICE ******
		
		//= include _AccountService.js
		this.$get = AccountService;

	}]);

}());