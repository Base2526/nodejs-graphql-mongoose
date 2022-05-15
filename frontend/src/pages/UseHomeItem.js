import React, { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LazyLoadImage } from "react-lazy-load-image-component";
// import ReactReadMoreReadLess from "react-read-more-read-less";
import moment from "moment";
import axios from "axios";
import ls from "local-storage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faCheckSquare,
  faUserPlus,
  faCommentAlt,
  faComment,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import parse from "html-react-parser";

import ReportDialog from "./ReportDialog";
import { isEmpty, commaFormatted, ReadMore } from "../utils";

import preview from "../images/person_110935.png";

import { socketIO } from "../SocketioClient";

// import song from "./mixkit-slot-machine-win-1928.wav";

var _ = require("lodash");

let { REACT_APP_AUTHORIZATION, REACT_APP_AXIOS_TIMEOUT } = process.env;

const UseHomeItem = (props) => {
  const [item, setItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [followUp, setFollowUp] = useState(false);

  const [showModalReport, setShowModalReport] = useState(false);

  useEffect(() => {
    return () => {
      setItem({});
      setAnchorEl(null);
      setIsOpen(false);
      setPhotoIndex();
      setFollowUp();
      setShowModalReport();
    };
  }, []);

  useEffect(async () => {
    setItem(props.item);

    console.log("props : ", props);

    let friends = props.friends;

    // console.log("ABC : ", item, item.owner_id, props, friends);

    let friend = _.find(friends, (im) => im._id === props.item.owner_id);
    console.log("friend >>> : ", friend, friends, props.item);

    if (_.isEmpty(friend)) {
      try {
        let response = await axios.post(
          `/v1/friend`,
          {
            _id: props.item.owner_id,
          },
          { timeout: REACT_APP_AXIOS_TIMEOUT },
          {
            headers: {
              Authorization: _.isEmpty(ls.get("basic_auth"))
                ? `Basic ${REACT_APP_AUTHORIZATION}`
                : ls.get("basic_auth"),
            },
          }
        );

        response = response.data;
        console.log("friend response :::", response);
        if (response.result) {
          props.addFriend([response.data]);
        }

        // addFriend
      } catch (e) {
        console.log("Error", e.message);
      }
    }

    return () => {
      setItem({});
    };
  }, [props.item]);

  useEffect(() => {
    if (!_.isEmpty(props.follows)) {
      setFollowUp(
        _.isEmpty(
          props.follows.find((el) => el._id === parseInt(item._id) && el.status)
        )
          ? false
          : true
      );
    }
  }, [props.follows]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    console.log(typeof event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const itemView = () => {
    // console.log('itemView :', item)

    if (Object.keys(item).length === 0) {
      return <div />;
    }

    if (isEmpty(item.images)) {
      return <div />;
    }

    let thumbnail = item.images[0];
    let medium = item.images[1];

    // thumbnail = [{url:'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.6435-9/215541769_468809007538018_7514224006994884957_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_eui2=AeFpOyNqlQtdgtwQ8dNA_0sYjbI7gtXtJNaNsjuC1e0k1pVNF88_vEsFfEh6D5g2kkzCX0OZ2RUBIRsOcnB8BWWs&_nc_ohc=IAIr6v2N5woAX91kaO2&_nc_ht=scontent.fbkk5-1.fna&oh=f74a0901be43ddb1f0f66c6ab5307722&oe=60EDC748'}]
    // medium = [{url:'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.6435-9/215541769_468809007538018_7514224006994884957_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_eui2=AeFpOyNqlQtdgtwQ8dNA_0sYjbI7gtXtJNaNsjuC1e0k1pVNF88_vEsFfEh6D5g2kkzCX0OZ2RUBIRsOcnB8BWWs&_nc_ohc=IAIr6v2N5woAX91kaO2&_nc_ht=scontent.fbkk5-1.fna&oh=f74a0901be43ddb1f0f66c6ab5307722&oe=60EDC748'}]

    switch (thumbnail.length) {
      case 0: {
        return <div />;
      }
      case 1: {
        return (
          <div key={item._id}>
            <div className="hi-container">
              <div className="hi-sub-container1">
                <div
                  className="hi-item1"
                  onClick={() => {
                    setIsOpen(true);
                    setPhotoIndex(0);
                  }}
                >
                  <LazyLoadImage
                    alt={"image.alt"}
                    width="100%"
                    height="100px"
                    effect="blur"
                    src={thumbnail[0].url}
                  />
                </div>
              </div>
            </div>
            {isOpen && (
              <Lightbox
                mainSrc={medium[photoIndex].url}
                nextSrc={medium[(photoIndex + 1) % medium.length].url}
                prevSrc={
                  medium[(photoIndex + medium.length - 1) % medium.length].url
                }
                imageTitle={photoIndex + 1 + "/" + medium.length}
                // mainSrcThumbnail={images[photoIndex]}
                // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

                onCloseRequest={() => setIsOpen(false)}
                onMovePrevRequest={() =>
                  // this.setState({
                  //     photoIndex: (photoIndex + images.length - 1) % images.length
                  // })
                  setPhotoIndex(
                    (photoIndex + medium.length - 1) % medium.length
                  )
                }
                onMoveNextRequest={() =>
                  // this.setState({
                  //     photoIndex: (photoIndex + 1) % images.length
                  // })
                  setPhotoIndex((photoIndex + 1) % medium.length)
                }
              />
            )}
          </div>
        );
      }

      case 2: {
        return (
          <div key={item._id}>
            <div className="hi-container">
              <div className="hi-sub-container1">
                <div
                  className="hi-item1"
                  onClick={() => {
                    setIsOpen(true);
                    setPhotoIndex(0);
                  }}
                >
                  <LazyLoadImage
                    alt={"image.alt"}
                    width="100%"
                    height="100px"
                    effect="blur"
                    src={thumbnail[0].url}
                  />
                </div>
                <div
                  className="hi-item2"
                  onClick={() => {
                    setIsOpen(true);
                    setPhotoIndex(1);
                  }}
                >
                  <LazyLoadImage
                    alt={"image.alt"}
                    width="100%"
                    height="100px"
                    effect="blur"
                    src={thumbnail[1].url}
                  />
                </div>
              </div>
            </div>

            {isOpen && (
              <Lightbox
                mainSrc={medium[photoIndex].url}
                nextSrc={medium[(photoIndex + 1) % medium.length].url}
                prevSrc={
                  medium[(photoIndex + medium.length - 1) % medium.length].url
                }
                imageTitle={photoIndex + 1 + "/" + medium.length}
                // mainSrcThumbnail={images[photoIndex]}
                // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

                onCloseRequest={() => setIsOpen(false)}
                onMovePrevRequest={() =>
                  // this.setState({
                  //     photoIndex: (photoIndex + images.length - 1) % images.length
                  // })
                  setPhotoIndex(
                    (photoIndex + medium.length - 1) % medium.length
                  )
                }
                onMoveNextRequest={() =>
                  // this.setState({
                  //     photoIndex: (photoIndex + 1) % images.length
                  // })
                  setPhotoIndex((photoIndex + 1) % medium.length)
                }
              />
            )}
          </div>
        );
      }

      case 3: {
        return (
          <div key={item._id}>
            <div className="hi-container">
              <div className="hi-sub-container1">
                <div
                  className="hi-item1"
                  onClick={() => {
                    setIsOpen(true);
                    setPhotoIndex(0);
                  }}
                >
                  <LazyLoadImage
                    alt={"image.alt"}
                    width="100%"
                    height="100px"
                    effect="blur"
                    src={thumbnail[0].url}
                  />
                </div>
                <div
                  className="hi-item2"
                  onClick={() => {
                    setIsOpen(true);
                    setPhotoIndex(1);
                  }}
                >
                  <LazyLoadImage
                    alt={"image.alt"}
                    width="100%"
                    height="100px"
                    effect="blur"
                    src={thumbnail[1].url}
                  />
                </div>
              </div>
              <div className="hi-sub-container2">
                <div
                  className="hi-item3"
                  onClick={() => {
                    setIsOpen(true);
                    setPhotoIndex(2);
                  }}
                >
                  <LazyLoadImage
                    alt={"image.alt"}
                    width="100%"
                    height="100px"
                    effect="blur"
                    src={thumbnail[2].url}
                  />
                </div>
              </div>
            </div>

            {isOpen && (
              <Lightbox
                mainSrc={medium[photoIndex].url}
                nextSrc={medium[(photoIndex + 1) % medium.length].url}
                prevSrc={
                  medium[(photoIndex + medium.length - 1) % medium.length].url
                }
                imageTitle={photoIndex + 1 + "/" + medium.length}
                // mainSrcThumbnail={images[photoIndex]}
                // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

                onCloseRequest={() => setIsOpen(false)}
                onMovePrevRequest={() =>
                  // this.setState({
                  //     photoIndex: (photoIndex + images.length - 1) % images.length
                  // })
                  setPhotoIndex(
                    (photoIndex + medium.length - 1) % medium.length
                  )
                }
                onMoveNextRequest={() =>
                  // this.setState({
                  //     photoIndex: (photoIndex + 1) % images.length
                  // })
                  setPhotoIndex((photoIndex + 1) % medium.length)
                }
              />
            )}
          </div>
        );
      }

      default: {
        return (
          <div key={item._id}>
            <div className="hi-container">
              <div className="hi-sub-container1">
                <div
                  className="hi-item1"
                  onClick={() => {
                    setIsOpen(true);
                    setPhotoIndex(0);
                  }}
                >
                  <LazyLoadImage
                    alt={"image.alt"}
                    width="100%"
                    height="100px"
                    effect="blur"
                    src={thumbnail[0].url}
                  />
                </div>
                <div
                  className="hi-item2"
                  onClick={() => {
                    setIsOpen(true);
                    setPhotoIndex(1);
                  }}
                >
                  <LazyLoadImage
                    alt={"image.alt"}
                    width="100%"
                    height="100px"
                    effect="blur"
                    src={thumbnail[1].url}
                  />
                </div>
              </div>
              <div className="hi-sub-container2">
                <div
                  className="hi-item3"
                  onClick={() => {
                    setIsOpen(true);
                    setPhotoIndex(2);
                  }}
                >
                  <LazyLoadImage
                    alt={"image.alt"}
                    width="100%"
                    height="100px"
                    effect="blur"
                    src={thumbnail[2].url}
                  />
                </div>
              </div>
            </div>

            {isOpen && (
              <Lightbox
                mainSrc={medium[photoIndex].url}
                nextSrc={medium[(photoIndex + 1) % medium.length].url}
                prevSrc={
                  medium[(photoIndex + medium.length - 1) % medium.length].url
                }
                imageTitle={photoIndex + 1 + "/" + medium.length}
                // mainSrcThumbnail={images[photoIndex]}
                // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

                onCloseRequest={() => setIsOpen(false)}
                onMovePrevRequest={() =>
                  // this.setState({
                  //     photoIndex: (photoIndex + images.length - 1) % images.length
                  // })
                  setPhotoIndex(
                    (photoIndex + medium.length - 1) % medium.length
                  )
                }
                onMoveNextRequest={() =>
                  // this.setState({
                  //     photoIndex: (photoIndex + 1) % images.length
                  // })
                  setPhotoIndex((photoIndex + 1) % medium.length)
                }
              />
            )}
          </div>
        );
      }
    }
  };

  const menu = () => {
    return (
      <Menu
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        <CopyToClipboard text={window.location.origin + "/detail/" + item._id}>
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
            if (isEmpty(props.user)) {
              props.updateState({ showModalLogin: true });
            } else {
              // props.updateState({showModalReport: true})

              setShowModalReport(true);
            }

            handleClose();
          }}
        >
          Report
        </MenuItem>
      </Menu>
    );
  };

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
      // return (props.follows.find((el)=>el.nid === parseInt(item.nid) && el.status)) ? "gray" : "red"

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

  const embedResponsive = () => {
    if (_.isEmpty(item)) {
      return <div />;
    }

    console.log("embedResponsive : ", item)

    let thumbnail = item.files;
    let medium = item.files;

    if (_.isEmpty(thumbnail)) {
      return <div />;
    }

    console.log("thumbnail :", thumbnail);
    return (
      <div>
        <div
          className="hi-item1"
          onClick={() => {
            setIsOpen(true);
            setPhotoIndex(0);
          }}
        >
          <img
            className="embed-responsive-item"
            src={thumbnail[0].base64}
            alt="thumbnail"
          />
        </div>

        {isOpen && (
          <Lightbox
            // mainSrc={medium[photoIndex].url}
            // nextSrc={medium[(photoIndex + 1) % medium.length].url}
            // prevSrc={
            //   medium[(photoIndex + medium.length - 1) % medium.length].url
            // }

            mainSrc={medium[photoIndex].base64}
            nextSrc={
              medium[(photoIndex + 1) % medium.length].base64
            }
            prevSrc={
              medium[(photoIndex + medium.length - 1) % medium.length].base64
            }
            imageTitle={photoIndex + 1 + "/" + medium.length}
            // mainSrcThumbnail={images[photoIndex]}
            // nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
            // prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}

            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              // this.setState({
              //     photoIndex: (photoIndex + images.length - 1) % images.length
              // })
              setPhotoIndex((photoIndex + medium.length - 1) % medium.length)
            }
            onMoveNextRequest={() =>
              // this.setState({
              //     photoIndex: (photoIndex + 1) % images.length
              // })
              setPhotoIndex((photoIndex + 1) % medium.length)
            }
          />
        )}
      </div>
    );
  };

  const profile_owner = (item) => {
    let friend = _.find(props.friends, (i) => i._id == item.owner_id);

    console.log("profile_owner : ", friend);
    if (!_.isEmpty(friend)) {
      return (
        <div>
          <div
            onClick={(e) => {
              //

              console.log("user : ", props.user._id, _.isEqul);

              if (_.isEqual(props.user._id, friend._id)) {
                props.history.push({ pathname: `/my-profile`, state: {} });
              } else {
                props.history.push({
                  pathname: `/profile/${friend._id}`,
                });
              }
            }}
          >
            <div>
              <img
                src={
                  _.isEmpty(friend.images)
                    ? preview
                    : process.env.REACT_APP_URL_SERVER + friend.images.path
                }
                width={"45px"}
                height={"45px"}
                className="img-user"
              />
            </div>
            {friend.display_name}
          </div>
          <div>
            {/* {moment(parseInt(item.created)).format("MMM DD YYYY , h:mm:ss a")} */}
            Post :
            {moment.unix(item.created / 1000).format("MMM DD, YYYY h:mm:ss a")}
          </div>
        </div>
      );
    }

    return <div>-</div>;
  };
  return (
    <div className=" col-sm-6 col-lg-4 col-xl-3 ">
      <div className="card mb-3">
        {profile_owner(item)}
        <div className="embed-responsive embed-responsive-1by1">
          {/* <img
          className="embed-responsive-item"
          src="https://wallpapercave.com/wp/wp4587054.jpg"
          alt="thumbnail"
        /> */}
          {embedResponsive()}
        </div>
        <div className="card-body p-0">
          <div
            className="card-text px-2 py-2"
            onClick={() => {
              props.history.push({
                pathname: `/detail/${item._id}`,
                key: item._id,
                state: { item },
              });
            }}
          >
            <div className="d-flex subtexts ">
              <span className="title">ชื่อ-นามสกุล :</span>
              <span className="des-text">
                {_.isEmpty(item.nameSubname) ? "" : item.nameSubname}
              </span>
            </div>
            <div className="d-flex subtexts">
              <span className="title">ชื่อเรื่อง :</span>
              <span className="des-text">
                {_.isEmpty(item.title) ? "" : item.title}
              </span>
            </div>
            <div className="d-flex subtexts">
              <span className="title">ยอดเงิน :</span>
              <span className="des-text">
                {/* {!isEmpty(item.transfer_amount)
                  ? commaFormatted(item.transfer_amount)
                  : item.transfer_amount} */}
                {item.transfer_amount}
              </span>
            </div>
            <div className="d-flex subtexts">
              <span className="title">วันที่โอนเงิน :</span>
              <span className="des-text">
                {/* {moment(item.transfer_date).format("MMM DD, YYYY")} */}
                {/* {moment.unix(item.dateTranfer / 1000).format("MMM DD, YYYY")} */}
                {/* {item.transfer_date} */}
                { moment(item.dateTranfer).format('MMMM Do YYYY') } 
              </span>
            </div>

            <div className=" subtexts">
              <span className="title w-100 d-block">รายละเอียด :</span>
              <span className="des-text my-1 d-inline-block">
                
                <div dangerouslySetInnerHTML={{__html: _.isEmpty(item.body) ? "" : item.body }} />
              </span>
            </div>
          </div>
          <div className="hz-line"></div>
          <div className="card-text -foot d-flex align-items-center py-2 px-2 justify-content-between">
            <p
              className="m-0 tex-follow"
              onClick={async() => {
                // console.log("item :", item, props);
                // props.history.push({
                //   pathname: `/follower/${item._id}`,
                //   key: item._id,
                //   state: { item },
                // });

                
                let soc = await socketIO()

                // soc.emit('follow', (error, message)=>{
                //   console.log('testing', error, message);
                // })

                soc.emit('follow', {test: "1234"}, (values)=>{
                  // console.log(error);
                  console.log(values);
                });
                // console.log("soc :", soc)
                // props.onOpenModalFollwers({ is_open: true, item });
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
              Followers
              <span> {count_app_followers()}</span>
            </p>
            <div
              onClick={() => {
                props.onComment({ _id: item._id });
              }}
            >
              <FontAwesomeIcon icon={faComment} className="m-1" />
              {countComment()}
            </div>
            <button className="btn bg-primary text-white">
              {/* isFollows() */}
              <FontAwesomeIcon
                icon={faCheckSquare}
                className="m-1"
                color={isFollows()}
                onClick={(e) => {
                  if (_.isEmpty(props.user)) {
                    props.updateState({ showModalLogin: true });
                  } else {
                    let status = true;
                    if (!_.isEmpty(props.follows)) {
                      let follow = props.follows.find(
                        (o) => o._id === item._id
                      );

                      if (!_.isEmpty(follow)) {
                        status = !follow.status;
                      }
                    }

                    // console.log(">> follower : ", {
                    //   _id: item._id,
                    //   status,
                    //   local: true,
                    // });

                    props.addFollowData({ _id: item._id, status, local: true });
                  }
                }}
              />
              <FontAwesomeIcon
                icon={faEllipsisV}
                onClick={(e) => handleClick(e)}
                className="m-1"
              />
            </button>

            {menu()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseHomeItem;
