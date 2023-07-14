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
          color: "black",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(162, 123, 92, 0.8)",
          color: "white",
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
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#DCD7C9",
          color: "#A27B5C !important",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              border: "1px solid rgba(0,0,0,0.3)",
            },
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(162, 123, 92, 0.8)",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(162, 123, 92, 0.8)",
        },
      },
    },
  },
  typography: {
    fontFamily: "poppins",
  },
});
