/*  This is a RESTful bridge Demo between a MongoDB
 *  to be use on an angularjs app...
 *  author:  jhlucena
 */

// Define all Vars
var restify = require('restify');
var mongojs = require('mongojs');

var ip_addr = '127.0.0.1';
var port = '8080';

// Set path for access route
var PATH = '/testdata';

// Connection string to MongoDb
var conn_string = '127.0.0.1:27017/mydb';
var db = mongojs(conn_string, ['mydb']);

// Set the collection to use...
var testData = db.collection("testData");

var server = restify.createServer({
    name: "app"
});

// Enable plugins to use
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

// Set routes for data CRUD access from Mongo db
// GET Route
server.get({
        path: PATH,
        version: '0.0.1'
    },
    findAll);

server.get(
    {
        path: PATH + '/:id',
        version: '0.0.1'
    },
    findElement);

// POST routes
server.post(
    {
        path: PATH,
        version: '0.0.1'
    },
    postElement);

// DEL routes
server.del(
    {
        path: PATH + '/:id',
        version: '0.0.1'
    },
    delElement);

// Start to listen
server.listen(port, ip_addr, function () {
    console.log('%s listening at %s ', server.name, server.url);
});

/**
 * Function to find all elements of a collection from mongo db
 * @param req
 * @param res
 * @param next
 */
function findAll(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    testData.find(function (err, success) {
        console.log('Response success ' + success);
        console.log('Response error ' + err);
        if (success) {
            res.send(200, success);
            return next();
        } else {
            return next(err);
        }
    });
}

/**
 * Function looks for an specific element on the MongoDb
 * @param req
 * @param res
 * @param next
 */
function findElement(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    testData.findOne({ name: req.params.id },
        function (err, success) {
            console.log('Response success ' + success);
            console.log('Response error ' + err);

            if (success) {
                res.send(200, success);
                return next();
            } else {
                return next(err);
            }
        }
    );
}

/**
 * Function to save an element into a collection
 * @param req
 * @param res
 * @param next
 */
function postElement(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    var element = {};

    element.name = req.params.name;
    element.date = new Date();

    testData.save(element, function (err, success) {
        console.log('Response success ' + success);
        console.log('Response error ' + err);
        if (success) {
            res.send(201, element);
            return next();

        } else {
            return next(err);
        }
    })
}

/**
 * Function to delete an element from the database
 * @param req
 * @param res
 * @param next
 */
function delElement(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    testData.remove({name: req.params.id },  function (err, success) {
            console.log('Response success ' + success);
            console.log('Response error ' + err);

            if (success) {
                res.send(204);
                return next();
            } else {
                return next(err);
            }
    })
}

