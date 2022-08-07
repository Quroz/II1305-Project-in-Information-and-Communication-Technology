import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import MainLayout from "./mainLayout/MainLayout";
import { BrowserRouter as Router } from "react-router-dom";
import Cookies from "js-cookie";
import "./App.css";
import Model from "./data/Model";

function App() {
  // model init start ###
  const appModel = new Model();
  // model time init
  appModel.setSelectedStartTime(appModel.selectedStartTime);
  appModel.setSelectedEndTime(appModel.selectedEndTime);
  appModel.setSelectedTimes();
  // model init end ###

  // Cookie logic
  appModel.darkMode = Cookies.get("darkMode") === "true";
  if (appModel.darkMode === undefined) {
    appModel.darkMode = false;
  }
  appModel.haveBookedRoom = Cookies.get("haveBooked") === "true";
  if (appModel.haveBookedRoom === undefined) {
    appModel.haveBookedRoom = false;
  }
  const [darkMode, setDarkMode] = React.useState(appModel.darkMode);

  React.useEffect(() => {
    function obs() {
      setDarkMode(appModel.darkMode);
    }
    appModel.addObserver(obs);
    return function () {
      appModel.removeObserver(obs);
    };
  });

  const theme = createMuiTheme({
    typography: {
      fontFamily: `'Ubuntu', sans-serif`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 500,
      fontWeightMedium: 300,
    },

    palette: {
      primary: {
        main: darkMode ? "#141414" : "#063180",
        dark: darkMode ? "#000000" : "#04245e",
      },
      secondary: {
        main: darkMode ? "#2e2e2e" : "#0565e3",
      },
      text: {
        primary: darkMode ? "#4c65a1" : "#FAFAFA",
      },
    },
    overrides: {
      MuiDrawer: {
        paper: {
          background: darkMode ? "#222222" : "#1f4ea3",
        },
      },
      MuiTabs: {
        flexContainer: {
          color: "#000000",
        },
      },
      MuiDialog: {
        paper: {
          background: darkMode ? "#222222" : "#1f4ea3",
        },
      },
      MuiTableContainer: {
        root: {
          backgroundColor: darkMode ? "#2e2e2e" : "#0565e3",
        },
      },
    },
  });

  return (
    <Router>
      <div className="App">
        <ThemeProvider theme={theme}>
          <MainLayout model={appModel} />
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
