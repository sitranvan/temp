import { Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "calc(100vh - 60px)",
      }}
    >
      <Typography
        sx={{ textTransform: "uppercase" }}
        mb={3}
        color="gray"
        variant="h5"
        component="div"
        gutterBottom
      >
        Welcome
      </Typography>
      <Link to="/chat">
        <Button variant="outlined" color="success">
          Go to chat
        </Button>
      </Link>
    </div>
  );
}
