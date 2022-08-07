import React from "react";
import { Route } from "react-router-dom";
import Cookies from "js-cookie";

// material ui components
import { makeStyles } from "@material-ui/core/styles";

// components
import Home from "../startPage/Home";
import BuildingPresenter from "../svgMap/BuildingPresenter";
import MainLayoutDrawer from "./MainLayoutDrawer";

const useStyles = makeStyles((theme) => ({
  root: {},

  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -300,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function MainLayout({ model }) {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(model.darkMode);

  React.useEffect(() => {
    function obs() {
      setDarkMode(model.darkMode);
    }
    model.addObserver(obs);
    return function () {
      model.removeObserver(obs);
    };
  });

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  return (
    <div className={classes.root}>
      <MainLayoutDrawer
        setDarkMode={(val) => {
          Cookies.set("darkMode", val);
          model.setDarkMode(val);
        }}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        darkMode={darkMode}
      />
      <main>
        {/* start sida */}
        <Route exact path="/">
          <Home
            darkMode={darkMode}
            drawerOpen={drawerOpen}
            handleDrawerOpen={handleDrawerOpen}
          />
        </Route>
        {/* alla campus */}
        <Route path="/Kista">
          <BuildingPresenter
            drawerOpen={drawerOpen}
            handleDrawerOpen={handleDrawerOpen}
            campusName="Kista"
            model={model}
          />
        </Route>
        <Route path="/Flemingsberg">
          <BuildingPresenter
            drawerOpen={drawerOpen}
            handleDrawerOpen={handleDrawerOpen}
            campusName="Flemingsberg"
            model={model}
          />
        </Route>
        <Route path="/Sodertalje">
          <BuildingPresenter
            drawerOpen={drawerOpen}
            handleDrawerOpen={handleDrawerOpen}
            campusName="Sodertalje"
            model={model}
          />
        </Route>
        <div />
      </main>
    </div>
  );
}
