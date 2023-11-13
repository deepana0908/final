import sleep from "../sleep";
import request from "./request";

const PATH = "/auth";

async function getAccessToken(authCode) {
  return await request(`${PATH}/access-token?code=${authCode}`);
}

async function checkAuth(authCode) {
  return await request(`${PATH}/check?code=${authCode}`);
}

async function logout(authCode) {
  return await request(`${PATH}/logout?code=${authCode}`);
}

const Auth = {
  getAccessToken,
  checkAuth,
  logout,
};

export default Auth;
