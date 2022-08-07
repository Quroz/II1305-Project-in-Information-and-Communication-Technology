import React from "react";

import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {},
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function MainLayoutDrawer({
  open,
  setOpen,
  darkMode,
  setDarkMode,
}) {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div>
        <div className={classes.drawerHeader}>
          <Grid container spacing={1}>
            <Grid item xs={10}>
              <Button
                component={Link}
                to="/"
                variant="text"
                size="large"
                color="#ff7961"
              >
                {darkMode ? (
                  <Typography variant="h4" style={{ color: "#4c65a1" }}>
                    Toppkvark
                  </Typography>
                ) : (
                  <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                    Toppkvark
                  </Typography>
                )}
              </Button>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                style={{ color: "#FAFAFA" }}
                onClick={() => setOpen(false)}
              >
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon
                    style={{ color: theme.palette.text.primary }}
                  />
                ) : (
                  <ChevronRightIcon
                    style={{ color: theme.palette.text.primary }}
                  />
                )}
              </IconButton>
            </Grid>
          </Grid>
        </div>
      </div>
      <Divider />
      {/*drawer element*/}
      <List>
        <ListItem component={Link} to="/Kista" button>
          <ListItemText>
            <Typography variant="body1">Kista</Typography>
          </ListItemText>
        </ListItem>
        <ListItem component={Link} to="/Sodertalje" button>
          <ListItemText>
            <Typography variant="body1">Södertälje</Typography>
          </ListItemText>
        </ListItem>
        <ListItem component={Link} to="/Flemingsberg" button>
          <ListItemText>
            <Typography variant="body1">Flemingsberg</Typography>
          </ListItemText>
        </ListItem>
      </List>
      <Divider />
      {/*dark mode switch*/}
      <Grid justify="center" container>
        <Grid item>
          <Switch
            checkedIcon={<Brightness4Icon style={{ fill: "yellow" }} />}
            color="secondary"
            icon={<Brightness7Icon />}
            size="medium"
            checked={darkMode}
            onChange={(event) => {
              setDarkMode(event.target.checked);
            }}
            name="checked"
          />
        </Grid>
      </Grid>
    </Drawer>
  );
}
