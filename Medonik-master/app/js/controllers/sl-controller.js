'use strict';

app.controller('ServiceLocationController', function ($scope, $rootScope, $modal, $sce, $http, $state) {

	var actionHtmlContent = '<div class="ui-grid-cell-contents">'
							+ '<a href="" ng-click="grid.appScope.openModal(\'location-form-modal\', undefined, false, {status: true, id: row.entity._id}, false)" class="edit">'
							+ '<i class="linecons-pencil"></i>'
							+ 'Edit'
							+ '</a>&nbsp'
							+ '<a href="" ng-click="grid.appScope.openModal(\'user-delete-modal\', undefined, false, false, {status: true, id: row.entity._id})" class="edit">'
							+ '<i class="linecons-trash"></i>'
							+ 'Delete'
							+ '</a>'
							+ '</div>'

	$scope.gridOptions = {
		// rowHeight: 40,
		enableFiltering: true,
		enableSorting: true,
		paginationPageSizes: [25, 50, 75],
		paginationPageSize: 10,
		columnDefs: [
			{
				name:  'S.No',
				field: 'name',
				cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
			},
			{field: 'location'},
			{field: 'status',  cellFilter: 'statusFilter'},
			{
				name:  'Action',
				field: 'name',
				cellTemplate: actionHtmlContent
			}
		],
		onRegisterApi: function (gridApi) {
			$scope.grid1Api = gridApi;
		}
	};

	var refresh = function() {
		$http.get('/api/locations').success(function(response) {
			if(response.success) {
				$scope.locations = response.data;
				$scope.gridOptions.data = response.data;
			}
		});
	}

	refresh();

	$state.reload();

	// Open Simple Modal
	$scope.openModal = function(modal_id, modal_size, isCreate, isEdit, isDelete, modal_backdrop)
	{
		$rootScope.currentModal = $modal.open({
			templateUrl: modal_id,
			size: modal_size,
			backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
			controller: function($scope, $http, $modalInstance, $state) {
				$scope.location = {};
				$scope.showAlert = false;
				$scope.isEdit = false;

				var refresh = function() {
					$http.get('/api/locations').then(function(response) {
						if(response.data.success) {
							$scope.locations = response.data.data;
						}
					});

					if(isEdit.status) {
						$scope.isEdit = true;
						$http.get('/api/location/' + isEdit.id).success(function(response) {
							$scope.location = response.data;
						});
					}
				};

				refresh();

				if(isCreate) {
					$scope.createLocation = function() {
						$http.post('/api/location/create', $scope.location).then(function(response) {
							if(response.data.success) {
								refresh();
								$scope.showAlert = true;
								$scope.alert = {message: response.data.message, status: 'success'};
								$scope.location = {};
								$state.reload();
							}
							else {
								$scope.showAlert = true;
								$scope.alert = {message: response.data.error, status: 'danger'};
							}
						})
					}
				}

				if(isEdit.status) {
					$scope.updateLocation = function() {
						$http.post('/api/location/update/', $scope.location).success(function(response) {
							if(response.success) {
								refresh();
								$state.reload();
								$modalInstance.close();
							}
							else {
								$state.reload();
								$modalInstance.close();
							}
						})
					}
				}

				if(isDelete.status) {
					$scope.deleteLocation = function() {
						$http.delete('/api/location/delete/' + isDelete.id).then(function(response) {
							if(response.data.success) {
								refresh();
								$state.reload();
								$modalInstance.close();
							}
							else {
								$state.reload();
								$modalInstance.close();
							}
						})
					}
				}

			}
		});
	};
});
