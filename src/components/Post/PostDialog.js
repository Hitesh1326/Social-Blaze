import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import MyButton from "../../util/myButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { getOnePost, clearErrors } from "../../redux/actions/dataAction";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import CloseIcon from "@material-ui/icons/Close";
import  LikeButton from "../LikeButton/LikeButton";
import ChatIcon from "@material-ui/icons/Chat";
import Comments from "./Comments";
import CreateComment from "./CreateComment";
const styles = theme => ({
  ...theme.styling,

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: "100%",
    objectFit: "cover",
    maxWidth: "100%",
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    left: "90%"
  },
  expandButton: {
    position: "absolute",
    left: "90%"
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50
  }
});

class PostDialog extends Component {
  state = {
    open: false,
    oldPath:'',
    newPath:''
  };

  componentDidMount(){
    if(this.props.openDialog){
      this.handleOpen();
    }
  }
  
  handleOpen = () => {
    let oldPath = window.location.pathname;
    const {userHandle, postId} = this.props;
    const newPath = `/users/${userHandle}/post/${postId}`;

    if(oldPath === newPath){
      oldPath =`/users/${userHandle}`;
    }
    window.history.pushState(null,null,newPath);
    this.setState({ open: true , oldPath, newPath});
    this.props.getOnePost(this.props.postId);
  };

  handleClose = () => {
    window.history.pushState(null,null, this.state.oldPath);
    this.setState({ open: false });
    this.props.clearErrors();
  };
  render() {
    const {
      classes,
      post: {
        postId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments
      },
      UI: { loading }
    } = this.props;

    const dialogContentMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={50} />
      </div>
    ) : (
      <Grid container spacing={4}>
        <Grid item sm={3}>
          <img src={userImage} alt="profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userHandle}`}
          >
            {userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="secondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton postId={postId} />
          <span>{likeCount}</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount}</span>
        </Grid>
        <hr className={classes.visibleSeparator}/>
        <CreateComment postId={postId}/>
        <Comments comments={comments} postId={postId}/>
      </Grid>
    );
    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="More"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            onClick={this.handleClose}
            tip="Close"
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {dialogContentMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}
PostDialog.propTypes = {
  UI: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  getOnePost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI,
  post: state.data.post
});
export default connect(
  mapStateToProps,
  { getOnePost, clearErrors }
)(withStyles(styles)(PostDialog));
