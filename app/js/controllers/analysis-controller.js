app.controller('AnalysisController', function($scope, $http, $stateParams, $state, $rootScope, $modal, $sce) {
    $scope.showAlert = false;
    $scope.isCustomer = false;

    var refresh = function() {
        $http.get('/api/patient/get-patient-by-id/' + $stateParams.patientId).success(function(response) {
            if(response.success) {
                $scope.patientInfo = response.data;
            }
            else {
                $scope.showAlert = true;
                $scope.alert = { status: "danger", message: response.error };
            }
        });

        $http.get('/api/analysis/get-by-patient/' + $stateParams.patientId).success(function(response) {
            if(response.success) {
                $scope.analysisReports = response.data;
            }
            else {
                $scope.showAlert = true;
                $scope.alert = { status: "danger", message: response.error };
            }
        });

        if($stateParams.customerId !== undefined) {
            $scope.isCustomer = true;
            $http.get('/customer/' + $stateParams.customerId).success(function(response) {
                if(response.success) {
                    $scope.customerInfo = response.customerInfo;
                }
                else {
                    $scope.showAlert = true;
                    $scope.alert = { status: "danger", message: response.error };
                }
            })
        }
    }

    $state.reload();

    refresh();

    // Analysis modal
	$scope.openAnalysisModal = function(modal_id, modal_size, analysisId, modal_backdrop) {
		$rootScope.currentModal = $modal.open({
			templateUrl: modal_id,
			size: modal_size,
			backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
			controller: function($scope, $http, $modalInstance, $state, $stateParams, $rootScope) {
				$scope.analysis = {};
				$scope.showAlert = false;

                var refresh = function() {
                    $http.get('/api/analysis/' + analysisId).success(function(response) {
                        if(response.success) {
                            $scope.analysis = response.data;
                        }
                        else {
                            $scope.showAlert = true;
                            $scope.alert = {status: "danger", message: response.error};
                        }
                    })
                }

                refresh();

                $scope.updateAnalysis = function() {
                    $http.post('/api/analysis/update', $scope.analysis).success(function(response) {
                        if(response.success) {
                            $scope.showAlert = true;
                            $scope.alert = {status: "success", message: response.message};
                            $state.reload();
                        }
                        else {
                            $scope.showAlert = true;
                            $scope.alert = {status: "danger", message: response.error};
                        }
                    })
                }

			}
		});
	};

});
