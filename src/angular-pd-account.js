(function (root, factory) {

	var moduleName = 'pdaccount';

	if (typeof define === 'function' && define.amd) {
		define([moduleName], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root[moduleName] = factory();
	}

}(this, function () {
	
	'use strict';
	var module = angular.module('pd.account', ['ngCookies']);

	//= include parts/_AccountConfig.js
	//= include parts/_AccountProvider.js
	//= include_tree parts/directives
	
	return module;
}));