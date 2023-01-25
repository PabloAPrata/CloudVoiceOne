"use strict";

const axios = require("axios");

let data;

module.exports = function (app) {
  app.post("/login/auth", function (req, res) {
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
          return res.status(401).json(err);
        });
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post("/login/authorization", function (req, res) {
    try {
      const token = req.body.token;

      const options = {
        method: "GET",
        url: `http://api.cloudvoiceone.com/auth/authorization/${token}`,
        headers: { Authorization: "Bearer " + token },
      };

      axios
        .request(options)
        .then(function (response) {
          let response_api = response.data;
          const data = {
            username: response_api.username_sip,
            password: response_api.password_sip,
            proxy: response_api.sip_proxy,
            port: 5060,
            label: response_api.name_user,
            ramal: response_api.extension,
            proxy_janus: response_api.janus_server,
            proxy_port_nossl: response_api.port_janus_nossl,
            proxy_port_ssl: response_api.port_janus_ssl,
          };

          return res.json(data);
        })
        .catch(function (err) {
          // console.log(err);
          return res.status(401).json(err);
        });
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
