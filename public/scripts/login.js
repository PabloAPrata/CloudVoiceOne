let token = localStorage.getItem("token");
const email_input = document.getElementById("email_input");
const password_input = document.getElementById("password-input");
import { ajax } from "./ajax.js";

document
  .getElementById("login-button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const values = {
      username: email_input.value,
      password: password_input.value,
    };

    ajax({
      url: "/login/auth",
      metodo: "post",
      body: values,
      sucesso(resposta) {
        if (resposta.code === 200) {
          const parseResposta = JSON.parse(resposta.data);
          console.log(
            "🚀 ~ file: login.js:23 ~ sucesso ~ parseResposta",
            parseResposta
          );
          localStorage.setItem("auth", parseResposta.token);
          localStorage.setItem("email", email_input.value);
          localStorage.setItem("video", true);
          window.location.href = "/home/index.html";
        }
      },
      erro(erro) {
        const status = JSON.parse(erro.code);
        const dataResponse = JSON.parse(erro.data).message;
        if (status === 401) {
          alert("Usuário e senha incorretos!");
        }
        if (status != 401) {
          alert(dataResponse);
        }
      },
    });
  });
