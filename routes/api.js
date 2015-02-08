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
        // TODO: find with status !COMPLETED
        db.tasks.find({
            status: {
                $not: /COMPLETED/
            }
        }).sort({pos: 1}).limit(1, function(err, docs) {
            // TODO: error handling
            var task = docs[0];

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

        if (status == 'STARTED' || status == 'COMPLETED') {
            db.tasks.findOne({
                _id: mongojs.ObjectId(taskId)
            }, function(err, task) {
                if (task.name == 'GET_ITEM') {
                    if (status == 'STARTED') {
                        db.items.update({_id: mongojs.ObjectId(task.itemId)},
                        {
                            $set: {
                                status: 'LEAVING_STORAGE'
                            }
                        });
                    } else if (status == 'COMPLETED') {
                        db.items.remove({_id: mongojs.ObjectId(task.itemId)}, true);
                    }

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
                    item: saved,
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
            bridge: req.param('bridge'),
            hoist: req.param('hoist'),
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

    // supply [name, itemId] parameters in querystring
    router.post('/task/create', function(req, res, next) {
        var task = {
            name: req.param('name'),
            itemId: req.param('itemId')
        };
        db.tasks.runCommand('count', function(err, count) {
            if (task.name == 'INCOMING_CARGO') {
                task.pos = 0;
            } else {
                task.pos = count.n;
            }
            db.tasks.insert(task, function(err, saved) {
                if (!err && saved) {
                    res.send({
                        success: true,
                        code: 'TASK_CREATED'
                    });
                } else {
                    res.send({
                        success: false,
                        code: 'ERROR_IN_TASK_CREATION'
                    });
                }
                next();
            });

        });
    });


    return router;

}
