'use strict';

app.controller('SpecializationController', function ($scope, $rootScope, $modal, $sce, $http, $state) {

	var actionHtmlContent = '<div class="ui-grid-cell-contents">'
							+ '<a href="" ng-click="grid.appScope.openModal(\'specialization-form-modal\', undefined, false, {status: true, id: row.entity._id}, false)" class="edit">'
							+ '<i class="linecons-pencil"></i>'
							+ 'Edit'
							+ '</a>&nbsp'
							// + '<a href="" ng-click="grid.appScope.openModal(\'user-delete-modal\', undefined, false, false, {status: true, id: row.entity._id})" class="edit">'
							// + '<i class="linecons-trash"></i>'
							// + 'Delete'
							// + '</a>'
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
			{field: 'specialization'},
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

	$http.get('/api/specializations').success(function(response) {
		if(response.success) {
			$scope.specializations = response.data;
			$scope.gridOptions.data = response.data;
		}
	});

	$state.reload();

	// Open Simple Modal
	$scope.openModal = function(modal_id, modal_size, isCreate, isEdit, isDelete, modal_backdrop)
	{
		$rootScope.currentModal = $modal.open({
			templateUrl: modal_id,
			size: modal_size,
			backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
			controller: function($scope, $http, $modalInstance, $state) {
				$scope.specialization = {};
				$scope.showAlert = false;
				$scope.isEdit = false;

				var refresh = function() {
					console.log(isEdit);
					if(isEdit.status) {
						$http.get('/api/specialization/' + isEdit.id).success(function(response) {
							console.log(response);
							$scope.specialization = response.data;
							$scope.isEdit = true;
						})
					}
				};

				refresh();

				if(isCreate) {
					$scope.createSpecialization = function() {
						$http.post('/api/specialization/create', $scope.specialization).then(function(response) {
							if(response.data.success) {
								refresh();
								$scope.showAlert = true;
								$scope.alert = {message: response.data.message, status: 'success'};
								$scope.specialization = {};
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
					$scope.updateSpecialization = function() {
						$http.post('/api/specialization/update', $scope.specialization).then(function(response) {
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
