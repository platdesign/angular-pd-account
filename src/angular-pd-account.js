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

	//= include parts/_AccountConfig.js
	//= include parts/_AccountProvider.js
	//= include_tree parts/directives
	
	return module;
}));