import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import ls from "local-storage";
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import moment from "moment";
import { toast } from "react-toastify";

import { CopyToClipboard } from "react-copy-to-clipboard";

import UseMyPostItem from "./UseMyPostItem";

import MyPostConfirmDeleteDialog from "./MyPostConfirmDeleteDialog";
import MyPostConfirmUpdateStatusDialog from "./MyPostConfirmUpdateStatusDialog";

import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretSquareUp,
  faEllipsisV,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import { LazyLoadImage } from "react-lazy-load-image-component";

import { isEmpty, onToast } from "../utils";

import { initMyApp, addMyAppALL } from "../actions/my_apps";
import { attributesToProps } from "html-react-parser";

import { addContentsData } from "../actions/app";

import { addPosts } from "../actions/user";

import Tabs from "../components/Tabs";

import ModalDraftsDeleteDialog from "./ModalDraftsDeleteDialog";

var _ = require("lodash");

let {
  REACT_APP_DEBUG,
  REACT_APP_VERSIONS,
  REACT_APP_URL_SERVER,
  REACT_APP_GEOLOCATION,
  REACT_APP_AUTHORIZATION,
  REACT_APP_AXIOS_TIMEOUT,
} = process.env;

const MyPostPage = (props) => {
  const history = useHistory();
  const [myApps, setMyApps] = useState(props.my_apps);
  const [anchorElShare, setAnchorElShare] = useState(null);
  const [anchorElSettting, setAnchorElSettting] = useState(null);
  const [anchorElDrafts, setAnchorElDrafts] = useState(null);

  // const [itemShare, setItemShare] = useState(null);
  // const [itemSetting, setItemSetting] = useState(null);
  // const [itemDrafts, setItemDrafts] = useState(null);

  const [itemSelect, setItemSelect] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [showModalDraftsDelete, setShowModalDraftsDelete] = useState(false);

  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [showModalConfirmUpdateStatus, setShowModalConfirmUpdateStatus] =
    useState(false);

  const [datas, setDatas] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);

  useEffect(() => {
    console.log("useEffect : MyPostPage > ", props);
  });

  useEffect(() => {
    if (_.isEmpty(props.user)) {
      history.push({ pathname: `/`, state: {} });
      return;
    }

    console.log("MyPostPage > ", props.user._id);
    fetchData();
  }, []);

  useEffect(() => {
    setDrafts(props.datas.filter((o) => !o.status));
    setPublished(props.datas.filter((o) => o.status));
  }, [props.datas]);

  const fetchData = async () => {
    let response = await axios.post(
      REACT_APP_DEBUG ? "/v1/search" : REACT_APP_URL_SERVER + "/v1/search",
      {
        type: 1,
        key_word: props.user._id,
        offset: 0,
        //  page_limit: pageLimit
      },
      { timeout: REACT_APP_AXIOS_TIMEOUT },
      { headers: { Authorization: `${ls.get("basic_auth")}` } }
    );

    response = response.data;

    if (response.result) {
      let { datas } = response;

      console.log("response : ", response, props.user._id);
      props.addPosts(datas);
    }
  };

  const handleCloseShare = () => {
    setAnchorElShare(null);
  };

  const handleCloseSetting = () => {
    setAnchorElSettting(null);
  };

  //
  const handleCloseDrafts = () => {
    setAnchorElDrafts(null);
  };

  const handleClickShare = (event, item) => {
    setAnchorElShare(event.currentTarget);

    setItemSelect(item);
  };

  const handleClickSetting = (event, item) => {
    setAnchorElSettting(event.currentTarget);

    setItemSelect(item);
  };

  // handleClickShare
  const handleClickDrafts = (event, item) => {
    setAnchorElDrafts(event.currentTarget);

    setItemSelect(item);
  };

  const menuShare = () => {
    return (
      <Menu
        keepMounted
        anchorEl={anchorElShare}
        onClose={() => handleCloseShare()}
        open={Boolean(anchorElShare)}
      >
        <CopyToClipboard
          text={
            _.isEmpty(itemSelect)
              ? ""
              : window.location.origin + "/detail/" + itemSelect._id
          }
        >
          <MenuItem
            onClick={() => {
              console.log("Copy Link :", itemSelect, window.location.origin);

              toast.info("Link to post copied to clipboard.", {
                position: "bottom-right",
                hideProgressBar: true,
                autoClose: 1000,
              });

              handleCloseShare();
            }}
          >
            Copy Link
          </MenuItem>
        </CopyToClipboard>
      </Menu>
    );
  };

  const menuSetting = () => {
    return (
      <Menu
        keepMounted
        anchorEl={anchorElSettting}
        onClose={() => handleCloseSetting()}
        open={Boolean(anchorElSettting)}
      >
        <MenuItem
          onClick={() => {
            console.log("edit :", itemSelect);

            props.history.push({
              pathname: `/edit-post/` + itemSelect._id,
              key: itemSelect._id,
              state: itemSelect,
            });

            handleCloseSetting();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("Delete :", itemSelect);

            setShowModalDraftsDelete(true);

            handleCloseSetting();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    );
  };

  const menuDrafts = () => {
    return (
      <Menu
        keepMounted
        anchorEl={anchorElDrafts}
        onClose={() => handleCloseDrafts()}
        open={Boolean(anchorElDrafts)}
      >
        <MenuItem
          onClick={() => {
            console.log("edit :", itemSelect);

            props.history.push({
              pathname: `/edit-post/` + itemSelect._id,
              key: itemSelect._id,
              state: itemSelect,
            });

            handleCloseDrafts();
          }}
        >
          Edit drafts
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("Delete :", itemSelect);

            setShowModalDraftsDelete(true);
            handleCloseDrafts();
          }}
        >
          Delete drafts
        </MenuItem>
      </Menu>
    );
  };

  const updateState = (data) => {
    switch (Object.keys(data)[0]) {
      case "showModalLogin": {
        // setShowModalLogin(Object.values(data)[0])
        break;
      }
      case "showModalReport": {
        // setShowModalReport(Object.values(data)[0])
        break;
      }
    }
  };

  const onModalConfirmDelete = (data) => {
    setShowModalConfirmDelete(data);
  };

  const onModalConfirmUpdateStatus = (data) => {
    setShowModalConfirmUpdateStatus(data);
  };

  const itemView = (item) => {
    console.log("itemView :", item);

    if (Object.keys(item).length === 0) {
      return <div />;
    }

    if (item.images.length === 0) {
      return <div />;
    }

    let thumbnail = item.images.thumbnail;
    let medium = item.images.medium;
    switch (thumbnail.length) {
      case 0: {
        return <div />;
      }
      case 1: {
        return (
          <div key={item.id}>
            <div class="hi-container">
              <div class="hi-sub-container1">
                <div
                  class="hi-item1"
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
          <div key={item.id}>
            <div class="hi-container">
              <div class="hi-sub-container1">
                <div
                  class="hi-item1"
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
                  class="hi-item2"
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
          <div key={item.id}>
            <div class="hi-container">
              <div class="hi-sub-container1">
                <div
                  class="hi-item1"
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
                  class="hi-item2"
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
              <div class="hi-sub-container2">
                <div
                  class="hi-item3"
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
          <div key={item.id}>
            <div class="hi-container">
              <div class="hi-sub-container1">
                <div
                  class="hi-item1"
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
                  class="hi-item2"
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
              <div class="hi-sub-container2">
                <div
                  class="hi-item3"
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

  const drafts_view = () => {
    return drafts.map((item, idx) => {
      return (
        <div className="mb-3" key={idx}>
          <div
            onClick={() => {
              props.history.push({
                pathname: `/detail/${item._id}`,
                key: item._id,
                state: { item },
              });
            }}
          >
            <h3 className="h5 mb-1 font-weight-bold">{item.title}</h3>
            <div>{item.detail.substring(0, 100) + "..."}</div>
          </div>
          <p className="mb-1 color-gray80">
            created{" "}
            {moment(parseInt(item.created)).format("MMM DD YYYY , h:mm:ss a")}{" "}
            <FontAwesomeIcon
              icon={faEllipsisV}
              className="ml-1"
              onClick={(ev) => handleClickDrafts(ev, item)}
            />
          </p>
          <hr className="my-2" />
        </div>
      );
    });
  };

  const published_view = () => {
    return published.map((item, idx) => {
      return (
        <div className="mb-3" key={idx}>
          <div
            onClick={() => {
              props.history.push({
                pathname: `/detail/${item._id}`,
                key: item._id,
                state: { item },
              });
            }}
          >
            <h3 className="h5 mb-1 font-weight-bold">{item.title}</h3>
            <div>{item.detail.substring(0, 100) + "..."}</div>
          </div>
          <p className="mb-1 color-gray80">
            Published on{" "}
            {moment(parseInt(item.created)).format("MMM DD YYYY , h:mm:ss a")}{" "}
            read
            <FontAwesomeIcon
              icon={faCaretSquareUp}
              className="ml-2"
              onClick={(ev) => handleClickShare(ev, item)}
            />
            <FontAwesomeIcon
              icon={faEllipsisV}
              className="ml-3 bx-ellipsis"
              onClick={(ev) => handleClickSetting(ev, item)}
            />
          </p>
          <hr className="my-2" />
        </div>
      );
    });
  };

  const responses_view = () => {
    return [].map((data, idx) => {
      return (
        <div className="mb-3">
          <h3 className="h5 mb-1 font-weight-bold">
            สั่งซื้อโทรศัพท์ iphone12โดนโกง
          </h3>
          <p className="mb-1 color-gray80">
            Published on Otc 17 : 5 min read
            <FontAwesomeIcon icon={faCaretSquareUp} className="ml-2" />
            <FontAwesomeIcon icon={faEllipsisV} className="ml-3 bx-ellipsis" />
          </p>
          <hr className="my-2" />
        </div>
      );
    });
  };

  return (
    <div>
      <h1>Your posts ({drafts.length + published.length}) </h1>
      {menuShare()}
      {menuSetting()}
      {menuDrafts()}

      <ModalDraftsDeleteDialog
        showModalLogout={showModalDraftsDelete}
        data={itemSelect}
        onClose={() => {
          setShowModalDraftsDelete(false);
        }}
      />
      <Tabs activeTab={"published"}>
        <div
          label={`Drafts ${_.isEmpty(drafts) ? "" : drafts.length}`}
          id="drafts"
        >
          {drafts_view()}
        </div>
        <div
          label={`Published ${_.isEmpty(published) ? "" : published.length}`}
          id="published"
        >
          {published_view()}
        </div>
        <div label="Responses" id="responses">
          {responses_view()}
        </div>
      </Tabs>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  console.log("MyPostPage> mapStateToProps : ", state);
  return {
    user: state.user.data,
    my_apps: state.my_apps.data,

    datas: state.user.posts, //state.app.data.filter((o) => o.owner_id === state.user.data._id),
  };
};

const mapDispatchToProps = {
  initMyApp,
  addMyAppALL,

  addContentsData,

  addPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPostPage);
