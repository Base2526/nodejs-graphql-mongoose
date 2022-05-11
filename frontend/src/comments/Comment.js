import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

import axios from "axios";
import ls from "local-storage";

import data from "./data.json";
import CommentSection from "./CommentSection";

import "./style.css";

import { addComment } from "../actions/app";

var _ = require("lodash");

const Comment = (props) => {
  // const [comment, setComment] = useState(data);
  const [comment, setComment] = useState([]);
  // const userId = "02a";
  // const avatarUrl = "https://ui-avatars.com/api/name=Adam&background=random";
  // const name = "Adam Scott";
  // const signinUrl = "/signin";
  // const signupUrl = "/signup";

  const [userId, setUserId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [name, setName] = useState("");
  const [signinUrl, setSigninUrl] = useState("/signin");
  const [signupUrl, setSignupUrl] = useState("/signup");

  // let count = 0;
  // comment.map((i) => {
  //   count += 1;
  //   i.replies && i.replies.map((i) => (count += 1));
  // });

  useEffect(() => {
    console.log("Comment :", props);

    setUserId(props.user._id);
    setAvatarUrl(
      _.isEmpty(props.user.images)
        ? ""
        : process.env.REACT_APP_URL_SERVER + props.user.images.path
    );
    setName(props.user.display_name);
  }, []);

  useEffect(async () => {
    console.log("props.data.comments  #1: ", props.comments);

    if (_.isEmpty(props.comments)) {
      return;
    }

    setComment(props.comments);
  }, [props.comments]);

  return (
    <SlidingPane
      // hideHeader={true}
      closeIcon={<div>X</div>}
      className="some-custom-class"
      overlayClassName="some-custom-overlay-class"
      isOpen={props.isPaneOpen}
      // title="Hey, it is optional pane title.  I can be React component too."
      // subtitle="Optional subtitle."
      width={"400px"}
      onRequestClose={() => {
        // triggered on "<" on left top click or on outside click
        props.onClose(false);
      }}
    >
      <CommentSection
        currentUser={
          userId && { userId: userId, avatarUrl: avatarUrl, name: name }
        }
        commentsArray={comment}
        // setComment={setComment}
        setComment={async (comments) => {
          console.log("setComment :", comments);

          let response = await axios.post(
            `/v1/comment`,
            {
              _id: props.commentNid,
              comments,
            },
            {
              headers: {
                Authorization: _.isEmpty(ls.get("basic_auth"))
                  ? `Basic ${process.env.REACT_APP_AUTHORIZATION}`
                  : ls.get("basic_auth"),
              },
            }
          );

          response = response.data;
          console.log("/v1/comment : response =", response);
          if (response.result) {
            // update content comment in redux

            props.onComment({
              _id: props.commentNid,
              comments,
            });
          }
        }}
        signinUrl={signinUrl}
        signupUrl={signupUrl}
        // customInput={customInputFunc}
      />
    </SlidingPane>
  );
};

const mapStateToProps = (state, ownProps) => {
  let commentNid = ownProps.commentNid;

  let data = _.find(state.app.comments, (o) => {
    return o._id == commentNid;
  });

  console.log("Comment >>>> ", state.app, commentNid, data);
  return {
    user: _.find(state.friends.data, (i, j) => {
      return i._id == state.user.data._id;
    }),
    // comments: _.isEmpty(data) ? [] : data.comments,
  };
};

const mapDispatchToProps = {
  addComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
