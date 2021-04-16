const express = require("express");
const session = require('express-session');
const server = express();
const routes = require("./routes");
const path = require("path");
const flash  = require('express-flash-messages');

// Seção
server.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'secret'
}));

// Usando template engine
server.set("view engine", "ejs");

// Mudar a localização da pasta views
server.set("views", path.join(__dirname, 'views'));

// Habilitar arquivos statics
server.use(express.static("public"));

// usar o req.body
server.use(express.urlencoded({ extended: true }));

// mostrar mensagens de erros
server.use(flash());



// routes
server.use(routes);


server.listen(3333);


