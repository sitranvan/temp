import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { IoLogInOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axios";
import getMe from "../utils/getMe";

const getGoogleAuthUrl = () => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth`;
  const {
    VITE_GOOGLE_CLIENT_ID,
    VITE_GOOGLE_REDIRECT_URI,
    VITE_GOOGLE_AUTH_PROFILE_SCOPE,
    VITE_GOOGLE_AUTH_EMAIL_SCOPE,
  } = import.meta.env;
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: [VITE_GOOGLE_AUTH_PROFILE_SCOPE, VITE_GOOGLE_AUTH_EMAIL_SCOPE].join(
      " "
    ),
    prompt: "consent",
    access_type: "offline",
  };
  const queryString = new URLSearchParams(query).toString();
  return `${url}?${queryString}`;
};

const googleOAuthUrl = getGoogleAuthUrl();

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Login với email và password

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post("/users/login", user);
      const { access_token, refresh_token } = res.data.result;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      getMe(access_token);
      navigate("/chat");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="home-page">
      <Box>
        <Typography
          color="gray"
          sx={{
            fontSize: "35px",
            mb: 1,
            width: "400px",
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          component="h2"
        >
          Login
          <IoLogInOutline fontSize="40px" />
        </Typography>

        <Box
          onSubmit={handleLogin}
          method="POST"
          component="form"
          sx={{ mt: 2, width: "400px" }}
        >
          <TextField
            color="success"
            id=""
            name="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            label="Enter your email"
            variant="outlined"
            fullWidth
          />
          <TextField
            color="success"
            id=""
            label="Enter your password"
            variant="outlined"
            fullWidth
            name="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            sx={{ mt: 2 }}
          />
          <Button
            type="submit"
            sx={{ mt: 2, py: 1 }}
            fullWidth
            variant="contained"
          >
            Login
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            color="gray"
            sx={{
              mt: 2,
              fontWeight: 500,
              fontSize: "18px",
              textTransform: "uppercase",
            }}
            component="h3"
          >
            Or
          </Typography>
          <Link to={googleOAuthUrl}>
            <Button
              sx={{ mt: 2, py: 1 }}
              startIcon={<FcGoogle fontSize="20px" />}
              variant="outlined"
            >
              Login with Google
            </Button>
          </Link>
        </Box>
      </Box>
    </main>
  );
}
