import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faSignInAlt,
  faBell,
  faUserAlt,
  faCommentAlt,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/fontawesome-free-brands";
import {} from "@fortawesome/fontawesome-free-regular";

import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-toastify";

import { userLogout, loadingOverlay, clearCached } from "../actions/user";
import LogoutDialog from "../pages/LogoutDialog";
import LoginDialog from "../pages/LoginDialog";
import previewIcon from "../images/preview-icon.png";

// import { socketIO } from '../SocketioClient'

import history from "../history";

var _ = require("lodash");

const HeaderBar = (props) => {
  // const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  const [maintenance, setMaintenance] = useState(false);

  const [follows, setFollows] = useState([]);

  useEffect(async () => {
    if (!_.isEmpty(props.follows)) {
      setFollows(props.follows.filter((el) => el.status));
    }

    // console.log('socket >>', await socketIO(props))
  }, []);

  useEffect(() => {
    setMaintenance(props.maintenance);
  }, [props.maintenance]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <section>
      <nav
        className="navbar navbar-expand-md navbar-dark bg-violet25"
        aria-label="Fourth navbar example"
      >
        <div className="container">
          <a href={"/"} className="navbar-brand">
            Banlist.info
          </a>
          <div className="sign-inout">
            <button className="btn btn-signout text-white">
              <div>
                <div>
                  {_.isEmpty(props.user) ? (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        console.log("-->");
                        setShowModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faSignInAlt} />
                      <span className="text font-prompt">เข้าสู่ระบบ </span>
                    </div>
                  ) : (
                    /*<ul className="flex-container row">
                                            <li className="flex-item">
                                                <NotificationsIcon 
                                                  className="notifications-icon"
                                                  onClick={()=>{
                                                    history.push({pathname: `/notifications`, state: {} })
                                                  }} />
                                                <span className="notifications-span">1</span>
                                            </li>
                                            <li className="flex-item">
                                              <LazyLoadImage
                                                className="lazy-load-image-border-radius"
                                                alt={'image.alt'}
                                                width="40px"
                                                height="40px"
                                                effect="blur"
                                                onClick={handleClick}
                                                placeholderSrc={previewIcon}
                                                src={props.user.image_url} 
                                                />
                                            </li>
                                          </ul>*/
                    <div className="sign-inout">
                      <ul className="flex-container ">
                        <li className="flex-item mr-3">
                          <div className="noti-box">
                            <FontAwesomeIcon
                              icon={faComments}
                              className=" fa-lg icon-bell text-white"
                              onClick={() => {
                                history.push({
                                  pathname: `/list-chat`,
                                  state: {},
                                });
                              }}
                            />
                          </div>
                        </li>
                        <li className="flex-item mr-3">
                          <div className="noti-box">
                            <FontAwesomeIcon
                              icon={faBell}
                              className=" fa-lg icon-bell text-white"
                              onClick={() => {
                                history.push({
                                  pathname: `/notifications`,
                                  state: {},
                                });
                              }}
                            />
                            <span className="notifications-span bg-danger">
                              <span className="num-text">9</span>
                              {/* <span className="num-text addplus">9</span> */}
                              {/* more than 9 notification add addplus class */}
                            </span>
                          </div>
                        </li>
                        <li className="flex-item">
                          <div
                            className="profile-icon"
                            onClick={(ev) => {
                              handleClick(ev);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faUserAlt}
                              className="fa-lg icon-bell text-white"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <Menu
                  keepMounted
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  open={Boolean(anchorEl)}
                >
                  <MenuItem
                    onClick={() => {
                      history.push({ pathname: `/my-profile`, state: {} });
                      setAnchorEl(null);
                    }}
                  >
                    My Profile
                  </MenuItem>

                  {/* My post (10) */}

                  <MenuItem
                    onClick={() => {
                      history.push({ pathname: `/new-post`, state: {} });
                      setAnchorEl(null);
                    }}
                  >
                    New post
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      history.push({
                        pathname: `/my-profile/my-post`,
                        state: {},
                      });
                      setAnchorEl(null);
                    }}
                  >
                    Posts
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      history.push({
                        pathname: `/my-profile/follows`,
                        state: {},
                      });
                      setAnchorEl(null);
                    }}
                  >
                    Follows
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setShowModalLogout(true);
                      setAnchorEl(null);
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
                <LoginDialog
                  showModal={showModal}
                  mode={"login"}
                  onClose={() => {
                    setShowModal(false);
                  }}
                />
                <LogoutDialog
                  showModalLogout={showModalLogout}
                  onClose={() => {
                    setShowModalLogout(false);
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>
    </section>
  );
};

const mapStateToProps = (state, ownProps) => {
  let follows = _.map(state.user.follows, (o) => {
    if (o.status) return o.nid;
  }).filter((o) => o !== undefined);

  // console.log('follows : ', follows)

  return {
    user: state.user.data,
    data: state.app.data,

    // follows: state.app.follows,
    follows,

    follow_ups: state.user.follow_ups,

    my_apps: state.my_apps.data,
    maintenance: state.setting.maintenance,

    socket_data: state.socket.data,
  };
};

const mapDispatchToProps = {
  userLogout,
  loadingOverlay,
  clearCached,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);
