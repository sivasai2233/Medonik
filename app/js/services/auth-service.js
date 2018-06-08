'use strict';

app.service('AuthService', function($http, $q, $rootScope, $state) {
	return {

        permissionModel: {
            permission: {},
            isPermissionLoaded: false
        },
        permissionCheck: function(roleCollection) {
            var deferred = $q.defer();
            var parentPointer = this;
            if(this.permissionModel.isPermissionLoaded) {
                this.getPermission(this.permissionModel, roleCollection, deferred);
            }
            else {
                $http.get('/api/permissionService').then(function(response) {
                    parentPointer.permissionModel.permission = response.data;
                    parentPointer.permissionModel.isPermissionLoaded = true;
                    parentPointer.getPermission(parentPointer.permissionModel, roleCollection, deferred);
                })
            }
            return deferred.promise;
        },

        getPermission: function(permissionModel, roleCollection, deferred) {
            var ifPermissionPassed = false;

            angular.forEach(roleCollection, function(role) {
                switch (role) {
                    case roles.superAdmin:
                        if(permissionModel.permission.isSuperAdmin) {
                            ifPermissionPassed = true;
                        }
                        break;
                    case roles.admin:
                        if (permissionModel.permission.isAdmin) {
                            ifPermissionPassed = true;
                        }
                        break;
                    case roles.customer:
                        if (permissionModel.permission.isCustomer) {
                            ifPermissionPassed = true;
                        }
                        break;
                    case roles.patient:
                        if (permissionModel.permission.isPatient) {
                            ifPermissionPassed = true;
                        }
                        break;
                    case roles.doctor:
                        if (permissionModel.permission.isDoctor) {
                            ifPermissionPassed = true;
                        }
                        break;
                    case roles.fos:
                        if (permissionModel.permission.isFOS) {
                            ifPermissionPassed = true;
                        }
                        break;
                    default:
                        ifPermissionPassed = false;
                }
            });
            if (!ifPermissionPassed) {
            	$state.go('app.extra-page-404');
                $rootScope.$on('$stateChangeStart', function (next, current) {
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }
        }

    }
})