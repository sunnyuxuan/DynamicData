'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path')
const Handlebars = require('handlebars');


// Create a server with a host and port
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});


server.connection({
    port: 3000,
    host: 'localhost' //different here
});

//install libraries
server.register([Blipp, Inert, Vision], () => {});

server.views({
    engines: {
        html: Handlebars
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'layout',
    helpersPath: 'views/helpers'
});




// Add the route
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: './',
            listing: true,
            index: false,
            redirectToSlash: true
        }  
    }
});

//page2 story starts from here
server.route({
    method: 'GET',
    path: '/dynamic',
    handler: {
        view: {
            template: 'dynamic',
            context: {
                title: "Panda Maodou invite you to her party tonight",
                message: 'It is a lovely Sunday morning. Sweet and soft white clouds dancing in the crystal-like blue sky. Our cute panda Maodou invite her friends to join her party. You are on her guest list. Would you like to ....',
                nav: [
                    {url: "/page2/Trojan",
                     title: "Buy a Gift for Her"},
                    {url: "/page2/Cake",
                     title: "Make a cake for Her"},
                    {url: "/page2/ballon",
                     title: "Help her to prepare for the party"
                    }  
                ]
            }
        }
    }
});

//page3 story starts from here
server.route({
    method: 'GET',
    path: '/page2/{played*}',
    handler: function (request, reply){
        var played = encodeURIComponent(request.params.played);
        var message = played;
        
        reply.view('page2', {
            title: "Panda Maodou invite you to her party tonight",
            message: message,
            pic: played,
            nav: [
                {url: "/page3/bridge",
                 title: "bridge"},
                {url: "/page3/path",
                 title: "path"},
                {url: "/page3/cave",
                 title: "cave"
                
                }
            ]
        });
    }
});


server.route({
    method: 'GET',
    path: '/page3/{played*}',
    handler: function (request, reply) {
        var played = encodeURIComponent(request.params.played);
        var message = played;
        reply.view('page3', {
            title: "Panda Maodou invite you to her party tonight",
            message: message,
            pic: played
        });
    }
});





// Start the server

    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);

    });
