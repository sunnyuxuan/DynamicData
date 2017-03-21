'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');
const fs = require("fs");
const Sequelize = require('sequelize');
//const Fetch = require("node-fetch");
//const FormData = require("form-data");

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
    port: 3000
});

var sequelize = new Sequelize('db', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: 'db.sqlite'
});


var User = sequelize.define('user', {
    Track: {
        type: Sequelize.STRING
    },
    Year: {
        type: Sequelize.TIME
    },
    Header: {
        type: Sequelize.STRING
    },
    message: {
        type: Sequelize.STRING
    },
    imglink: {
        type: Sequelize.STRING
    },
    Caption: {
        type: Sequelize.STRING
    }
});


server.register([Blipp, Inert, Vision], () => {});


server.views({
    engines: {
        html: Handlebars
    },
    path: Path.join(__dirname, 'views'),
    layoutPath: 'views/layout',
    layout: 'layout',
    helpersPath: 'views/helpers',
    //partialsPath: 'views/partials'
});


server.route({
    method: 'GET',
    path: '/',
    handler: {
        view: {
            template: 'index'
        }
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: './',
            listing: false,
            index: false
        }
    }
});

server.route({
    method: 'GET',
    path: '/createDB',
    handler: function (request, reply) {
        // force: true will drop the table if it already exists
        User.sync({
            force: true
        })
        reply("Database Created")
    }
});



server.route({

    method: 'POST',
    path: '/add',
    handler: function (request, reply) {
        var formresponse = JSON.stringify(request.payload);
        var parsing = JSON.parse(formresponse);


        User.create(parsing).then(function (currentUser) {
            User.sync();
            console.log("...syncing");
            console.log(currentUser);
            return (currentUser);
        }).then(function (currentUser) {

            reply().redirect("/displayAll");

        });
    }
});


server.route({
    method: 'GET',
    path: '/destroyAll',
    handler: function (request, reply) {

        User.drop();

        reply("The datas have been all destroyed");
    }
});

server.route({
    method: 'GET',
    path: '/destroyAll/{id}',
    handler: function (request, reply) {


        User.destroy({
            where: {
                id: encodeURIComponent(request.params.id)
            }
        });

        reply("destroy user");
    }
});


server.route({
    method: 'GET',
    path: '/update/{id}',
    handler: function (request, reply) {
        var id = encodeURIComponent(request.params.id);


        reply.view('updatedata', {
            routeId: id
        });
    }

});

server.route({
    method: 'POST',
    path: '/update/{id}',
    handler: function (request, reply) {
        var id = encodeURIComponent(request.params.id);
        var formresponse = JSON.stringify(request.payload);
        var parsing = JSON.parse(formresponse);
        //console.log(parsing);

        User.update(parsing, {
            where: {
                id: id
            }
        });

        reply().redirect("/displayAll");

    }

});

server.route({
    method: 'GET',
    path: '/createform',
    handler: {
        view: {
            template: 'createform'
        }
    }
});


server.route({
    method: 'POST',
    path: '/form',
    handler: function (request, reply) {
        var formresponse = JSON.stringify(request.payload);
        var parsing = JSON.parse(formresponse);

        //console.log(parsing);

        User.create(parsing).then(function (currentUser) {
            User.sync();
            console.log("...syncing");
            console.log(currentUser);
            return (currentUser);
        }).then(function (currentUser) {

            //            reply.view('formresponse', {
            //                formresponse: currentUser
            //            });

            console.log(currentUser.Track);

            if (currentUser.Track =="Change") {
                reply().redirect("/Change");
            }else if(currentUser.Track =="Finance") {
               reply().redirect("/Finance");
            }else{
            reply().redirect("/Race");
            }

        });
    }
});

//server.route({
//    method: 'GET',
//    path: '/changingneighborhoods',
//    handler: function (request, reply) {
//
//    
//
//        User.findAll({
//            where: {
//                Track: "Changing Neighborhoods"
//            },
//            order: [['Year', 'ASC']],
//        }).then(function (allUsers) {
//            //console.log("number of items: " + allUsers.length);
//            //reply(allUsers);
//            var currentUsers = JSON.stringify(allUsers);
//            reply.view('changingNeighborhoods', {
//                dbresponse: currentUsers
//            });
//        });
//
//
//    }
//});



server.route({
    method: 'GET',
    path: '/{Track}',
    handler: function (request, reply) {

        //get all the data
        
        //grab track parameter enccodeURI
        //where track: params.Track

        User.findAll({
            where: {
                Track: encodeURIComponent(request.params.Track),
            },
            order: [['Year', 'ASC']],
        }).then(function (allUsers) {
//            console.log("number of items: " + allUsers.length);
//            reply(allUsers);
           
            var currentTrack = encodeURIComponent(request.params.Track);
            var currentUsers = JSON.stringify(allUsers);
//            console.log(allUsers.Track);
//            reply(allUsers.Track);
            if(currentTrack=="Change"){
            reply.view('changingNeighborhoods', {
                dbresponse: currentUsers
            })
            }
            else if(currentTrack=="Finance"){
             reply.view('finance', {
                dbresponse: currentUsers
            })
            }
            else{
            reply.view('raceAndProperty', {
                dbresponse: currentUsers
            })
            }
             
        });


    }
});

server.route({
    method: 'GET',
    path: '/displayAll',
    handler: function (request, reply) {
        User.findAll().then(function (users) {
            // projects will be an array of all User instances
            //console.log(users[0].monsterName);
            var allUsers = JSON.stringify(users);
            reply.view('dbresponse', {
                dbresponse: allUsers
            });
        });
    }
});

server.route({
    method: 'GET',
    path: '/find/{Year}',
    handler: function (request, reply) {
        User.findOne({
            where: {
                Year: encodeURIComponent(request.params.Year),
            }
        }).then(function (user) {
            var currentUser = "";
            currentUser = JSON.stringify(user);
            //console.log(currentUser);
            currentUser = JSON.parse(currentUser);
            console.log(currentUser);
            reply.view('find', {
                dbresponse: currentUser
            });

        });
    }
});
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);

});