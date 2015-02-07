var express = require('express')
  , routes = require('./routes/index')
  , api = require('./routes/api')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , logger = require('morgan')
  , errorHandler = require('errorhandler')
  , mongojs = require('mongojs');

var app = express();

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'html');
app.set('layout', 'layout');
app.engine('html', require('hogan-express'));
app.set('views', __dirname + '/views');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())

var router = express.Router();

router.use(logger('dev'));
app.use(require('less-middleware')(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'public')));

// Set production database URL here
var dbURI = 'measuretl:PASS@ds047968.mongolab.com:47968/warehouseCrane';

var env = process.env.NODE_ENV || 'development';
if (env == 'development') {
  app.use(errorHandler());
  dbURI = 'localhost:27017/warehouseCrane';
}

var db = mongojs(dbURI, ['tasks', 'items']);


app.get('/', routes.index);

// This seem to cause some trouble.
app.use('/api', api);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
