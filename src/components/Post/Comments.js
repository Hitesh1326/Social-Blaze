import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import dayjs from "dayjs";
import { connect } from "react-redux";
import DeleteComment from "../Post/DeleteComment";

const styles = theme => ({
  ...theme.styling,
  commentImage: {
    width: 60,
    height: 60,
    borderRadius: "100%",
    objectFit: "cover",
    maxWidth: "100%",
    margin: "20px 1px 20px 20px"
  },
  commentData: {
    marginLeft: 20
  }
});

export class Comments extends Component {
  render() {
    const {
      comments,
      classes,
      user: {
        authenticated,
        credentials: { handle }
      },
      postId
    } = this.props;

    const comm = comments.map((comment, index) => {
      const { body, createdAt, userImage, userHandle, commentId } = comment;
      return (
        <Fragment key={createdAt}>
          <Grid item sm={12}>
            <Grid container>
              <Grid item sm={2}>
                <img
                  src={userImage}
                  alt="comment"
                  className={classes.commentImage}
                />
              </Grid>
              <Grid item sm={9}>
                <div className={classes.commentData}>
                  <Typography
                    variant="h5"
                    color="primary"
                  >
                    {userHandle}{" "}
                    {authenticated && userHandle === handle ? (
                      <DeleteComment postId={postId} commentId={commentId} />
                    ) : null}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                  </Typography>
                  <hr className={classes.invisibleSeparator} />
                  <Typography variant="body1">{body}</Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
          {index !== comments.length - 1 && (
            <hr className={classes.visibleSeparator} />
          )}
        </Fragment>
      );
    });
    return <Grid container>{comm}</Grid>;
  }
}
Comments.propTypes = {
  user: PropTypes.object.isRequired,
  comments: PropTypes.array,
  postId: PropTypes.string,
};
const mapStateToProps = state => ({
  user: state.user,
});
export default connect(mapStateToProps)(withStyles(styles)(Comments));
