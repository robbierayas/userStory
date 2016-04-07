angular.module('MyApp', ['mainCtrl', 'authService', 'appRoutes', 'userCtrl', 'userService','storyService','storyCtrl','reverseDirective'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');
});