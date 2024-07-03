import fetch from "node-fetch";
import dotenv from "dotenv";
import open from "open";
import readLineSync from "readline-sync";
import { getEnvVariable, setEnvVariable } from "./envManager.js";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://www.spotify.com";
const SCOPES =
  "user-modify-playback-state user-read-playback-state user-read-currently-playing";
const BASE_URL = "https://api.spotify.com/v1/me/player";
const DEVICE_ID = "213fa13102a413b5ba86bd0098e3751057201ef9";

let accessToken = getEnvVariable("ACCESS_TOKEN");
let expiresIn = getEnvVariable("EXPIRES_IN");
let refreshToken = getEnvVariable("REFRESH_TOKEN");

const authHOC = (fn) => async () => {
  const accessToken = getEnvVariable("ACCESS_TOKEN");
  const expiresIn = getEnvVariable("EXPIRES_IN");
  if (!accessToken || Date.now() > expiresIn) {
    await refreshAuth();
  }
  await fn();
};

export const play = authHOC(async () => {
  const options = {
    url: `${BASE_URL}/play`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_id: DEVICE_ID,
    }),
  };

  try {
    const res = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
    });
  } catch (err) {
    console.log("48: ", err);
  }
});

export const pause = authHOC(async () => {
  const options = {
    url: `${BASE_URL}/pause`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_id: DEVICE_ID,
    }),
  };

  try {
    await fetch(options.url, {
      method: options.method,
      headers: options.headers,
    });
  } catch (err) {
    console.log(err);
  }
});

export const next = authHOC(async () => {
  const options = {
    url: `${BASE_URL}/next`,
    headers: {
      method: "POST",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    await fetch(options.url, {
      method: "POST",
      headers: options.headers,
      body: JSON.stringify({
        device_id: DEVICE_ID,
      }),
    });
  } catch (err) {
    console.log(err);
  }
});

export const prev = authHOC(async () => {
  const options = {
    url: `${BASE_URL}/previous`,
    headers: {
      method: "POST",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    await fetch(options.url, {
      method: "POST",
      headers: options.headers,
      body: JSON.stringify({
        device_id: DEVICE_ID,
      }),
    });
  } catch (err) {
    console.log(err);
  }
});

const getAuthorizationCode = () => {
  const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  open(authURL); // Opens the browser for the user to authorize
  const code = readLineSync.question("Enter the code from the URL: ");
  return code;
};

export const auth = async (code) => {
  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("code", code);
  body.append("redirect_uri", REDIRECT_URI);

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const res = await fetch(authOptions.url, {
      method: "POST",
      headers: authOptions.headers,
      body: body.toString(),
    });

    if (res.ok) {
      const { access_token, expires_in, refresh_token } = await res.json();
      accessToken = access_token;
      expiresIn = Date.now() + expires_in * 1000;
      refreshToken = refresh_token;
      setEnvVariable("ACCESS_TOKEN", accessToken);
      setEnvVariable("EXPIRES_IN", expiresIn);
      setEnvVariable("REFRESH_TOKEN", refreshToken);
    } else {
      console.log("Authorization failed with status:", res.status);
    }
  } catch (err) {
    console.log(err);
  }
};

const refreshAuth = async () => {
  const body = new URLSearchParams();
  body.append("grant_type", "refresh_token");
  body.append("refresh_token", refreshToken);

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const res = await fetch(authOptions.url, {
      method: "POST",
      headers: authOptions.headers,
      body: body.toString(),
    });

    if (res.ok) {
      const { access_token, expires_in } = await res.json();
      accessToken = access_token;
      expiresIn = Date.now() + expires_in * 1000;
      setEnvVariable("ACCESS_TOKEN", accessToken);
      setEnvVariable("EXPIRES_IN", expiresIn);
    } else {
      console.log("Refresh failed with status:", res.status);
    }
  } catch (err) {
    console.log(err);
  }
};

if (!accessToken) {
  const code = getAuthorizationCode();
  auth(code).then(() => {
    const action = readLineSync.question("Enter action: ");

    switch (action) {
      case "play":
        play();
        break;
      case "next":
        next();
        break;
      case "prev":
        prev();
        break;
      default:
        console.log("Invalid action");
    }
  });
}
