const sidebar_btn = document.getElementById("side_menu_btn");
const sidebar = document.getElementById("sidebar");
const aside_buttons = document.getElementById("aside_buttons");
const chat_button = document.getElementById("chat_button");
const call_button = document.getElementById("call_button");
const disconnect_button = document.getElementById("logout");

// PÁGINAS
const app_chat_container = document.getElementById("app_chat_container");
const app_call_container = document.getElementById("app_call_container");

sidebar_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

disconnect_button.addEventListener("click", function () {
  disconnect();
});

const buttons_sidebar = aside_buttons.querySelectorAll("button");
buttons_sidebar.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.id === "chat_button") {
      openChatApp();
    }
    if (element.id === "call_button") {
      openVideoApp();
    }
  });
});

function disconnect() {
  localStorage.removeItem("auth");
  token = null;
  window.location.href = "/";
}

function openVideoApp() {
  app_chat_container.style.zIndex = 1;

  buttons_sidebar.forEach((e) => {
    e.classList.remove("active");
  });
  call_button.classList.add("active");
}

function openChatApp() {
  app_chat_container.style.zIndex = 2;

  buttons_sidebar.forEach((e) => {
    e.classList.remove("active");
  });
  chat_button.classList.add("active");
}
