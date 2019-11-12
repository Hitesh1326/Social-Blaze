import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";

import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";

import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MyButton from "../util/myButton";
import HomeIcon from "@material-ui/icons/Home";
import CreatePost from "../components/Post/CreatePost";
import Notification from "../components/Navbar/Notification";

const drawerWidth = 210;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    backgroundColor:"#212121",
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#424242"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  buttons:{
    color: "white"
  }
}));

function ResponsiveDrawer(props) {
  const { authenticated } = props;

  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Toolbar className="nav-container">
        {authenticated ? (
          <List component="nav">
            <ListItem>
              <CreatePost />
              <ListItemText className={classes.buttons} primary="Create Post" />
            </ListItem>
            <ListItem>
              <Link to="/">
                <MyButton tip="">
                  <HomeIcon className={classes.buttons} />
                </MyButton>
              </Link>
              <ListItemText className={classes.buttons} primary="Home" />
            </ListItem>
            <ListItem>
              <Notification />
              <ListItemText className={classes.buttons} primary="Notifications" />
            </ListItem>
          </List>
        ) : (
          <List component="nav">
            <ListItem>
              <Button className={classes.buttons} component={Link} to="/login">
                Login
              </Button>
            </ListItem>
            <ListItem>
              <Button className={classes.buttons} component={Link} to="/">
                Home
              </Button>
            </ListItem>
            <ListItem>
              <Button className={classes.buttons} component={Link} to="/signup">
                Signup
              </Button>
            </ListItem>
          </List>
        )}
      </Toolbar>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Social Blaze
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(ResponsiveDrawer);
