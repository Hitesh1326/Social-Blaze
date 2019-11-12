import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { createComment } from "../../redux/actions/dataAction";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  ...theme.styling
});

export class CreateComment extends Component {
  state = {
    body: "",
    errors: {}
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "" });
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.createComment(this.props.postId, { body: this.state.body });
  };
  render() {
    const {
      classes,
      authenticated,
      UI: { loading }
    } = this.props;
    const errors = this.state.errors;
    const commentForm = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
          autoComplete="off"
            name="body"
            type="text"
            label="Comment on post"
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
            Comment
            {loading && (
                <CircularProgress size={30} className={classes.spinner} />
              )}
          </Button>
        </form>
        <hr className={classes.visibleSeparator} />
      </Grid>
    ) : null;
    return commentForm;
  }
}
CreateComment.propTypes = {
  classes: PropTypes.object.isRequired,
  createComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});
export default connect(
  mapStateToProps,
  { createComment }
)(withStyles(styles)(CreateComment));
