var express = require('express');
var router = express.Router();

router.get('/getNextTask', function(req, res, next) {
    res.send({
        item: {
            _id: "54d5c643490bba0cb6ac827c",
            name: "box1234",
            location: {
                hoist: 5000,
                bridge: 3523,
                trolley: 1234
            }
        },
        taskName: "getItem"
    });
    next();
});

router.post('/task/:id/setStatus', function(req, res, next) {
    var status = req.param('status');

    // TODO: set status of the item

    res.send({
        success: true,
        code: 'ITEM_STATUS_CHANGED'
    })
    next();
});

router.post('/item', function(req, res, next) {
    var itemName = req.param('name');
    var itemInfo = req.param('info');

    // TODO: store item to the db

    res.send({
        success: true,
        code: 'ITEM_CREATED'
    });

    next();
});

router.post('/item/:id/setLocation', function(req, res, next) {
    var hoist = req.param('hoist');
    var bridge = req.param('bridge');
    var trolley = req.param('trolley');

    // Find item by id and store it's location to db

    res.send({
        success: true,
        code: 'ITEM_LOCATION_SET'
    });

    next();
});



module.exports = router;
