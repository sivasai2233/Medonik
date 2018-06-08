'use strict';

app.controller('CustomerController', function ($scope, $http, $state, $stateParams, $rootScope, $modal, $sce, $location, $compile) {

	$scope.customer = {}
	$scope.showAlert = false;
	$scope.isUpdate = false;
	$scope.profilePic = {};
	var patientActionHtmlContent = "";

	if($stateParams.customerId !== undefined) {
		$scope.urlCustomerId = $stateParams.customerId;
		patientActionHtmlContent = '<div class="ui-grid-cell-contents">'
								+ '<a ui-sref="app.customer-patient-view({customerId: grid.appScope.urlCustomerId, patientId: row.entity._id})" class="edit">'
								+ '<i class="linecons-eye"></i>'
								+ 'View'
								+ '</a>&nbsp'
								+ '<a ui-sref="app.customer-patient-edit({customerId: grid.appScope.urlCustomerId, patientId: row.entity._id})" class="edit">'
								+ '<i class="linecons-pencil"></i>'
								+ 'Edit'
								+ '</a>'
								+ '</div>'
	}

	var actionHtmlContent = '<div class="ui-grid-cell-contents">'
							+ '<a ui-sref="app.customer-view({customerId: row.entity._id })" class="edit">'
							+ '<i class="linecons-eye"></i>'
							+ 'View'
							+ '</a>&nbsp'
							+ '<a ui-sref="app.customer-update({customerId: row.entity._id })" class="edit">'
							+ '<i class="linecons-pencil"></i>'
							+ 'Edit'
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
			{field: 'getFullName()', displayName: 'Name'},
			{field: 'email'},
			{field: 'mobile'},
			{field: 'location'},
			{
				field: 'createdAt',
				enableSorting: true,
				cellFilter: 'date:\'dd-MM-yyyy\''
			},
			{
				name:  'Action',
				field: 'name',
				cellTemplate: actionHtmlContent
			},
		],
		onRegisterApi: function (gridApi) {
			$scope.grid1Api = gridApi;
		}
	};

	$scope.patientGridOptions = {
		// rowHeight: 40,
		enableFiltering: true,
		enableSorting: true,
		paginationPageSizes: [25, 50, 75],
		paginationPageSize: 5,
		columnDefs: [
			{
				name:  'S.No',
				field: 'name',
				cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
			},
			{field: 'getFullName()', displayName: 'Name'},
			{field: 'email'},
			{field: 'mobile'},
			{field: 'age'},
			{
				field: 'createdAt',
				enableSorting: true,
				cellFilter: 'date:\'dd-MM-yyyy\''
			},
			{
				name:  'Action',
				field: 'name',
				cellTemplate: patientActionHtmlContent
			},
		],
		onRegisterApi: function (gridApi) {
			$scope.grid1Api = gridApi;
		}
	};

	var refresh = function() {
		// GET customers
		$http.get('/customer').success(function(response) {
			$scope.customers = response.data;
			$scope.gridOptions.data = response.data;
			angular.forEach($scope.gridOptions.data, function(row){
				row.getFullName = function(){
					return this.firstName + ' ' + this.lastName;
				}
			});
		});

		// GET locations
		$http.get('/api/locations').then(function(response) {
			$scope.locations = response.data.data;
		});

		if($stateParams.customerId !== undefined) {
			$scope.customerId = $stateParams.customerId;
			// GET Customer
			$http.get('/customer/' + $stateParams.customerId).then(function(response) {
				$scope.info = response.data.customerInfo;
				if($location.absUrl().match("update") !== null) {
					$scope.isUpdate = true;
					$scope.customer = $scope.info.customer;
					$scope.currentImage = $scope.info.customer.avatar;
				}
			});
			// GET Patient
			$http.get('/api/patient/' + $stateParams.customerId).success(function(response) {
				$scope.patients = response.data;
				$scope.patientGridOptions.data = response.data;
				angular.forEach($scope.patientGridOptions.data, function(row){
					row.getFullName = function(){
						return this.firstName + ' ' + this.lastName;
					}
				});
			});
		}

		if($stateParams.customerId !== undefined && $stateParams.patientId !== undefined) {
			// GET Patient Full Info
			$http.get('/api/patient/get-patient-by-id/' + $stateParams.patientId).success(function(response) {
				$scope.patientInfo = response.data;
				if($location.absUrl().match("edit") !== null) {
					$scope.patientInfo = response.data.basicInfo;
					$scope.currentImage = response.data.basicInfo.avatar;
				}
			});

			// GET assigned FOS List Info
			$http.get('/api/get-assigned-fos/' + $stateParams.patientId).success(function(response) {
				if(response.success) {
					$scope.assignedFosList = response.data;
				}
				else {
					$scope.showAlert = true;
					$scope.alert = {status: "danger", message: response.error};
				}
			});

			// GET assigned Doctor List Info
			$http.get('/api/get-assigned-doctor/' + $stateParams.patientId).success(function(response) {
				if(response.success) {
					$scope.assignedDoctorList = response.data;
				}
				else {
					$scope.showAlert = true;
					$scope.alert = {status: "danger", message: response.error};
				}
			})

		}
	}

	$state.reload();

	refresh();

	$scope.createCustomer = function() {
		var fd = new FormData();
		for (var key in $scope.customer) {
			fd.append(key, $scope.customer[key])
		}
		$http.post('/customer/create', fd, {
			transformRequest: angular.indentity,
			headers: { 'Content-Type': undefined }
		}).success(function(response) {
			if(response.success) {
				$state.go('app.customers');
			}
			else {
				$scope.showAlert = true;
				$scope.alert = {status: "danger", message: response.message}
				$scope.customer = {}
			}
		});
	}

	// update customer
	$scope.updateCustomer = function() {
		$http.post('/customer/update', $scope.customer).success(function(response) {
			if(response.success) {
				$scope.showAlert = true;
				$scope.alert = {status: "success", message: response.message};
			}
			else {
				$scope.showAlert = true;
				$scope.alert = {status: "danger", message: "Error in updating customer"};
			}
		})
	}

	$scope.uploadImage = function(uploadObj, modelName) {
		var newObj = {avatar: uploadObj.avatar, id: uploadObj._id, model: modelName};
		var fd = new FormData();
		for(var key in newObj) {
			fd.append(key, newObj[key]);
		}
		$http.post('/api/upload-image', fd, {
				transformRequest: angular.indentity,
				headers: { 'Content-Type': undefined }
			})
			.success(function(response) {
				if(response.success) {
					$scope.showAlert = true;
					$scope.alert = {status: "success", message: response.message};
					refresh();
				}
				else {
					$scope.showAlert = true;
					$scope.alert = {status: "danger", message: response.error};
					refresh();
				}
			})
	}

	$scope.updatePatient = function() {
		$http.post('/api/patient/update', $scope.patientInfo).success(function(response) {
			$scope.showAlert = true;
			if(response.success) {
				$scope.alert = {status: "success", message: response.message};
			}
			else {
				$scope.alert = {status: "danger", message: error};
			}
		});
	}

	// Patient form modal
	$scope.openModal = function(modal_id, modal_size, modal_backdrop) {
		$rootScope.currentModal = $modal.open({
			templateUrl: modal_id,
			size: modal_size,
			backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
			controller: function($scope, $http, $modalInstance, $state) {
				$scope.patient = {}
				var refresh = function() {
					$http.get('/api/locations').then(function(response) {
						$scope.locations = response.data.data;
					});
				}

				refresh();

				$scope.createPatient = function() {
					$scope.patient.customerId = $stateParams.customerId;
					var fd = new FormData();
					for (var key in $scope.patient) {
						fd.append(key, $scope.patient[key])
					}
					$http.post('/api/patient/create', fd, {
						transformRequest: angular.indentity,
						headers: { 'Content-Type': undefined }
					}).then(function(response) {
						refresh();
						$scope.showAlert = true;
						$scope.alert = {message: response.data.message, status: 'success'};
						$scope.patient = {};
						$state.reload();
					})
				}

			}
		});
	};

	// Customer Model
	$scope.openPasswordChangeModal = function(modal_id, modal_size, modal_backdrop) {
		$rootScope.currentModal = $modal.open({
			templateUrl: modal_id,
			size: modal_size,
			backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
			controller: function($scope, $http, $modalInstance, $state) {
				if($location.absUrl().match("edit") !== null) {
					$http.get('/api/patient/get-patient-by-id/' + $stateParams.patientId).success(function(response) {
						$scope.pwdUpdateInfo = response.data.basicInfo;
					})
				}
				if($location.absUrl().match("update") !== null) {
					$http.get('/customer/' + $stateParams.customerId).success(function(response) {
						$scope.pwdUpdateInfo = response.customerInfo.customer;
					})
				}
				$scope.isAdmin = true;
				if($rootScope.user.userRole == 1) {
					$scope.isAdmin = false;
				}
				$scope.credential = {};
				$scope.updatePassword = function() {
					$scope.credential["email"] = $scope.pwdUpdateInfo.email;
					$scope.credential["userRole"] = $rootScope.user.userRole;					
					$http.post('/user/password-update', $scope.credential).success(function(response) {
						if(response.success) {
							$scope.showAlert = true;
							$scope.alert = { status: "success", message: response.message};
							$scope.credential = {};
						}
						else {
							$scope.showAlert = true;
							$scope.alert = { status: "danger", message: response.error};
						}
					})
				}
			}
		});
	};

	// Assign modal
	$scope.openAssignModal = function(modal_id, modal_size, isFos, isDoc, modal_backdrop) {
		$rootScope.currentModal = $modal.open({
			templateUrl: modal_id,
			size: modal_size,
			backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
			controller: function($scope, $http, $modalInstance, $state) {
				$scope.showAlert = false;
				$scope.assignObj = {};

				if(isFos) {
					$scope.assignName = "FOS";
					$scope.isFos = true;
				}
				else {
					$scope.assignName = "Doctor";
					$scope.isFos = false;
				}

				var refresh = function() {
					$http.get('/api/fos/all').success(function(response) {
						if(response.success) {
							$scope.fosList = response.data;
						}
						else {
							$scope.showAlert = true;
							$scope.alert = {status: "success", message: response.error};
						}
					});
					$http.get('/api/doctors/all').success(function(response) {
						if(response.success) {
							$scope.doctors = response.data;
						}
						else {
							$scope.showAlert = true;
							$scope.alert = {status: "success", message: response.error};
						}
					})
				}

				refresh();

				$scope.assignFOSAndDoctor = function() {
					$scope.assignObj["patientId"] = $stateParams.patientId;
					if(isFos) {
						$http.post('/api/assign-new-fos/', $scope.assignObj).success(function(response) {
							$scope.showAlert = true;
							if(response.success) {
								refresh();
								$state.reload();
								$scope.alert = {status: "success", message: response.message};
							}
							else {
								$scope.alert = {status: "danger", message: response.error};
							}
						})
					}
					else {
						$http.post('/api/assign-new-doctor/', $scope.assignObj).success(function(response) {
							$scope.showAlert = true;
							if(response.success) {
								refresh();
								$state.reload();
								$scope.alert = {status: "success", message: response.message};
							}
							else {
								$scope.alert = {status: "danger", message: response.error};
							}
						})
					}
				}

			}
		});
	};

	// Profile modal
	$scope.openProfileModal = function(modal_id, modal_size, searchId, isDoc, modal_backdrop) {
		$rootScope.currentModal = $modal.open({
			templateUrl: modal_id,
			size: modal_size,
			backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
			controller: function($scope, $http, $modalInstance, $state) {
				$scope.showAlert = false;
				$scope.assignObj = {};

				if(isDoc) {
					$scope.assignName = "Doctor";
					$scope.isDoc = true;
				}
				else {
					$scope.assignName = "FOS";
					$scope.isDoc = false;
				}

				var refresh = function() {
					if(isDoc) {
						$http.get('/api/doctor/' + searchId).success(function(response) {
							if(response.success) {
								$scope.doctor = response.doctorInfo;
							}
							else {
								$scope.showAlert = true;
								$scope.alert = {status: "danger", message: response.error}
							}
						});
					}
					else {
						$http.get('/api/fos/' + searchId).success(function(response) {
							if(response.success) {
								$scope.fos = response.fosInfo;
							}
							else {
								$scope.showAlert = true;
								$scope.alert = {status: "danger", message: response.error}
							}
						});
					}
				}

				refresh();

			}
		});
	};

});
