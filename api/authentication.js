"use strict";

const axios = require("axios");

module.exports = function (app) {
  app.post("login/auth", function (req, res) {
    try {
      const options = {
        method: "POST",
        url: "http://api.cloudvoiceone.com/auth/login",
        data: {
          username: req.body.username,
          password: req.body.password,
        },
      };

      axios
        .request(options)
        .then(function (response) {
          data = response.data;

          return res.json(data);
        })
        .catch(function (err) {
          console.log(err);
          return res.json(err);
        });
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
