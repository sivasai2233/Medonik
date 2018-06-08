app.controller('ChartController', function($scope, $http, $state, $stateParams) {

    $scope.showAlert = false;
    $scope.isEdit = false;

    var actionHtmlContent = '<div class="ui-grid-cell-contents">'
                            + '<a ui-sref="app.chart-update({chartId: row.entity._id })" class="edit">'
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
            {field: 'chartName'},
            {field: 'minValue'},
            {field: 'maxValue'},
            {field: 'minorTicks'},
            {field: 'majorTicks'},
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
    
    var refresh = function() {
        $http.get('/api/chart/all').success(function(response) {
            if(response.success) {
                $scope.charts = response.data;
                $scope.gridOptions.data = response.data;
            }
            else {
                $scope.alert = {status: "default", message: "No data found"}
            }
        });
        if($stateParams.chartId !== undefined) {
            $scope.isEdit = true;
            $http.get('/api/chart/' + $stateParams.chartId).success(function(response) {
                if(response.success) {
                    $scope.chart = response.data;
                    $scope.thresholdValues = [];
                    var tempObj = {}
                    var thresholdValues = $scope.chart.thresholdValue.split(",");
                    for (var i = 0; i < thresholdValues.length; i++) {
                        var thresholdSplitValues = thresholdValues[i].split(":");
                        var id = 1
                        tempObj["id"] = id + i;
                        tempObj["startValue"] = parseInt(thresholdSplitValues[0]);
                        tempObj["endValue"] = parseInt(thresholdSplitValues[1]);
                        tempObj["color"] = thresholdSplitValues[2];
                        tempObj["classfication"] = thresholdSplitValues[3];
                        $scope.thresholdValues.push(tempObj);
                        tempObj = {};
                    }
                    console.log($scope.thresholdValues);
                }
                else {
                    $scope.showAlert = true;
                    $scope.alert = {status: "danger", message: response.error};
                }
            })
        }
    }

    refresh();

    $scope.chart = {
        minValue: 0,
        maxValue: 100,
        majorTicks: 4,
        minorTicks: 5
    };

    $scope.defaultThresholdValues  = [
        {
            id: 1,
            startValue: 0,
            endValue: 25,
            color: "#ffff00",
            classfication: "",
        },
        {
            id: 2,
            startValue: 25,
            endValue: 50,
            color: "#0040ff",
            classfication: ""
        },
        {
            id: 3,
            startValue: 50,
            endValue: 75,
            color: "#40ff00",
            classfication: ""
        },
        {
            id: 4,
            startValue: 75,
            endValue: 100,
            color: "#ff0080",
            classfication: ""
        }
    ]

    if($stateParams.chartId == undefined) {
        $scope.thresholdValues = $scope.defaultThresholdValues;
    }

    $scope.newThreshold = function() {
        if($scope.thresholdValues.length >= $scope.chart.majorTicks) {
            console.log("Limit exceeded");
        }
        else {
            var tId = $scope.defaultThresholdValues[$scope.defaultThresholdValues.length - 1].id;
            var newObj = {
                id: tId + 1,
                startValue: 0,
                endValue: 0,
                color: "#000"
            };
            $scope.thresholdValues.push(newObj)
        }
    }

    $scope.removeThreshold = function(id) {
        var newIndex = $scope.thresholdValues.findIndex(x => x.id == id);
        $scope.thresholdValues.splice(newIndex, 1);
    }

    $scope.createChart = function() {
        var thresholdStringArray = [];
        var tempStr = ""
        // var thresholdValueCount = 0;
        for (var i = 0; i < $scope.thresholdValues.length; i++) {
        	tempStr += $scope.thresholdValues[i].startValue + ":" + $scope.thresholdValues[i].endValue + ":" + $scope.thresholdValues[i].color + ":" + $scope.thresholdValues[i].classfication;
        	thresholdStringArray.push(tempStr);
        	tempStr = "";
            // thresholdValueCount += $scope.thresholdValues[i].startValue;
            // console.log(thresholdValueCount);
        }
        $scope.chart["thresholdValue"] = thresholdStringArray.toString();
        $http.post('/api/chart/create', $scope.chart).success(function(response) {
            if(response.success) {
                $state.go('app.chartList');
            }
            else {
                $scope.showAlert = true;
                $scope.alert = {status: "danger", message: response.error};
            }
        })
    }

    $scope.updateChart = function() {
        var thresholdStringArray = [];
        var tempStr = "";
        for (var i = 0; i < $scope.thresholdValues.length; i++) {
        	tempStr += $scope.thresholdValues[i].startValue + ":" + $scope.thresholdValues[i].endValue + ":" + $scope.thresholdValues[i].color + ":" + $scope.thresholdValues[i].classfication;
        	thresholdStringArray.push(tempStr);
        	tempStr = "";
        }
        $scope.chart["thresholdValue"] = thresholdStringArray.toString();
        $http.post('/api/chart/update', $scope.chart).success(function(response) {
            if(response.success) {
                $scope.showAlert = true;
                $scope.alert = {status: "success", message: response.message}
            }
            else {
                $scope.showAlert = true;
                $scope.alert = {status: "danger", message: response.error};
            }
        })
    }

    $scope.updateChartValue = function(newChartObj) {
        $http.post('/api/chart/update', newChartObj).success(function(response) {
            if(response.success) {
                refresh();
            }
        })
    }

})
