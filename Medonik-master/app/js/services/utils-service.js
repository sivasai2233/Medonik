app.service('utilsService', function ($http) {
	return {
		getUserInfo: function() {
			$http.get('/api/get-user-info').then(function(response) {
				return response.data;
			});
		}
	}
})