(function(){

	'use strict';

	var module = angular.module('pd.account');

	module.provider('AccountConfig', [function () {

		var service = this;

		var config = {
			cookiename:			'account',

			signInRoute: '/signin',

			afterSignInRoute:	'/',
			afterSignOutRoute:	'/',
			afterSignUpRoute:	'/',
			afterDestroyRoute:	'/',

			onlineRequiredOtherwiseRoute: '/signin',
			offlineRequiredOtherwiseRoute: '/',




			backendUrl:			'/account'
		};

		this.get = function(key) {
			return config[key];
		};

		this.set = function(key, val) {
			config[key] = val;
		};

		this.setFromObj = function(obj) {
			angular.extend(config, obj);
		};

		this.$get = [function(){
			return service;
		}];
	}]);

}());
