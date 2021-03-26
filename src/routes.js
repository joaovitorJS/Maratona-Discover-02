const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/";

const profile = {
  name: "profile",
  avatar: "https://avatars.githubusercontent.com/u/55931239?s=400&u=1de35847dd5c3cf5c51a955893b122f11bd5c30d&v=4",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4
}

routes.get('/', (req, res) => {
  return res.render(views + "index");
});

routes.get('/job', (req, res) => {
  return res.render(views + "job");
});

routes.get('/job/edit', (req, res) => {
  return res.render(views + "job-edit");
});

routes.get('/profile', (req, res) => {
  return res.render((views + "profile"), { profile });
});

module.exports = routes;