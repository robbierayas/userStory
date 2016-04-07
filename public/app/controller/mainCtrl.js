angular.module('mainCtrl', [])

.controller('MainController', function($rootScope, $location, Auth) {
	var vm = this;

	console.log("Somebody ran MainController");
	vm.loggedIn = Auth.isLoggedIn();
	console.log("Auth.isLoggedIn?"+ vm.loggedIn);
	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn();
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
				console.log("vm.user"+ vm.user.username);
			});
	});

	vm.doLogin = function() {
		vm.processing = true;
		vm.error = '';
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;
				Auth.getUser()
					.then(function(data) {
						vm.user = data.data;
						console.log("vm.user"+ vm.user.username);
					});
				if (data.success)
					$location.path('/');
				else
					vm.error = data.message;

			});
	};

	vm.doLogout = function() {
		Auth.logout();
		$location.path('/logout');
	};
});