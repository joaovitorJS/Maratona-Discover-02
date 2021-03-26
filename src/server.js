const express = require("express");
const server = express();
const routes = require("./routes");

// Usando template engine
server.set("view engine", "ejs");

// Habilitar arquivos statics
server.use(express.static("public"));

// routes
server.use(routes);


server.listen(3333, () => {
  console.log("rodando");
});


