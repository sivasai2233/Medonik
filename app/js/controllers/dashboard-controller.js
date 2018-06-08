app.controller('DashboardController', function ($scope, $http) {

	var refresh = function() {
		$http.get('/api/dashboard-counts').success(function(response) {
			$scope.dataObject = response.data;
			console.log(response.data);
		})
	}

	refresh();
	
});