(function (root, factory) {

	var moduleName = 'pd.account';

	if (typeof define === 'function' && define.amd) {
		define([moduleName], factory);
	} else {
		factory();
	}

}(this, function () {

	'use strict';
	var module = angular.module('pd.account', ['ngCookies']);

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

			onlineRequiredOtherwiseRoute: '/',
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
		
var Account = this.Service = function(){
	this.username = undefined;
	this.config = AccountConfig;
};


var AccountService = ["$http", "$q", "$cookies", "$timeout", "$location",
			function($http, $q, $cookies, $timeout, $location) {


	/**
	 * Creates a Deferred Object with success and error function.
	 */
	var AccountDeferred = function(){
		var d = $q.defer();
		var p = d.promise;

		p.error = function(cb){
			p.then(null, cb);
			return p;
		};
		p.success = function(cb){
			p.then(cb);
			return p;
		};

		return d;
	};





	/**
	 * Checks if the account is signed in or not.
	 * @return {Boolean}
	 */
	Account.prototype.isOnline = Account.prototype.isOnline || function() {
		return ( $cookies[ this.config.get('cookiename') ] );
	};






	// Sign In
	// -------------------------------------------------

	/**
	 * Sign in an account
	 * @param  {string} email [description]
	 * @param  {string} secret   [description]
	 * @return {void}
	 */
	Account.prototype.signIn = Account.prototype.signIn || function(email, secret){
		var that = this;

		var deferred = new AccountDeferred();
		var promise = deferred.promise;

		if(email && secret) {

			that._signinRequest({
				email:email,
				secret:secret
			}, function(data){
				deferred.resolve(data);
			}, function(){
				deferred.reject({
					message:'Something went wrong'
				});
			});

		} else {
			deferred.reject({
				message:'Missing input'
			});
		}

		promise.success(function(data){
			data = data || {};

			that.username = data.username;
			that.email = data.email;
			$location.path( that.config.get('afterSignInRoute') );
		});

		return promise;
	};

	/**
	 * Private method which requests the server to signin an account
	 * @param  {object} data    email, secret
	 * @param  {callback} success
	 * @param  {callback} error
	 * @return {void}
	 */
	Account.prototype._signinRequest = Account.prototype._signinRequest || function(data, success, error) {
		$http.post( this.config.get('backendUrl') + '/signin', data )
		.success(success)
		.error(error);
	};






	// Sign Out
	// -------------------------------------------------

	/**
	 * Sign out an account
	 * @return {void} [description]
	 */
	Account.prototype.signOut = Account.prototype.signOut || function(){
		var that = this;

		this._signoutRequest(function(){
			that._reset();
			$location.path( that.config.get('afterSignOutRoute') );
		}, function(){
			// TODO: ERROR Handling!!!
		});
	};



	/**
	 * Private method which requests the server to signout an account
	 * @param  {Object} data username, email, secret
	 * @param  {callback} success
	 * @param  {callback} error
	 * @return {void}
	 */
	Account.prototype._signoutRequest = Account.prototype._signupRequest || function(success, error) {
		$http.post( this.config.get('backendUrl') + '/signout', data )
		.success(success)
		.error(error);
	};




	// Sign Up
	// -------------------------------------------------


	/**
	 * Sign up an account
	 * @param  {String} username [description]
	 * @param  {String} email    [description]
	 * @param  {String} secret   [description]
	 * @return {void}          	 [description]
	 */
	Account.prototype.signUp = Account.prototype.signUp || function(email, secret, obj) {
		var that = this;

		var deferred = new AccountDeferred();
		var promise = deferred.promise;

		if(email && secret) {
			obj.email = email;
			obj.secret = secret;

			that._signupRequest(obj, function(data){
				deferred.resolve(data);
			}, function(){
				deferred.reject({
					message:'Something went wrong'
				});
			});

		} else {
			deferred.reject({
				message:'Missing input'
			});
		}

		promise.success(function(data){
			data = data || {};
			that.username = data.username;
			that.email = data.email;
			$location.path( that.config.get('afterSignUpRoute') );
		});

		return promise;
	};

	/**
	 * Private method which requests the server to sinup a new account
	 * @param  {Object} data username, email, secret
	 * @param  {callback} success
	 * @param  {callback} error
	 * @return {void}
	 */
	Account.prototype._signupRequest = Account.prototype._signupRequest || function(data, success, error) {
		$http.post( this.config.get('backendUrl') + '/signup', data )
		.success(success)
		.error(error);
	};













	// Destroy
	// -------------------------------------------------


	/**
	 * Destroys an account
	 * @return {void}
	 */
	Account.prototype.destroy = Account.prototype.destroy || function(){
		this._destroyRequest({}, function(){
			//Success
		}, function(){
			//Error
		});
	};

	/**
	 * Private method to reuqest the server for destroying an account
	 * @param  {object} data username, email, secret, userid, etc.
	 * @param  {callback} success
	 * @param  {callback} error
	 * @return {void}
	 */
	Account.prototype._destroyRequest = Account.prototype._destroyRequest || function(data, success, error) {
		success();
	};













	/**
	 * Private service resetter
	 * @return {void}
	 */
	Account.prototype._reset = Account.prototype._reset || function(){
		this.username = undefined;
		delete $cookies[ this.config.get('cookiename') ];
	};





	/**
	 * Loads the account-data from server
	 * @return {void}
	 */
	Account.prototype.load = Account.prototype._load || function(){
		var that = this;
		if( this.isOnline() ) {
			this._loadRequest(function(){
				that.username = 'plati';
			}, function(){
				that._reset();
				console.error('pdAccount: cant load account data');
			});
		}
	};

	/**
	 * Private mehtod to request the server for the account-data by cookie
	 * @param  {closure} success
	 * @param  {closure} error
	 * @return {void}
	 */
	Account.prototype._loadRequest = Account.prototype._loadRequest || function(success, error) {
		$http.get( AccountConfig.get('backendUrl') )
		.success(success)
		.error(error);
	};



	var service = new Account();
	service.load();
	return service;
}];

		this.$get = AccountService;

	}]);

}());
(function(){
	'use strict';

	var module = angular.module('pd.account');

	module.directive('pdAccountButton', [function () {
		return {
			restrict: 'E',
			template:
			'<button ng-class="class" ng-click="process()">'+
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

}());(function(){
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

}());(function(){
	'use strict';

	var module = angular.module('pd.account');

	module.directive('pdAccountSignInForm', [function () {
		return {
			restrict: 'E',
			template:
			
			'<form name="form" ng-submit="process()" class="pd-account-sign-in-form">'+
				'<input type="email" placeholder="eMail" ng-model="email" required/>'+
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
					

					Account.signIn( $scope.email, $scope.secret )
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

}());(function(){
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
				'<button type="submit" ng-disabled="form.$invalid">Sign Up</button>'+
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

	return module;
}));
