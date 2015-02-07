var express = require('express');
var mongojs = require('mongojs');
var _ = require('underscore-node');

module.exports = function(db) {

    var router = express.Router();

    router.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    router.get('/getNextTask', function(req, res, next) {
        db.tasks.findOne(function(err, task) {
            console.log(task);
        });

        //console.log(docs);
        db.tasks.findOne(function(err, task) {
            // TODO: error handling
            if (task) {
                db.items.findOne({
                    _id: mongojs.ObjectId(task.itemId)
                }, function(err, item) {
                    // No need to send itemid explicitly
                    delete task.itemId;
                    res.send(_.extend({
                        item: item,
                        success: true
                    }, task));
                    next();
                });
            } else {
                res.send({
                    success: false,
                    code: "NO_TASKS_IN_QUEUE"
                });
                next();
            }

        });
    });

    router.post('/task/:id/setStatus', function(req, res, next) {
        var status = req.param('status');
        var taskId = req.param('id');
        console.log('setting:' + status + ':' + taskId);

        if (status != 'NOT_STARTED' && status != 'STARTED' && status != 'COMPLETED') {
            res.send({
                success: false,
                code: 'NO_SUCH_ITEM_STATUS'
            });
            next();
            return;
        }

        if (status == 'STARTED') {
            db.tasks.findOne({
                _id: mongojs.ObjectId(taskId)
            }, function(err, task) {
                if (task.name == 'GET_ITEM') {
                    db.items.update({_id: mongojs.ObjectId(task.itemId)},
                    {
                        $set: {
                            status: 'LEAVING_STORAGE'
                        }
                    });

                }
            });
        }

        db.tasks.update({_id: mongojs.ObjectId(taskId)},
        {
            $set: {
                status: status
            }
        }, function(err, updated) {
            console.log(updated);
            if (!err && updated.n == 1) {
                res.send({
                    success: true,
                    code: 'TASK_STATUS_CHANGED'
                });
            } else {
                res.send({
                    success: false,
                    code: 'ERROR_WHILE_UPDATING_TASK'
                });
            }
            next();
        });


    });

    router.post('/item/create', function(req, res, next) {
        var item = {
            name: req.param('name'),
            info: req.param('info'),
            status: 'GOING_TO_STORAGE'
        };

        db.items.insert(item, function(err, saved) {
            if (!err && saved) {
                res.send({
                    success: true,
                    code: 'ITEM_CREATED'
                });
            } else {
                res.send({
                    success: false,
                    code: 'ERROR_IN_ITEM_CREATION'
                });
            }
            next();
        });

    });

    router.post('/item/:id/setLocation', function(req, res, next) {
        var location = {
            hoist: req.param('hoist'),
            bridge: req.param('bridge'),
            trolley: req.param('trolley')
        };

        var itemId = req.param('id');

        db.items.update({_id: mongojs.ObjectId(itemId)},
        {
            $set: {
                location: location,
                status: 'STORED'
            }
        }, function(err, updated) {
            if (!err && updated.n == 1) {
                res.send({
                    success: true,
                    code: 'ITEM_LOCATION_SAVED'
                });
            } else {
                res.send({
                    success: false,
                    code: 'ERROR_WHILE_SAVING_LOCATION'
                });
            }
            next();
        });

    });




    return router;

}
