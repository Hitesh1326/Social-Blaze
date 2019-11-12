import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Post from "../components/Post/Post";
import Profile from "../components/Profile/Profile";
import PropTypes from "prop-types";
import PostSkeleton from "../util/PostSkeleton";
import Container from '@material-ui/core/Container';

import { connect } from "react-redux";
import { getPosts } from "../redux/actions/dataAction";


export class home extends Component {

 
  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const {  posts, loading } = this.props.data;

    let post = !loading ? (
      posts.map(post => <Post key={post.postId} post={post} />)
    ) : (
      <PostSkeleton/>
    );
    return (
       <Container maxWidth="md">
      <Grid container spacing={5} >
        <Grid item sm={8} xs={12}>
          {post}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
      </Container>
    );
  }
}
home.propTypes = {
  data: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getPosts }
)(home);
