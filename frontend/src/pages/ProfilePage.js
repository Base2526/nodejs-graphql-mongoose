import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";

import axios from "axios";
import ls from "local-storage";

import moment from "moment";
import { userLogin } from "../actions/user";
import { addMessages, addMessage } from "../actions/messages";
// import { Launcher } from "../libs/react-chat-window/src";

import {
  Button,
  Input,
  MessageBox,
  MessageList,
  Dropdown,
} from "react-chat-elements";
import "react-chat-elements/dist/main.css";

var _ = require("lodash");

const ProfilePage = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [friendProfile, setFriendProfile] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const refLauncher = useRef();

  useEffect(async () => {
    let { _id } = props.match.params;

    let response = await axios.post(
      `/v1/profile`,
      {
        _id,
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
    console.log("ProfilePage > response :", response);
    if (response.result) {
      let data = response.data;

      setFriendProfile(data);

      /*
      setFriendProfile(data);
      props.addMessages(data.messages);
      */
    }
  }, []);

  useEffect(() => {
    console.log("props.messages >>", props.messages);

    setMessageList(props.messages);
  }, [props.messages]);

  // const handleNewUserMessage = (newMessage) => {
  //   console.log(`New message incoming! ${newMessage}`);
  //   // Now send the message throught the backend API
  //   // addResponseMessage(response);
  // };

  const onUserInputSubmit = (message) => {
    console.log("onUserInputSubmit : ", message);
    // this.setState({
    //   messageList: [...this.state.messageList, message],
    // });

    // setMessageList([...messageList, message]);

    _sendMessage({ ...message, status: "send" });
  };

  const onFilesSelected = (files) => {
    var filesArr = Array.prototype.slice.call(files);
    let messages = [];
    _.map(filesArr, (file) => {
      let message = {
        author: "me",
        type: "file",
        status: "send",
        data: {
          url: URL.createObjectURL(file),
          fileName: file.name,
        },
        created: new Date().getTime(),
        updated: new Date().getTime(),
      };

      // messages = [...messages, message];

      _sendMessage(message);
    });

    // console.log("onFilesSelected messages : ", messages);
    // setMessageList([...messageList, ...messages]);
  };

  const _sendMessage = async (message) => {
    // if (text.length > 0) {
    //   this.setState({
    //     messageList: [...this.state.messageList, {
    //       author: 'them',
    //       type: 'text',
    //       data: { text }
    //     }]
    //   })
    // }

    console.log("props.message  > ", message, friendProfile);

    // function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 25; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    //  return result;
    // }

    // conversationId: String,
    // sender: String,
    // text: String,
    message = {
      ...message,
      conversationId: friendProfile.conversationId,
      senderId: props.user.uid,
      receiverId: friendProfile.uid,
      _id: result,
    };

    let response = await axios.post(
      `/api/v1/add_message`,
      { ...message },
      {
        headers: {
          Authorization: _.isEmpty(ls.get("basic_auth"))
            ? `Basic ${process.env.REACT_APP_AUTHORIZATION}`
            : ls.get("basic_auth"),
        },
      }
    );

    response = response.data;
    if (response.result) {
      console.log("ProfilePage > response :", response, result);
    }

    setMessageList([...messageList, message]);
  };

  return (
    <div>
      {_.isEmpty(friendProfile) ? (
        <div />
      ) : (
        <div className="App">
          <div className="bg-gray25">
            <div>
              <div>
                <img
                  src={
                    process.env.REACT_APP_URL_SERVER + friendProfile.images.path
                  }
                  width={"45px"}
                  height={"45px"}
                  className="img-user"
                />
              </div>
              <h3>{friendProfile.account_name}</h3>
              <div>
                <button>10 Followers</button>
                <button>100 Follow</button>
                <button
                  onClick={(e) => {
                    // refLauncher.current.onClose();
                    console.log("chat");

                    props.history.push({
                      pathname: `/list-chat`,
                      state: {},
                    });
                  }}
                >
                  Chat
                </button>
              </div>
            </div>
            <div>
              {friendProfile.contents.map((item, idx) => {
                return (
                  <div className={"class-border"} key={idx}>
                    <div
                      onClick={(e) => {
                        props.history.push({
                          pathname: `/detail/${item._id}`,
                          key: item._id,
                          state: { item },
                        });
                      }}
                    >
                      {item.title}
                    </div>
                    <div>
                      {/* {moment(new Date().getTime()).format("MMM DD, YYYY")} */}
                      {moment
                        .unix(item.created / 1000)
                        .format("MMM DD, YYYY h:mm:ss a")}
                    </div>
                    <div>
                      <MoreVertOutlinedIcon
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                        }}
                      />
                      <Menu
                        keepMounted
                        anchorEl={anchorEl}
                        onClose={() => {
                          setAnchorEl(null);
                        }}
                        open={Boolean(anchorEl)}
                      >
                        <MenuItem
                          onClick={() => {
                            console.log(item);
                          }}
                        >
                          Share
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            console.log(item);
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem onClick={() => {}}>Delete</MenuItem>
                      </Menu>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <Launcher
            // childFunc={childFunc}
            {...props}
            ref={refLauncher}
            agentProfile={{
              teamName: friendProfile.account_name,
              imageUrl:
                process.env.REACT_APP_URL_SERVER + friendProfile.images.path,
            }}
            onUserInputSubmit={(e) => onUserInputSubmit(e)}
            onFilesSelected={(e) => onFilesSelected(e)}
            messageList={messageList}
            showEmoji
            isOpen={isOpen}
          /> */}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { user: state.user.data, messages: state.messages.messages };
};

const mapDispatchToProps = {
  userLogin,
  addMessages,
  addMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
