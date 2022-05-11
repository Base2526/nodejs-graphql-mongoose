import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import moment from "moment";
import { CircularProgress } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from "axios";
import ls from "local-storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

import LoginDialog from "./LoginDialog";
import { isEmpty, commaFormatted } from "../utils";
import ReportDialog from "./ReportDialog";

import { onMyFollow } from "../actions/my_follows";
import { addFollowData } from "../actions/user";
import { updateAppFollower } from "../actions/app";

import { socketIO } from "../SocketioClient";
import history from "../history";

import Comment from "../comments/Comment";

var _ = require("lodash");

const DetailPage = (props) => {
  const history = useHistory();

  const [item, setItem] = useState(null);
  const [nid, setNid] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalReport, setShowModalReport] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const [isPaneOpen, setIsPaneOpen] = useState(false);

  useEffect(async () => {
    let socket = await socketIO(props);

    // console.log("props.data ? 0000 ", props.data, props.match);

    socket.on(`content-${props.match.params._id}`, sycContent);

    // if (_.isEmpty(props.location.state)) {
    //   fetch();
    // } else {
    //   setItem(props.location.state.item);
    // }
    fetch();

    return () => {
      socket.removeAllListeners(`content-${props.match.params._id}`);
    };
  }, []);

  useEffect(async () => {
    window.scrollTo(0, 0);
  }, [props.match.params._id]);

  /*
  useEffect(async () => {
    console.log(
      "props.data ? ",
      props,
      props.data,
      props.match,
      props.match.params._id
    );

    let item = _.find(props.data, (o) => {
      return _.isEqual(o._id, props.match.params._id);
    });

    console.log("props.data ? #1 ", item);
    if (!_.isEmpty(item)) {
      setItem(item);
    }
  }, [props.data]);
  */

  const fetch = async () => {
    try {
      let { state } = props.location;

      let _id = parseInt(props.match.params._id);

      console.log("state >>", state, props.match.params._id);

      let item = _.find(props.data, (o) => o._id === _id);
      console.log("item :", item);
      // if (!_.isEmpty(item)) {
      //   console.log("#1");
      //   setItem(item);
      // } else {
      console.log("#1");
      let response = await axios.post(
        `/v1/search`,
        {
          type: 2,
          key_word: props.match.params._id,
          offset: 0,
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
      console.log("/v1/search : response =", response, props.match.params._id);
      if (response.result) {
        let { datas } = response;
        console.log("/v1/search : response > datas =", datas);
        if (!isEmpty(datas)) {
          if (_.isEmpty(datas[0])) {
            history.push("/");
            return;
          }

          setItem(datas[0]);
        }
      }
      // }
    } catch (err) {
      console.log(err.message);

      history.push("/");
    }
  };

  const sycContent = (i) => {
    console.log("sycContent :", i);
    switch (i.type) {
      case "contents": {
        // console.log("contents : ", i);
        switch (i.operation_type) {
          case "insert":
          case "update":
          case "replace": {
            setItem(i.datas);
            break;
          }
        }

        break;
      }
      case "follows": {
        let datas = i.datas;
        //   console.log('sycContent > follows :', datas)
        // updateAppFollower
        props.updateAppFollower(datas);
        break;
      }
    }
  };

  const resetScroll = () => {
    // if(nid !== prevNid){
    //     window.scrollTo(0, 0)
    // }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const count_app_followers = () => {
  //   let count = _.filter(item.app_followers, (o) => {
  //     return o.status;
  //   }).length;
  //   if (
  //     !_.isEmpty(_.find(props.follows, (o) => o._id === item._id && o.status))
  //   ) {
  //     return count + 1;
  //   }

  //   if (count > 0) {
  //     return count;
  //   }

  //   return "";
  // };

  const count_app_followers = () => {
    if (_.isEmpty(item)) {
      return;
    }

    if (_.has(item, "followers")) {
      return _.filter(item.followers, (item) => item.status).length == 0
        ? ""
        : _.filter(item.followers, (item) => item.status).length;
    }
    return "";
  };

  const isFollows = () => {
    if (!_.isEmpty(props.user)) {
      if (!_.isEmpty(props.follows)) {
        let follow = props.follows.find((o) => o._id === item._id);
        if (!_.isEmpty(follow)) {
          return follow.status ? "red" : "gray";
        }
      }
    }
    return "gray";
  };

  const countComment = () => {
    if (_.has(item, "comments")) {
      let count = 0;
      _.map(item.comments, (o) => {
        if (!_.isEmpty(o.replies)) {
          count += o.replies.length;
        }
      });

      return item.comments.length + count;
    }
    return "";
  };

  return (
    <div>
      {showModalReport && (
        <ReportDialog
          showModal={showModalReport}
          onClose={() => {
            setShowModalReport(false);
          }}
        />
      )}
      {_.isEmpty(item) ? (
        <div>
          {" "}
          <CircularProgress />{" "}
        </div>
      ) : (
        <div>
          <div>
            <div>ชื่อ-นามสกุล :</div>
            <div>{item.name_surname}</div>
          </div>
          <div>
            <div>ชื่อเรื่อง :</div>
            <div>{item.title}</div>
          </div>
          <div>
            <div>ยอดเงิน :</div>
            <div>{item.transfer_amount}</div>
          </div>
          <div>
            <div>
              วันโอนเงิน:{" "}
              {moment.unix(item.transfer_date / 1000).format("MMM DD, YYYY")}
            </div>
          </div>

          <div>
            <div>รายละเอียดเพิ่มเติม :</div>
            <div>{item.detail}</div>
          </div>
          <div>
            <VerifiedUserOutlinedIcon
              style={{ cursor: "pointer", fill: isFollows() }}
              onClick={() => {
                if (_.isEmpty(props.user)) {
                  setShowModalLogin(true);
                } else {
                  // let follow = props.follows.find((o) => o._id === item._id);
                  // let status = true;
                  // if (!_.isEmpty(follow)) {
                  //   status = !follow.status;
                  // }
                  // props.addFollowData({ _id: item._id, status, local: true });

                  let status = true;
                  if (!_.isEmpty(props.follows)) {
                    let follow = props.follows.find((o) => o._id === item._id);

                    if (!_.isEmpty(follow)) {
                      status = !follow.status;
                    }
                  }
                  props.addFollowData({ _id: item._id, status, local: true });

                  // followers

                  let new_item = {};
                  if (_.has(item, "followers")) {
                    let new_followers = _.map(item.followers, (i, j) => {
                      if (i.uid == props.user._id) {
                        i.status = status;
                      }
                      return i;
                    });

                    new_item = {
                      ...item,
                      followers: new_followers,
                    };
                  } else {
                    new_item = {
                      ...item,
                      followers: [{ status: true, uid: props.user._id }],
                    };
                  }

                  setItem(new_item);
                }
              }}
            />

            <div>
              {" "}
              <FontAwesomeIcon
                icon={faComment}
                className="m-1"
                onClick={() => {
                  setIsPaneOpen(true);
                }}
              ></FontAwesomeIcon>{" "}
              {countComment()}
            </div>
            <MoreVertOutlinedIcon
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
              }}
            />
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                props.history.push({
                  pathname: `/my-follower/${item._id}`,
                  key: item._id,
                  state: { item },
                });
              }}
            >
              {count_app_followers()} follower
            </div>
          </div>
          <div className="row d-flex flex-row py-5">
            {!_.isEmpty(item.images) &&
              item.images.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{ margin: 10, cursor: "pointer" }}
                    onClick={() => {
                      setIsOpen(true);
                      setPhotoIndex(index);
                    }}
                  >
                    <LazyLoadImage
                      className="lazy-load-image"
                      alt={"image.alt"}
                      width="250px"
                      height="250px"
                      effect="blur"
                      // placeholderSrc={'<div className="abc">' + previewIcon + '<div>'}
                      placeholder={
                        <div style={{ textAlign: "center" }}>
                          <p>loading...</p>
                        </div>
                      }
                      // src={item.url}
                      src={process.env.REACT_APP_URL_SERVER + item.path}
                    />
                  </div>
                );

                //
              })}
          </div>
          {isOpen && !_.isEmpty(item.images) && (
            <Lightbox
              /*
              mainSrc={item.images[0][photoIndex].url}
              nextSrc={
                item.images[0][(photoIndex + 1) % item.images[0].length].url
              }
              prevSrc={
                item.images[0][
                  (photoIndex + item.images[0].length - 1) %
                    item.images[0].length
                ].url
              }

              // src={process.env.REACT_APP_URL_SERVER + item.path}

              */
              mainSrc={
                process.env.REACT_APP_URL_SERVER + item.images[photoIndex].path
              }
              nextSrc={
                process.env.REACT_APP_URL_SERVER +
                item.images[(photoIndex + 1) % item.images.length].path
              }
              prevSrc={
                process.env.REACT_APP_URL_SERVER +
                item.images[
                  (photoIndex + item.images.length - 1) % item.images.length
                ].path
              }
              imageTitle={photoIndex + 1 + "/" + item.images.length}
              // mainSrcThumbnail={images[photoIndex]}
              // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
              // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

              onCloseRequest={() => setIsOpen(false)}
              onMovePrevRequest={() =>
                // this.setState({
                //     photoIndex: (photoIndex + images.length - 1) % images.length
                // })
                setPhotoIndex(
                  (photoIndex + item.images.length - 1) % item.images.length
                )
              }
              onMoveNextRequest={() =>
                // this.setState({
                //     photoIndex: (photoIndex + 1) % images.length
                // })
                setPhotoIndex((photoIndex + 1) % item.images.length)
              }
            />
          )}
          <Menu
            keepMounted
            anchorEl={anchorEl}
            onClose={handleClose}
            open={Boolean(anchorEl)}
          >
            <CopyToClipboard text={process.env.REACT_APP_URL_SERVER + item._id}>
              <MenuItem
                onClick={() => {
                  toast.info("Link to post copied to clipboard.", {
                    position: "bottom-right",
                    hideProgressBar: true,
                    autoClose: 1000,
                  });

                  handleClose();
                }}
              >
                Copy link
              </MenuItem>
            </CopyToClipboard>
            <MenuItem
              onClick={() => {
                if (_.isEmpty(props.user)) {
                  setShowModalLogin(true);
                } else {
                  setShowModalReport(true);
                }

                handleClose();
              }}
            >
              Report
            </MenuItem>
          </Menu>

          {isPaneOpen && (
            <Comment
              commentNid={_.isEmpty(item) ? "" : item._id}
              isPaneOpen={isPaneOpen}
              comments={_.isEmpty(item) ? [] : item.comments}
              onClose={() => {
                setIsPaneOpen(false);
              }}
              onComment={(data) => {
                // setCurrentDatas(
                //   _.map(currentDatas, (im, ik) => {
                //     if (im._id == data._id) {
                //       if (!_.isEqual(im.comments, data.comments)) {
                //         im = { ...im, comments: data.comments };
                //       }
                //     }

                //     return im;
                //   })
                // );

                setItem({ ...item, comments: data.comments });
              }}
            />
          )}
          {showModalLogin && (
            <LoginDialog
              showModal={showModalLogin}
              onClose={() => {
                setShowModalLogin(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  console.log("state >> ", state);
  return {
    user: state.user.data,
    data: state.app.data,
    my_follows: state.my_follows.data,

    follows: state.user.follows,
  };
};

const mapDispatchToProps = {
  // fetchData,
  onMyFollow,
  addFollowData,
  updateAppFollower,
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPage);
