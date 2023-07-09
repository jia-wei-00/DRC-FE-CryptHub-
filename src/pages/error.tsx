import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Logo from "../assets/logo.svg";
import "../styles/pages/error.scss";

export default function ErrorPage() {
  return (
    <Box className="container">
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h6">
              The page you’re looking for doesn’t exist.
            </Typography>
            <Button variant="contained">Back Home</Button>
          </Grid>
          <Grid xs={12} md={6}>
            <img src={Logo} alt="" className="rotate" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
