import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import ls from "local-storage";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";

import { userLogout, loadingOverlay, deletePost } from "../actions/user";

var _ = require("lodash");

const ModalDraftsDeleteDialog = (props) => {
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
  }, [props.data]);

  useEffect(() => {
    setShowModal(props.showModalLogout);
  }, [props.showModalLogout]);

  const handleLogout = async (e) => {
    setLogoutLoading(true);

    let response = await axios.post(`/api/v1/logout`);

    response = response.data;

    console.log("/api/v1/logout : response = xx ", response);

    // if(response.result){

    props.onClose();

    ls.remove("basic_auth");
    ls.remove("session");

    props.userLogout();

    setLogoutLoading(false);

    history.push({ pathname: `/`, state: {} });
  };

  const handleCancel = (e) => {
    console.log(data);
    props.onClose();
  };

  const handleDelete = async (e) => {
    console.log(data);

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
  };

  const bodyContent = () => {
    return (
      <div>
        <div>Delete story</div>
        <div>{data.title}</div>
        <div>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleDelete}>Delete</button>
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
      >
        {/* <Modal.Header closeButton={true}>
                <h2>Comfirm Logout</h2>
            </Modal.Header> */}
        <Modal.Body>{_.isEmpty(data) ? "" : bodyContent()}</Modal.Body>
        {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleLogout}>Logout {logoutLoading && <CircularProgress size={15}/> }</Button>
            </Modal.Footer> */}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    maintenance: state.setting.maintenance,
  };
};

const mapDispatchToProps = {
  userLogout,
  loadingOverlay,
  deletePost,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalDraftsDeleteDialog);
