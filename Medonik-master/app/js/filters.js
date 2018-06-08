angular
  .module('xenon.filters', [])
  .filter('userRoleFilter', function() {
    return function(index) {
      switch (index) {
        case 0:
          return 'Super Admin';
          break;
        case 1:
          return 'Admin';
          break;
        case 2:
          return 'Customer';
          break;
        case 3:
          return 'Patient';
          break;
        case 4:
          return 'Doctor';
          break;
        //case 5:
        //return 'FOS';
        //break;
      }
    };
  })
  .filter('statusFilter', function() {
    return function(index) {
      switch (index) {
        case 0:
          return 'Inactive';
          break;
        case 1:
          return 'Active';
          break;
      }
    };
  });
