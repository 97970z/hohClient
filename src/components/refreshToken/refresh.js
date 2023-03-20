import axios from "axios";

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshtoken");
  try {
    const response = await axios.post("/api/auth/refresh-token", {
      refreshToken,
    });
    const { token, accessTokenExp } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("accessTokenExp", accessTokenExp);
    return response.data;
  } catch (err) {
    console.error("Failed to refresh the token", err);
  }
};

export const checkTokenExpiration = async () => {
  const accessTokenExp = parseInt(localStorage.getItem("accessTokenExp"), 10);
  const currentTime = Math.floor(Date.now() / 1000);

  console.log("Access token expiration:", new Date(accessTokenExp * 1000));
  console.log("Current time:", new Date(currentTime * 1000));

  if (currentTime >= accessTokenExp) {
    console.log("Access token has expired. Refreshing token...");
    const response = await refreshToken();
    console.log("response : ", response);

    if (response) {
      console.log("New access token:", response.token);
      console.log(
        "New access token expiration:",
        new Date(response.accessTokenExp * 1000)
      );
      localStorage.setItem("token", response.token);
      localStorage.setItem("accessTokenExp", response.accessTokenExp);
      return true;
    } else {
      console.log("Failed to refresh token");
      return false;
    }
  } else {
    console.log("Access token is still valid.");
    return true;
  }
};
