import { API_URLS } from "../config/api-routes.js";
import { Token } from "./Token.js";

export async function sendRequestToApi(body, endpoint, method) {
  let request = createRequest(body, endpoint, method);
  return fetch(request)
    .then((response) => {
      if (response.status >= 400) {
        //if request failed (//TODO change)
        let refreshResponse = refresh();
        if (refreshResponse.status >= 400) {
          console.log("refresh failed");
          return refreshResponse;
        } else {
          console.log("token refreshed. Try to do request again");
          console.log(response.status);
          console.log(response.json());
          return fetch(createRequest(body, endpoint, method));
        }
      } else {
        let obj = {
          code: response.status,
          body: response.json(),
        };
        console.log(obj);
        return obj;
      }
    })
    .catch((error) => {
      console.log("error");
      console.log(error);
    });
}

export async function refresh() {
  const response = await fetch(API_URLS.ACCOUNT_REFRESH_TOKEN, {
    credentials: "include",
    method: "POST",
  });
  if (response.ok) {
    const body = await response.json();
    console.log(body.token);
    localStorage.setItem("token", body.token);
    console.log(localStorage.getItem("token"));
  }
}

export function testLogin() {
  return sendRequestToApi(null, API_URLS.SET_GET.replace(":id", 6), "GET");
}

export async function login(email, password) {
  let loginInfo = {
    email: email,
    password: password,
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const request = new Request(API_URLS.ACCOUNT_LOGIN, {
    credentials: "include",
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(loginInfo),
  });
  const response = await fetch(request);
  console.log(response);
  let object = await response.json();
  localStorage.setItem("token", new Token(object.token));
  return object;
}

function createRequest(body, endpoint, method) {
  const headers = new Headers();
  const token = localStorage.getItem("token");
  headers.append("Content-Type", "application/json");
  headers.append("Authentication", `Bearer ${token.token}`);
  const request = new Request(endpoint, {
    method: method,
    headers: headers,
    body: method == "GET" ? null : JSON.stringify(body),
  });
  return request;
}
