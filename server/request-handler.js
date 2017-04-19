/************************************************************* You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');
moment().format();
var data = {
    results: []
};

var handleJSONData = function(message) {
    var pastDataFile = fs.readFileSync("data.json");
    var pastData = JSON.parse(pastDataFile);
    message.date = new Date();
    pastData.results.unshift(message);

    myObjects = _.sortBy(pastData.results, 'date');
    console.log();



    var json = JSON.stringify(pastData);
    fs.writeFileSync("data.json", json);
};



var requestHandler = function(request, response) {

    // Request and Response come from node's http module.
    //
    // They include information about both the incoming request, such as
    // headers and URL, and about the outgoing response, such as its status
    // and content.
    //
    // Documentation for both request and response can be found in the HTTP section at
    // http://nodejs.org/documentation/api/

    // Do some basic logging.
    //
    // Adding more logging to your server can be an easy way to get passive
    // debugging help, but you should always be careful about leaving stray
    // console.logs in your code.
    console.log('Serving request type ' + request.method + ' for url ' + request.url);
    // The outgoing status.
    var statusCode = 200;
    var postCode = 201;
    var errorCode = 404;

    // See the note below about CORS headers.
    var headers = defaultCorsHeaders;

    // Tell the client we are sending them json.
    headers['Content-Type'] = 'application/json';
    console.log('Method:' + request.method);

    // .writeHead() writes to the request line and headers of the response,
    // which includes the status and all headers.

    response.writeHead(statusCode, headers);

    if (request.method === 'OPTIONS' && _.includes(request.url, "/classes/messages")) {

        response.writeHead(statusCode, headers);
        response.end(fs.readFileSync("data.json"));

    } else if (request.method === 'GET' && _.includes(request.url, "/classes/messages")) {

        response.writeHead(statusCode, headers);
        response.end(fs.readFileSync("data.json"));

    } else if (request.method === 'POST' && _.includes(request.url, "/classes/messages")) {

        request.on('data', function(message) {
            var message = JSON.parse(message)
            console.log(message);
            handleJSONData(message);
        });

        request.on('end', function() {
            response.end(fs.readFileSync("data.json"));
        });

        response.writeHead(postCode, headers);

    } else {

        response.writeHead(errorCode, headers);
        response.end(fs.readFileSync("data.json"));

    }
    // Make sure to always call response.end() - Node may not send
    // anything back to the client until you do. The string you pass to
    // response.end() will be the body of the response - i.e. what shows
    // up in the browser.
    //
    // Calling .end “flushes” the response's internal buffer, forcing
    // node to actually send all the data over to the client.
    //response.end('testing123');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
