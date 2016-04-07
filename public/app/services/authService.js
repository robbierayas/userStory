angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken) {

	var authFactory = {};
	authFactory.login = function(username, password) {
		return $http.post('/api/login', {
				username: username,
				password: password
			})
			.success(function(data) {
				AuthToken.setToken(data.token);
				return data;
			});
	};
	authFactory.logout = function() {
		AuthToken.setToken();
	};
	authFactory.isLoggedIn = function() {
		console.log("Somebody is Logging In...");
		if (AuthToken.getToken()) {			
			console.log("Somebody is Logged In!");
			return true;
		} else {
			console.log("Somebody didn't Log In");
			return false;
		}
	};
	authFactory.getUser = function() {
		console.log("authFactory.getUser");
		if (AuthToken.getToken()){
			console.log("if (AuthToken.getToken())");
			return $http.get('/api/me');
		}else{
			return $q.reject({
				message: "User has no token"
			});
		}
	};

	return authFactory;
})

.factory('AuthToken', function($window) {
	var authTokenFactory = {};

	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};
	authTokenFactory.setToken = function(token) {
		if (token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	};
	return authTokenFactory;
})

.factory('AuthInterceptor', function($q, $location, AuthToken) {
	var interceptorFactory = {};
	interceptorFactory.request = function(config) {
		var token = AuthToken.getToken();
		if (token) {
			config.headers['x-access-token'] = token;
		}
		return config;
	};
	interceptorFactory.responseError = function(response) {
		if (response.status == 403)
			$location.path('/login');
		return $q.reject(response);
	};
	return interceptorFactory;
});