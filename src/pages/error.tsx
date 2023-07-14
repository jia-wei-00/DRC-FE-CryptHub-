import { Box, Button, Container, Typography } from "@mui/material";
import Logo from "../assets/tab-icon.svg";
import "../styles/pages/error.scss";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <Box className="container">
      <Container maxWidth="md">
        <div>
          <Typography variant="h1">404</Typography>
          <Typography variant="h6">
            The page you’re looking for doesn’t exist.
          </Typography>
          <Link to="/">
            <Button variant="contained">Back Home</Button>
          </Link>
        </div>
        <div>
          <img src={Logo} alt="" className="rotate" />
        </div>
      </Container>
    </Box>
  );
}
