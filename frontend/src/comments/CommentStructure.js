import React, { useContext, useState } from "react";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import ContentEditable from "react-contenteditable";

import { connect } from "react-redux";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import LoginDialog from "../pages/LoginDialog";
import { ActionContext } from "./ActionContext";

var _ = require("lodash");

const CommentStructure = ({ i, reply, parentId, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const actions = useContext(ActionContext);
  const [showModal, setShowModal] = useState(false);

  const edit = true;

  return (
    <div className={"halfDiv"}>
      <div
        className={"userInfo"}
        // style={reply && { marginLeft: 15, marginTop: "6px" }}
      >
        {/* <div>{i.text}</div> */}

        <div className={"commentsTwo"}>
          <div>
            <img
              src={i.avatarUrl}
              style={{ width: 24, height: 24, borderRadius: 24 / 2 }}
              alt="userIcon"
            />
          </div>
          <div className={"fullName"}>{i.fullName} </div>
          <div
            className={"replyBtn"}
            onClick={() => {
              if (_.isEmpty(user)) {
                setShowModal(true);
              } else {
                actions.handleAction(i.comId, false, i);
              }
            }}
            disabled={!actions.user}
          >
            {/* <button
              className={"replyBtn"}
              onClick={() => {
                actions.handleAction(i.comId);
              }}
              disabled={!actions.user}
            >
              {" "} */}
            <FontAwesomeIcon icon={faReply} size="1x" color="#a5a5a5" /> Reply
            {/* </button> */}
          </div>
        </div>
        <div>
          <ContentEditable
            // className="editable"
            // tagName="pre"
            html={i.text} // innerHTML of the editable div
            disabled={true} // use true to disable edition
          />
        </div>
      </div>
      <div className={"userActions"}>
        {actions.userId === i.userId && actions.user && (
          // <button
          //   className={"actionsBtn"}
          //   onClick={(ev) => {
          //     setAnchorEl(ev.currentTarget);
          //   }}
          // >
          <div
            className={"actionsBtn"}
            onClick={(ev) => {
              setAnchorEl(ev.currentTarget);
            }}
          >
            <FontAwesomeIcon icon={faEllipsisV} size="1x" color="#b9b9b9" />
          </div>
        )}
        <Menu
          keepMounted
          anchorEl={anchorEl}
          onClose={(e) => {
            setAnchorEl(null);
          }}
          open={Boolean(anchorEl)}
        >
          <MenuItem
            onClick={() => {
              actions.handleAction(i.comId, edit);
            }}
          >
            edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              actions.onDelete(i.comId, parentId);
            }}
          >
            delete
          </MenuItem>
        </Menu>
      </div>
      {/* <div className={"userActions"}>
        {actions.userId === i.userId && actions.user && (
          <Popup
            role="tooltip"
            trigger={
              <button className={"actionsBtn"}>
                <FontAwesomeIcon icon={faEllipsisV} size="1x" color="#b9b9b9" />
              </button>
            }
            position="right center"
            nested
          >
            <div className={"actionDiv"}>
              <div>
                <button
                  className={"editBtn"}
                  onClick={() => actions.handleAction(i.comId, edit)}
                >
                  {" "}
                  edit
                </button>
              </div>
              <div>
                <Popup
                  trigger={<button className={"deleteBtn"}> delete</button>}
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal" style={modal}>
                      <button
                        className="close"
                        onClick={close}
                        style={modalClose}
                      >
                        &times;
                      </button>
                      <div className="header" style={modalHeader}>
                        {" "}
                        Delete Comment{" "}
                      </div>
                      <div className="content" style={modalContent}>
                        {" "}
                        Delete your comment permanently?
                      </div>
                      <div className="actions" style={modalActions}>
                        <button
                          className="button"
                          style={modalActionBtn}
                          onClick={() => {
                            actions.onDelete(i.comId, parentId);
                            close();
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="button"
                          style={modalDelBtn}
                          onClick={() => {
                            close();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>
              </div>
            </div>
          </Popup>
        )}
      </div> */}

      <LoginDialog
        showModal={showModal}
        mode={"login"}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
  };
};

export default connect(mapStateToProps, null)(CommentStructure);
