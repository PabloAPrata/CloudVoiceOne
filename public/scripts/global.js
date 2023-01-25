import { ajax } from "./ajax.js";

// let opaqueId = `siptest-${Janus.randomString(12)}`;
let opaqueId = `siptest-${generateRandomString(12)}`;
let sipcall = null;
let authorization = {};
const token = localStorage.getItem("auth");
const accountInfo = {
  email: localStorage.getItem("email"),
  ramal: null,
  name: null,
};

function getAuthorization() {
  const values = {
    token: token,
  };

  ajax({
    url: "/login/authorization",
    metodo: "post",
    headers: [{ header: "Authorization", value: `Bearer ${token}` }],
    body: values,
    sucesso(resposta) {
      const data = JSON.parse(resposta.data);
      authorization = data;
      accountInfo.ramal = authorization.ramal;
      accountInfo.name = authorization.label;
      console.log(authorization);
      startProgram(token);
    },
    erro(erro) {
      console.log(erro);
    },
  });
}

function startProgram(token) {
  if (!token) {
    alert("Sua sessão expirou! error: 000");
    window.location.href = "/login";
  }

  //   while (!authorization) {
  //     startProgram(token);
  //   }

  //   initAudioJanus(authorization);
}

function initAudioJanus(authorization) {
  JanusStatic.init({
    debug: true,
    callback: function () {
      // Verifica se o navegador suporta WebRTC
      if (!JanusStatic.isWebrtcSupported()) {
        alert("Sem suporte a WebRTC");
        return;
      }

      // Entra no servidor
      janus = new Janus({
        server: `http://${authorization.proxy_janus}:${authorization.proxy_port_nossl}/janus`,
        iceServers: [
          {
            urls: "turn:turn.cloudvoiceone.com:3478",
            credential: "LO6t0IXooCnREnwX",
            username: "cloudvoiceturn",
          },

          { urls: "stun:stun.l.google.com:19302" },
        ],
        sucess: function () {
          alert("Servidor conectado com sucesso!");
          janus.attach({
            plugin: "janus.plugin.sip",
            opaqueId: opaqueId,
            success: function (pluginHandle) {
              sipcall = pluginHandle;
              Janus.log(
                "Plugin attached! (" +
                  sipcall.getPlugin() +
                  ", id=" +
                  sipcall.getId() +
                  ")"
              );

              // Prepara o username para registrar
              // Registra o usuário sip no janus
              registerUsername(authorization);
            },
            error: function (error) {
              Janus.error(" --Error attaching plugin...", error);
              alert("Error attaching plugin. Error: 001");
              console.log(error);
            },
            consentDialog: function (on) {
              Janus.debug(
                "Consent dialog should be " + (on ? "on" : "off") + " now"
              );
            },
            iceState: function (state) {
              Janus.log("Ice state changed to " + state);
            },
            mediaState: function (medium, on, mid) {
              Janus.log(
                "Janus " +
                  (on ? "started" : "stopped") +
                  " receiving our " +
                  medium +
                  " (mid=" +
                  mid +
                  ")"
              );
            },
            webrtcState: function (on) {
              Janus.log(
                "Janus says our WebRTC PeerConnection is " +
                  (on ? "up" : "down") +
                  " now"
              );
            },
            slowLink: function (uplink, lost, mid) {
              Janus.warn(
                "Janus reports problems " +
                  (uplink ? "sending" : "receiving") +
                  "packets on mid " +
                  mid +
                  " (" +
                  lost +
                  " lost packets"
              );
            },
            onmessage: function (msg, jsep) {
              Janus.debug("::: Got message " + msg);

              // Algum Erro?
              let error = msg["error"];
              if (error) {
                alert("Houve um problema. Error: 002");
                console.log(error);

                sipcall.hangup();

                return;
              }

              let callId = msg["call_id"];
              let result = msg["result"];

              if (result && result["event"]) {
                let event = result["event"];

                if (event === "registration_failed") {
                  Janus.warn(
                    "Registration failed " +
                      result["code"] +
                      " " +
                      result["reason"]
                  );
                  console.log(
                    "Registration failed " +
                      result["code"] +
                      " " +
                      result["reason"]
                  );
                  alert("Houve um problema. Error: 003");
                }

                if (event === "registered") {
                  console.log(
                    "Successfully registered as " + result["username"] + "!"
                  );
                  Janus.log(
                    "Successfully registered as " + result["username"] + "!"
                  );
                  alert(
                    "Successfully registered as " + result["username"] + "!"
                  );

                  //TODO Enable buttons to call now

                  if (!registered) {
                    registered = true;
                    masterId = result["master_id"];
                  }
                } else if (event === "calling") {
                  // Janus.log();
                  //TODO Any ringtone?
                } else if (event === "incomingcall") {
                } else if (event === "accepting") {
                } else if (event === "progress") {
                } else if (event === "accepted") {
                } else if (event === "message") {
                } else if (event === "info") {
                } else if (event === "notify") {
                } else if (event === "transfer") {
                } else if (event === "proceeding") {
                } else if (event === "hangup") {
                  if (result["code"] == "487") {
                  }
                  if (result["code"] == "404") {
                  }
                  if (result["code"] == "484") {
                  }
                  if (result["code"] == "480") {
                  }
                  if (result["code"] == "486") {
                  }
                  if (result["code"] == "200") {
                  }
                }
              }
            },
            onlocaltrack: function (track, on) {},
            onremotetrack: function (track, mid, on) {},
            oncleanup: function () {},
          });
        },
        error: function (error) {
          console.log(error);
        },
      });
    },
  });
}

function registerUsername(authorization) {
  let sipserver = `sip:${authorization.proxy}`;

  let register = {
    request: "register",
  };

  register["proxy"] = sipserver;

  let username = `sip:${authorization.username}@${authorization.proxy}`;
  register.username = username;

  let authuser = authorization.username;
  register.authuser = authuser;

  let displayname = authorization.label;
  register.displayname = displayname;

  let password = authorization.password;
  register["secret"] = password;

  sipcall.send({ message: register });
}

function generateRandomString(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

getAuthorization();
