app.controller('AppointmentController', function(
  $scope,
  $http,
  $stateParams,
  $location,
  $rootScope,
  $modal,
  $sce
) {
  $scope.appointment = {};
  $scope.isUpdate = false;

  var actionHtmlContent =
    '<div class="ui-grid-cell-contents">' +
    '<a ui-sref="app.appointment-edit({appointmentId: row.entity.basicInfo._id })" class="edit">' +
    '<i class="linecons-pencil"></i>' +
    'Edit' +
    '</a>&nbsp' +
    '<a ui-sref="app.appointment-view({appointmentId: row.entity.basicInfo._id })" class="edit">' +
    '<i class="linecons-eye"></i>' +
    'View' +
    '</a>' +
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
      // { field: 'Doctor' },
      // { field: 'date & time' },
      { field: 'reason' },
      // {
      //   field: 'createdAt',
      //   enableSorting: true,
      //   cellFilter: "date:'dd-MM-yyyy'"
      // },
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
    $http.get('/api/specializations').then(function(response) {
      $scope.specializations = response.data.data;
    });
    $http.get('/api/appointments/all').success(function(response) {
      $scope.appointment = response.data;
      $scope.gridOptions.data = response.data;
      angular.forEach($scope.gridOptions.data, function(row) {
        row.getFullName = function() {
          return this.basicInfo.firstName + ' ' + this.basicInfo.lastName;
        };
        // (row.email = row.basicInfo.email),
        // (row.mobile = row.basicInfo.mobile),
        // (row.reason = row.basicInfo.reason),
        // // (row.specialization = row.specializationInfo.specialization),
        // (row.createdAt = row.basicInfo.createdAt);
      });
    });
    // if ($stateParams.appointmentId !== undefined) {
    //   $http
    //     .get('/api/appointment/' + $stateParams.appointmentId)
    //     .then(function(response) {
    //       $scope.viewInfo = response.data.appointmentInfo;
    //       if ($location.absUrl().match('update') !== null) {
    //         $scope.isUpdate = true;
    //         $scope.appointment = $scope.viewInfo.basicInfo;
    //         //$scope.currentImage = $scope.viewInfo.basicInfo.avatar;
    //       }
    //     });
    // }
  };
  refresh();
  $scope.createAppointment = function(appointment) {
    var fd = new FormData();
    for (var key in $scope.appointment) {
      fd.append(key, $scope.appointment[key]);
    }
    $http
      .post('/api/appointment/create', fd, {
        transformRequest: angular.indentity,
        headers: { 'Content-Type': undefined }
      })
      .then(function(response) {
        if (response.data.success) {
          $scope.showAlert = true;
          $scope.alert = {
            status: 'success',
            message: 'New Appointment Created'
          };
        } else {
          $scope.showAlert = true;
          $scope.alert = { status: 'danger', message: response.data.message };
          $scope.appointment = {};
        }
      });
  };
  // $scope.createAppointment = function() {
  //   var fd = new FormData();
  //   for (var key in $scope.appointment) {
  //     fd.append(key, $scope.appointment[key]);
  //   }
  //   $http
  //     .post('/api/appointment/create', fd, {
  //       transformRequest: angular.indentity,
  //       headers: { 'Content-Type': undefined }
  //     })
  //     .then(function(response) {
  //       if (response.data.success) {
  //         $scope.showAlert = true;
  //         $scope.alert = { status: 'success', message: response.data.message };
  //         $scope.appointment = {};
  //       } else {
  //         $scope.showAlert = true;
  //         $scope.alert = { status: 'danger', message: response.data.message };
  //         $scope.appointment = {};
  //       }
  //     });
  // };
});
