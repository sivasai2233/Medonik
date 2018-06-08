var Chart = require('../models/chart');

module.exports = function(router) {

    router.get('/chart/all', function(req, res) {
        Chart.find({}, function(err, chartLists) {
            if(err)
                res.json({success: false, error: err.stack});
            else
                res.json({success: true, data: chartLists})
        });
    });

    router.get('/chart/:chartId', function(req, res) {
        Chart.findOne({_id: req.params.chartId}, function(err, chartInfo) {
            if(err)
                res.json({success: false, error: err.stack});
            else
                res.json({success: true, data: chartInfo});
        })
    })

    router.get('/chart/get-by-name/:chartName', function(req, res) {
        Chart.findOne({chartName: req.params.chartName}, function(err, chartInfo) {
            if(err)
                res.json({success: false, error: err.stack});
            else
                res.json({success: true, data: chartInfo});
        })
    })

    router.post('/chart/create', function(req, res) {
        var newChart = new Chart(req.body);
        newChart.save(function(err, chart) {
            if(err)
                res.json({success: false, error: err.stack});
            else
                res.json({success: true, message: "New chart added."});
        });
    });

    router.post('/chart/update', function(req, res) {
        Chart.findByIdAndUpdate(req.body._id, {$set: req.body}, function(err) {
            if(err) {
                res.json({success: false, error: err.stack});
            }
            else {
                res.json({success: true, message: "Chart updated."});
            }
        })
    });

    // router.post('/chart/value-update', function(req, res) {
    //     console.log(req.body);
    //     // Chart.findByIdAndUpdate(req.body._id, {$set: req.body}, function(err) {
    //     //     if(err) {
    //     //         res.json({success: false, error: err.stack});
    //     //     }
    //     //     else {
    //     //         res.json({success: true, message: "Chart updated."});
    //     //     }
    //     // })
    // });

}
