import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import ls from "local-storage";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";

import ReactList from "react-list";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretSquareUp,
  faEllipsisV,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import { userLogout, loadingOverlay, deletePost } from "../actions/user";
import { addFriend } from "../actions/friends";

var _ = require("lodash");

const ModalFollwersDialog = (props) => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);

  const [logoutLoading, setLogoutLoading] = useState();

  useEffect(() => {
    setShowModal(false);
    setLogoutLoading(false);

    // props.loadingOverlay(false);

    return () => {
      setShowModal();
      setLogoutLoading();
    };
  }, []);

  useEffect(() => {
    setData(props.data);

    console.log("props.data >>> : ", props.data);
    props.data.map(async (item, key) => {
      let friend = _.find(props.friends, (im) => im._id === item.uid);
      console.log("friend >>> : ", friend, props.friends);

      if (_.isEmpty(friend)) {
        try {
          let response = await axios.post(
            `/v1/friend`,
            {
              _id: item.uid,
            },
            { timeout: process.env.REACT_APP_AXIOS_TIMEOUT },
            {
              headers: {
                Authorization: _.isEmpty(ls.get("basic_auth"))
                  ? `Basic ${process.env.REACT_APP_AUTHORIZATION}`
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
    });
  }, [props.data, props.friends]);

  useEffect(() => {
    setShowModal(props.showModal);
  }, [props.showModal]);

  const handleCancel = (e) => {
    console.log(data);
    props.onClose();
  };

  const handleDelete = async (e) => {
    console.log(data);
    props.onClose();

    /*
    props.loadingOverlay(true);

    const formData = new FormData();
    formData.append("_id", data._id);

    // setLoginLoading(true);
    let response = await axios.post(`/v1/delete_banlist`, formData, {
      headers: {
        Authorization: `${ls.get("basic_auth")}`,
        "content-type": "multipart/form-data",
      },
    });

    response = response.data;

    console.log("/v1/delete_banlist > ", response);

    if (response.result) {
      props.deletePost({ _id: data._id });

      props.loadingOverlay(false);
      props.onClose();
    }
    */
  };

  const bodyContent = () => {
    return (
      <div>
        <div>
          <ReactList
            itemRenderer={(item, key) => {
              let friend = _.find(
                props.friends,
                (im) => im._id === data[key].uid
              );

              if (_.isEmpty(friend)) {
                return <div />;
              }
              return (
                <div className="mb-3" key={key}>
                  <div onClick={() => {}}>
                    <div>
                      <img
                        src={
                          _.isEmpty(friend.images)
                            ? ""
                            : process.env.REACT_APP_URL_SERVER +
                              friend.images.path
                        }
                        width={"45px"}
                        height={"45px"}
                        className="img-user"
                      />
                    </div>
                    <h3 className="h5 mb-1 font-weight-bold">
                      {friend.display_name}
                    </h3>
                  </div>

                  <hr className="my-2" />
                </div>
              );
            }}
            length={data.length}
            type="simple"
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Modal
        show={showModal}
        onHide={props.onClose}
        // onSubmit={handleSubmit}
        // bsSize="large"
        backdrop="static"
        dialogClassName="my-modal"
        scrollable={true}
      >
        {/* <Modal.Body>{_.isEmpty(data) ? "" : bodyContent()}</Modal.Body> */}
        <Modal.Header closeButton>
          <Modal.Title>Follwers</Modal.Title>
        </Modal.Header>
        <Modal.Body>{_.isEmpty(data) ? "" : bodyContent()}</Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    maintenance: state.setting.maintenance,
    friends: state.friends.data,
  };
};

const mapDispatchToProps = {
  userLogout,
  loadingOverlay,
  deletePost,
  addFriend,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalFollwersDialog);
