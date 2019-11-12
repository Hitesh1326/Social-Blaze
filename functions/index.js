const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
const {
  getAllPosts,
  createPost,
  getPost,
  postComment,
  likePost,
  unlikePost,
  deletePost,
  deleteComment
} = require("./handlers/posts");
const {
  signUp,
  signIn,
  uploadImage,
  userDetails,
  userData,
  readNotifications,
  singleUserDetail
} = require("./handlers/users");
const firebaseAuth = require("./util/firebaseAuth");

const { db } = require("./util/admin");

//SIGN UP
app.post("/signup", signUp);

//SIGN IN
app.post("/signin", signIn);

//GET ALL THE POSTS
app.get("/posts", getAllPosts);

//GET One post
app.get("/post/:id", getPost);

//CREATE NEW POST
app.post("/createPost", firebaseAuth, createPost);

//POST COMMENT
app.post("/post/:id/comment", firebaseAuth, postComment);

//DELETE POST
app.delete("/post/:id", firebaseAuth, deletePost);

//DELETE COMMENT
app.delete("/comment/:id", firebaseAuth, deleteComment);

//Like a post
app.get("/post/:id/like", firebaseAuth, likePost);

//Unlike a post
app.get("/post/:id/unlike", firebaseAuth, unlikePost);

//UPLOAD IMAGE
app.post("/user/image", firebaseAuth, uploadImage);

//USER DETAILS
app.post("/user", firebaseAuth, userDetails);

//GET User detail publicly
app.get("/user/:handle", singleUserDetail);

//POST read notifications
app.post("/notifications", firebaseAuth, readNotifications);

//ALL USER DATA
app.get("/users", firebaseAuth, userData);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then(doc => {
        // eslint-disable-next-line promise/always-return
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            postId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnLike = functions.firestore
  .document(`likes/{id}`)
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document(`comments/{id}`)
  .onCreate(snapshot => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then(doc => {
        // eslint-disable-next-line promise/always-return
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            postId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions.firestore
  .document(`/users/{userId}`)
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      let batch = db.batch();
      return db
        .collection("posts")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else {
      return true;
    }
  });

exports.onPostDelete = functions.firestore
  .document(`/posts/{postId}`)
  .onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("postId", "==", postId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("postId", "==", postId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("postId", "==", postId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      });
  });
