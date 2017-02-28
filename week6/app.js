'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');

const fs = require("fs");

const Sequelize = require('sequelize');



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
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    },
    pandaname: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.TIME
    },
    place: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    food: {
        type: Sequelize.STRING
    },
    favcolor: {
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
    method: 'GET',
    path: '/createNew',
    handler: {
        view: {
            template: 'createNew'
        }
    }
});

server.route({

    method: 'POST',
    path: '/form',
   handler: function (request, reply) {
        var formresponse = request.payload;
        //console.log(formResponse);
        var jsonForm = JSON.stringify(formresponse);
        //console.log(typeof(jsonForm));
        console.log("Writing Data");
        fs.writeFile('savedata.txt', jsonForm, function (err) {
            if (err) {
                return console.error(err);
            }

            console.log("reading saved data");
            fs.readFile('savedata.txt', function (err, data) {
                if (err) {
                    return console.error(err);
                }

                console.log(data.toString());

            });
        });
        reply("Thank you You just named a panda");
    }
    }
);




server.route({
    method: 'GET',
    path: '/destroyAll',
    handler: function (request, reply) {

        User.drop();

        reply("destroy all");
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
    path: '/displayAll',
    handler: function (request, reply) {
        User.findAll().then(function (users) {
            // projects will be an array of all User instances
            //console.log(users[0].firstName);
            var allUsers = JSON.stringify(users);
            reply.view('dbresponse', {
                dbresponse: allUsers
            });
        });
    }
});

server.route({
    method: 'GET',
    path: '/find/{pandaname}',
    handler: function (request, reply) {
        User.findOne({
            where: {
                pandaname: encodeURIComponent(request.params.pandaname),
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

server.route({
    method: 'GET',
    path: '/findAll/food/{item}',
    handler: function (request, reply) {
        Monster.findAll({
            where: {
                food: encodeURIComponent(request.params.item),
            }
        }).then(function (allUsers) {
            console.log("the number of items", allUsers.length);
            
            var currentUser = "";
            currentUser = JSON.stringify(allUsers);
            //console.log(currentUser);
            console.log(currentUser);
            reply.view('dbresponse', {
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
