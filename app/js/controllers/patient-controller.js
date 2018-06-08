app.controller('PatientController', function(
  $rootScope,
  $scope,
  $http,
  $state,
  $stateParams,
  $rootScope,
  $modal,
  $sce
) {
  $scope.showAssignBtn = false;
  $scope.showAnalysisBtn = false;

  var actionHtmlContent =
    '<div class="ui-grid-cell-contents">' +
    '<a ui-sref="app.patient-view({patientId: row.entity._id })" class="edit">' +
    '<i class="linecons-eye"></i>' +
    'View' +
    '</a>&nbsp' +
    // + '<a ng-click="grid.appScope.openModal(\'user-delete-modal\', undefined, false, false, {status: true, id: row.entity._id})" class="edit">'
    // + '<i class="linecons-trash"></i>'
    // + 'Delete'
    // + '</a>'
    '</div>';

  $scope.gridOptions = {
    // rowHeight: 40,
    enableFiltering: true,
    enableSorting: true,
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 10,
    columnDefs: [
      {
        name: 'S.No',
        field: 'name',
        cellTemplate:
          '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
      },
      { field: 'getFullName()', displayName: 'Name' },
      { field: 'email' },
      { field: 'mobile' },
      { field: 'age' },
      { field: 'bloodGroup' },
      //  {
      //  field: 'createdAt',
      //  enableSorting: true,
      //  cellFilter: "date:'dd-MM-yyyy'"
      //},
      {
        name: 'Action',
        field: 'name',
        cellTemplate: actionHtmlContent
      }
    ],
    onRegisterApi: function(gridApi) {
      $scope.grid1Api = gridApi;
    }
  };

  var refresh = function() {
    // GET locations
    $http.get('/api/locations').then(function(response) {
      $scope.locations = response.data.data;
    });

    // GET patients
    if ($rootScope.user.userRole == 2) {
      $http
        .get('/api/patient/' + $rootScope.user.customerId)
        .success(function(response) {
          $scope.patients = response.data.data;
          $scope.gridOptions.data = response.data;
          angular.forEach($scope.gridOptions.data, function(row) {
            row.getFullName = function() {
              return this.firstName + ' ' + this.lastName;
            };
          });
        });
    } else if ($rootScope.user.userRole == 4) {
      $scope.patients = [];
      $scope.showAnalysisBtn = true;
      $http
        .get('/api/get-assigned-patient-doc/' + $rootScope.user.doctorId)
        .success(function(response) {
          for (var i = 0; i < response.data.length; i++) {
            $scope.patients.push(response.data[i].patientInfo);
          }
          $scope.gridOptions.data = $scope.patients;
          angular.forEach($scope.gridOptions.data, function(row) {
            row.getFullName = function() {
              return this.firstName + ' ' + this.lastName;
            };
          });
        });
    } else if ($rootScope.user.userRole == 5) {
      $scope.patients = [];
      $http
        .get('/api/get-assigned-patient-fos/' + $rootScope.user.fosId)
        .success(function(response) {
          for (var i = 0; i < response.data.length; i++) {
            $scope.patients.push(response.data[i].patientInfo);
          }
          $scope.gridOptions.data = $scope.patients;
          angular.forEach($scope.gridOptions.data, function(row) {
            row.getFullName = function() {
              return this.firstName + ' ' + this.lastName;
            };
          });
        });
    } else {
      $scope.showAssignBtn = true;
      $http.get('/api/patients/all').success(function(response) {
        $scope.patients = response.data;
        $scope.gridOptions.data = response.data;
        angular.forEach($scope.gridOptions.data, function(row) {
          row.getFullName = function() {
            return this.firstName + ' ' + this.lastName;
          };
        });
      });
    }

    if ($stateParams.patientId !== 'undefined') {
      $http
        .get('/api/patient/get-patient-by-id/' + $stateParams.patientId)
        .then(function(response) {
          $scope.patientInfo = response.data.data;
        });
      // GET assigned FOS List Info
      $http
        .get('/api/get-assigned-fos/' + $stateParams.patientId)
        .success(function(response) {
          if (response.success) {
            $scope.assignedFosList = response.data;
          } else {
            $scope.showAlert = true;
            $scope.alert = { status: 'danger', message: response.error };
          }
        });

      // GET assigned Doctor List Info
      $http
        .get('/api/get-assigned-doctor/' + $stateParams.patientId)
        .success(function(response) {
          if (response.success) {
            $scope.assignedDoctorList = response.data;
          } else {
            $scope.showAlert = true;
            $scope.alert = { status: 'danger', message: response.error };
          }
        });
    }

    $scope.showCreateBtn = isDisplay();
  };

  refresh();

  $state.reload();

  $scope.createPatient = function() {
    $scope.patient.customerId = $rootScope.user.customerId;
    var fd = new FormData();
    for (var key in $scope.patient) {
      fd.append(key, $scope.patient[key]);
    }
    $http
      .post('/api/patient/create', fd, {
        transformRequest: angular.indentity,
        headers: { 'Content-Type': undefined }
      })
      .then(function(response) {
        refresh();
        $scope.showAlert = true;
        $scope.alert = { message: response.data.message, status: 'success' };
        $scope.patient = {};
      });
  };

  function isDisplay() {
    if ($rootScope.user.userRole == 2) {
      return true;
    } else {
      return false;
    }
  }

  $scope.deleteDocAssign = function(id) {
    var tempObj = { id: id };
    $http.post('/api/delete-assigned-doc', tempObj).success(function(response) {
      if (response.success) {
        refresh();
      } else {
        console.log(response.error);
        refresh();
      }
    });
  };

  // Assign modal
  $scope.openAssignModal = function(
    modal_id,
    modal_size,
    isFos,
    isDoc,
    modal_backdrop
  ) {
    $rootScope.currentModal = $modal.open({
      templateUrl: modal_id,
      size: modal_size,
      backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
      controller: function($scope, $http, $modalInstance, $state) {
        $scope.showAlert = false;
        $scope.assignObj = {};

        if (isFos) {
          $scope.assignName = 'FOS';
          $scope.isFos = true;
        } else {
          $scope.assignName = 'Doctor';
          $scope.isFos = false;
        }

        var refresh = function() {
          $http.get('/api/fos/all').success(function(response) {
            if (response.success) {
              $scope.fosList = response.data;
            } else {
              $scope.showAlert = true;
              $scope.alert = { status: 'success', message: response.error };
            }
          });
          $http.get('/api/doctors/all').success(function(response) {
            if (response.success) {
              $scope.doctors = response.data;
            } else {
              $scope.showAlert = true;
              $scope.alert = { status: 'success', message: response.error };
            }
          });
        };

        refresh();

        $scope.assignFOSAndDoctor = function() {
          $scope.assignObj['patientId'] = $stateParams.patientId;
          if (isFos) {
            $http
              .post('/api/assign-new-fos/', $scope.assignObj)
              .success(function(response) {
                $scope.showAlert = true;
                if (response.success) {
                  refresh();
                  $state.reload();
                  $scope.alert = {
                    status: 'success',
                    message: response.message
                  };
                } else {
                  $scope.alert = { status: 'danger', message: response.error };
                }
              });
          } else {
            $http
              .post('/api/assign-new-doctor/', $scope.assignObj)
              .success(function(response) {
                $scope.showAlert = true;
                if (response.success) {
                  refresh();
                  $state.reload();
                  $scope.alert = {
                    status: 'success',
                    message: response.message
                  };
                } else {
                  $scope.alert = { status: 'danger', message: response.error };
                }
              });
          }
        };
      }
    });
  };

  // Profile modal
  $scope.openProfileModal = function(
    modal_id,
    modal_size,
    searchId,
    isDoc,
    modal_backdrop
  ) {
    $rootScope.currentModal = $modal.open({
      templateUrl: modal_id,
      size: modal_size,
      backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
      controller: function($scope, $http, $modalInstance, $state) {
        $scope.showAlert = false;
        $scope.assignObj = {};

        if (isDoc) {
          $scope.assignName = 'Doctor';
          $scope.isDoc = true;
        } else {
          $scope.assignName = 'FOS';
          $scope.isDoc = false;
        }

        var refresh = function() {
          if (isDoc) {
            $http.get('/api/doctor/' + searchId).success(function(response) {
              if (response.success) {
                $scope.doctor = response.doctorInfo;
              } else {
                $scope.showAlert = true;
                $scope.alert = { status: 'danger', message: response.error };
              }
            });
          } else {
            $http.get('/api/fos/' + searchId).success(function(response) {
              if (response.success) {
                $scope.fos = response.fosInfo;
              } else {
                $scope.showAlert = true;
                $scope.alert = { status: 'danger', message: response.error };
              }
            });
          }
        };

        refresh();
      }
    });
  };

  // Analysis modal
  $scope.openAnalysisModal = function(modal_id, modal_size, modal_backdrop) {
    $rootScope.currentModal = $modal.open({
      templateUrl: modal_id,
      size: modal_size,
      backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
      controller: function(
        $scope,
        $http,
        $modalInstance,
        $state,
        $stateParams,
        $rootScope
      ) {
        $scope.analysis = {};
        $scope.showAlert = false;

        $scope.createAnalysis = function() {
          $scope.analysis['patientId'] = $stateParams.patientId;
          $scope.analysis['doctorId'] = $rootScope.user.doctorId;
          $http
            .post('/api/analysis/create', $scope.analysis)
            .success(function(response) {
              $scope.showAlert = true;
              if (response.success) {
                $scope.alert = { status: 'success', message: response.message };
                $state.reload();
              } else {
                $scope.alert = { status: 'danger', message: response.error };
              }
            });
        };
      }
    });
  };
});
