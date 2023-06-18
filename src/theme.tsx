import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default:
        "linear-gradient(43deg, rgba(44, 54, 57, 1) 0%, rgba(44, 54, 57, 1) 26%, rgba(65, 77, 81, 1) 61%, rgba(95, 107, 110, 1) 100%)",
    },
    primary: {
      main: "#A27B5C",
    },
    secondary: {
      main: "#2C3639",
    },
  },
  components: {
    MuiSvgIcon: {
      defaultProps: {
        htmlColor: "#FFFFFF",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#3F4E4F",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#3F4E4F",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
  },
  typography: {
    fontFamily: "poppins",
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f6e6cb",
    },
    primary: {
      main: "#A27B5C",
    },
    secondary: {
      main: "#F6E6CB",
    },
  },
  components: {
    MuiSvgIcon: {
      defaultProps: {
        htmlColor: "#A27B5C",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // color: "#FFFFFF",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#DCD7C9",
        },
      },
    },
  },
  typography: {
    fontFamily: "poppins",
  },
});
