'use strict';

angular
  .module('xenon.customControllers', [])
  .controller('UserController', function(
    $scope,
    $rootScope,
    $modal,
    $sce,
    $http,
    $state,
    $stateParams
  ) {
    $scope.showAlert = false;
    $scope.currentImage = '';

    var actionHtmlContent =
      '<div class="ui-grid-cell-contents">' +
      '<a ui-sref="app.user-update({userId: row.entity._id })" class="edit">' +
      '<i class="linecons-pencil"></i>' +
      'Edit' +
      '</a>&nbsp' +
      '<a href="" ng-click="grid.appScope.openModal(\'user-delete-modal\', undefined, false, false, {status: true, id: row.entity._id})" class="edit">' +
      '<i class="linecons-trash"></i>' +
      'Delete' +
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
        { field: 'status', cellFilter: 'statusFilter' },
        //	{
        //	field: 'createdAt',
        //	enableSorting: true,
        //	cellFilter: 'date:\'dd-MM-yyyy\''
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
      $http.get('/user').success(function(response) {
        if (response.success) {
          $scope.gridOptions.data = response.data;
          angular.forEach($scope.gridOptions.data, function(row) {
            row.getFullName = function() {
              return this.firstName + ' ' + this.lastName;
            };
          });
        }
      });

      if ($stateParams.userId !== undefined) {
        $http
          .get('/user/' + $stateParams.userId)
          .success(function(response) {
            if (response.success) {
              response.data.password = '';
              $scope.user = response.data;
              $scope.currentImage = response.data.avatar;
            } else {
              $scope.alert = { status: 'danger', message: response.error };
            }
          })
          .error(function(error) {
            $scope.alert = { status: 'danger', message: response.error };
          });
      }
    };

    refresh();

    $state.reload();

    //Update User
    $scope.updateUser = function() {
      $http
        .post('/user/update', $scope.user)
        .success(function(response) {
          $scope.showAlert = true;
          $scope.alert = { status: 'success', message: response.message };
          refresh();
        })
        .error(function(error) {
          console.log(error);
        });
    };

    $scope.uploadImage = function(user) {
      var newObj = { avatar: user.avatar, id: user._id, model: 'user' };
      var fd = new FormData();
      for (var key in newObj) {
        fd.append(key, newObj[key]);
      }
      $http
        .post('/api/upload-image', fd, {
          transformRequest: angular.indentity,
          headers: { 'Content-Type': undefined }
        })
        .success(function(response) {
          if (response.success) {
            $scope.showAlert = true;
            $scope.alert = { status: 'success', message: response.message };
            refresh();
          } else {
            $scope.showAlert = true;
            $scope.alert = { message: response.error, status: 'danger' };
            refresh();
          }
        });
    };

    // Open Simple Modal
    $scope.openModal = function(
      modal_id,
      modal_size,
      isCreate,
      isEdit,
      isDelete,
      modal_backdrop
    ) {
      $rootScope.currentModal = $modal.open({
        templateUrl: modal_id,
        size: modal_size,
        backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
        controller: function($scope, $http, $modalInstance, $state) {
          $scope.user = {};
          $scope.showAlert = false;

          var refresh = function() {
            $http.get('/user').then(function(response) {
              if (response.data.success) {
                $scope.users = response.data.data;
              }
            });
          };

          refresh();

          if (isCreate) {
            $scope.createUser = function() {
              var fd = new FormData();
              for (var key in $scope.user) {
                fd.append(key, $scope.user[key]);
              }
              $http
                .post('/user/create', fd, {
                  transformRequest: angular.indentity,
                  headers: { 'Content-Type': undefined }
                })
                .success(function(response) {
                  if (response.success) {
                    refresh();
                    $scope.showAlert = true;
                    $scope.alert = {
                      message: response.message,
                      status: 'success'
                    };
                    $scope.user = {};
                    $state.reload();
                  } else {
                    $scope.showAlert = true;
                    $scope.alert = {
                      message: response.error,
                      status: 'danger'
                    };
                  }
                })
                .error(function(error) {
                  console.log(error);
                });
            };
          }

          if (isDelete.status) {
            $scope.deleteUser = function() {
              $http
                .delete('/user/delete/' + isDelete.id)
                .then(function(response) {
                  if (response.data.success) {
                    refresh();
                    $state.reload();
                    $modalInstance.close();
                  } else {
                    $state.reload();
                    $modalInstance.close();
                  }
                });
            };
          }
        }
      });
    };
  });
