'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    port: 3000,
    host: 'localhost'
});

// Add the route
server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {

        reply('hello world');
    }
});

server.route({
    method: 'GET',
    path:'/{name}', 
    handler: function (request, reply) {

       reply('Hello' + encodeURIComponent(request.params.name)
            +"!!!!!!!");
    }
});

server.route({
    method: 'GET',
    path:'/{name}/{lastname}', 
    handler: function (request, reply) {

       reply('Hello' + " " + encodeURIComponent(request.params.name)+ " "
            + encodeURIComponent(request.params.lastname)+"!!!!!");
    }
});


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});


