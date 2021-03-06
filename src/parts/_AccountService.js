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
	Account.prototype.signIn = Account.prototype.signIn || function(email, secret, rememberme){
		var that = this;

		var deferred = new AccountDeferred();
		var promise = deferred.promise;

		if(email && secret) {

			that._signinRequest({
				email:email,
				secret:secret,
				rememberme:rememberme
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
		$http.post( this.config.get('backendUrl') + '/signout' )
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
		this.email = undefined;
		delete $cookies[ this.config.get('cookiename') ];
	};





	/**
	 * Loads the account-data from server
	 * @return {void}
	 */
	Account.prototype.load = Account.prototype._load || function(){
		var that = this;
		if( this.isOnline() ) {
			this._loadRequest(function(data){
				that.username = data.username;
				that.email = data.email;
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
