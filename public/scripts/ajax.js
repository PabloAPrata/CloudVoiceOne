export function ajax(config) {
  const xhr = new XMLHttpRequest();
  let async = true;
  if (config.async !== undefined) async = config.async;

  xhr.open(config.metodo, config.url, async);

  if (config.headers) {
    config.headers.forEach((e) => {
      xhr.setRequestHeader(e.header, e.value);
    });
  }

  if (config.metodo == "post" || config.metodo == "put") {
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(config.body));
  }
  xhr.onload = (e) => {
    if (xhr.status >= 200 && xhr.status < 300) {
      config.sucesso({
        code: xhr.status,
        text: xhr.statusText,
        data: xhr.response,
      });
    } else if (xhr.status >= 400) {
      config.erro({
        code: xhr.status,
        text: xhr.statusText,
        data: xhr.response,
      });
    }
  };

  if (config.metodo == "get" || config.metodo == "delete") xhr.send();
}
