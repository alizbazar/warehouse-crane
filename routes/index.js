
/*
 * GET home page.
 */

exports.index = function(req, res){


  res.locals = {

  };

  res.render('index', {
      "pageName": "Warehouse Crane management"
  });

};