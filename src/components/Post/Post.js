import React, { Component } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MyButton from "../../util/myButton";
import ChatIcon from "@material-ui/icons/Chat";
import LikeButton from "../LikeButton/LikeButton";
import DeletePost from "./DeletePost";
import PostDialog from "./PostDialog";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,

  },
  image: {
    width: 100,
    height: 100,
    borderRadius: "100%",
    objectFit: "cover",
    maxWidth: "100%",
    margin: "20px 1px 20px 20px"
  },
  content: {
    padding: 15,
    objectFit: "cover"
  },
  textBold:{
    fontWeight: "bold"
  },
bodyText:{
  marginTop: 10
},


};
export class Post extends Component {
  render() {
    dayjs.extend(relativeTime);
    //destructuring this.props.classes
    const {
      classes,
      post: {
        body,
        createdAt,
        userImage,
        userHandle,
        postId,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeletePost postId={postId} />
      ) : null;

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="Profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h6"
            className={classes.textBold}
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary" >
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography className={classes.bodyText} variant="body1">{body}</Typography>
        
          <LikeButton postId={postId} />
          <span>{likeCount}</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount}</span>
        
          <PostDialog
            postId={postId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}

Post.propTypes = {
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.user,
  data: state.data
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
