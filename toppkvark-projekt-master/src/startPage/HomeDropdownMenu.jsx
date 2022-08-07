import React from "react";
//import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Container, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// jss
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    postion: "relative",
  },
  button: {
    //position och runda hörn
    borderRadius: "10px",
    width: "50vw",
    height: "28vh",

    //Image backgrund
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",

    // hover off
    filter: "brightness(70%)",
    transition: "filter 0.3s",

    // hover on
    "&:hover": {
      transitionTimingFunction: "ease-in-out",
      transition: "filter 0.5s",
      filter: "brightness(110%)",
    },
  },
  // When screen less then 1000px
  "@media screen and (max-width: 1000px)": {
    button: {
      filter: "brightness(100%)",
      width: "95vw",
    },
  },
}));

export default function HomeDropdownMenu() {
  const classes = useStyles();

  const overrideTheme = createMuiTheme({
    typography: {
      fontFamily: `'Ubuntu', sans-serif`,
    },
    overrides: {
      MuiTypography: {
        root: {
          color: "#FAFAFA",
          position: "absolute",
          bottom: "20px",
          left: "30px",
          alignSelf: "flex-end",
        },
      },
    },
  });
  return (
    <ThemeProvider theme={overrideTheme}>
      <Container maxWidth="xs" className={classes.root}>
        <List>
          <ListItem disableGutters={true} component={Link} to="/Kista">
            <Button
              style={{
                backgroundImage:
                  "url(" +
                  "https://upload.wikimedia.org/wikipedia/commons/5/5a/Electrum1.jpg" +
                  ")",
              }}
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
            >
              <Typography variant="h4">Kista</Typography>
            </Button>
          </ListItem>
          <ListItem disableGutters={true} component={Link} to="/Sodertalje">
            <Button
              style={{
                backgroundImage:
                  "url(" +
                  "https://whitearkitekter.com/se/wp-content/uploads/sites/3/2018/10/KTH-Sodertalje-White-Arkitekter-01-16.9.jpg" +
                  ")",
              }}
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
            >
              <Typography variant="h4" style={{}}>
                Södertälje
              </Typography>
            </Button>
          </ListItem>
          <ListItem disableGutters={true} component={Link} to="/Flemingsberg">
            <Button
              style={{
                backgroundImage:
                  "url(" +
                  "https://flemingsbergscience.se/wp-content/uploads/2020/05/KTH-Flemingsberg.jpg" +
                  ")",
              }}
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
            >
              <Typography variant="h4">Flemingsberg</Typography>
            </Button>
          </ListItem>
        </List>
      </Container>
    </ThemeProvider>
  );
}
