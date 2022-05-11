import React, { Component, isValidElement, useEffect, useState } from "react";

import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { toast } from "react-toastify";
import ls from "local-storage";

import { isEmailValid, uniqueId, onToast, isEmpty } from "../utils";
import PasswordField from "../components/PasswordField";
import {
  userLogin,
  ___followUp,
  fetchMyApps,
  addfollowerPost,
} from "../actions/user";

// import { addMyApp } from '../actions/my_apps';

import { addMyAppALL } from "../actions/my_apps";

import { addContentsData } from "../actions/app";

import { addFollowsData, addConversations } from "../actions/user";

import { addMessages } from "../actions/messages";

import { addFriend } from "../actions/friends";

var _ = require("lodash");

const LoginDialog = (props) => {
  const [displayName, setDisplayName] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const [registerLoading, setRegisterLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [userNameOREmailError, setUserNameOREmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [rgUsernameError, setRgUsernameError] = useState("");
  const [rgEmailAddressError, setRgEmailAddressError] = useState("");
  const [rgPasswordError, setRgPasswordError] = useState("");
  const [rgConfirmPasswordError, setRgConfirmPasswordError] = useState("");

  const [rgError, setRgError] = useState("");

  //
  const [fgEmailaddressError, setFgEmailaddressError] = useState("");
  const [fgError, setFgError] = useState("");

  useEffect(() => {
    console.log("---xxx---> ", props);
    setShowModal(false);
    setDisplayName("");
    setEmail("");

    return () => {
      setShowModal();
      setEmail();
      setDisplayName();
    };
  }, []);

  useEffect(() => {
    let { showModal, mode } = props;

    if (showModal) {
      setMode(mode);
    } else {
      setUserNameOREmailError("");
      setPasswordError("");
      setLoginError("");
      setRgUsernameError("");
      setRgEmailAddressError("");
      setRgPasswordError("");
      setRgError();
      setFgEmailaddressError("");
      setFgError("");
    }
    setShowModal(showModal);
  }, [props.showModal]);

  const contentBody = () => {
    switch (mode) {
      case "login": {
        return (
          <div>
            <div
              onClick={() => {
                props.onClose(false);
              }}
            >
              Close
            </div>
            <form className="form-horizontal form-loanable">
              <fieldset>
                <div className="form-group has-feedback required">
                  <label htmlFor="login-email" className="col-sm-5">
                    Username or email
                  </label>
                  <div className="col-sm-12">
                    <input
                      type="text"
                      name="email"
                      id="login-email"
                      className="form-control"
                      placeholder="Enter username or email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  {_.isEmpty(userNameOREmailError) ? (
                    ""
                  ) : (
                    <span className="col-sm-12 user-name-or-email-error">
                      {userNameOREmailError}
                    </span>
                  )}
                </div>
                <div className="form-group has-feedback required">
                  <PasswordField
                    label="Password"
                    placeholder="*****"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  {_.isEmpty(passwordError) ? (
                    ""
                  ) : (
                    <span className="col-sm-12 password-error">
                      {passwordError}
                    </span>
                  )}
                </div>

                {_.isEmpty(loginError) ? (
                  ""
                ) : (
                  <div className="form-group has-feedback required">
                    <span className="col-sm-12 login-error">{loginError}</span>
                  </div>
                )}
                <button onClick={handleFormSubmit}>Login</button>
              </fieldset>
              <fieldset>
                <div className="col-sm-12">OR</div>
              </fieldset>
              <fieldset>
                <div className="col-sm-12">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode("forgot");
                    }}
                  >
                    {" "}
                    Forgot password
                  </a>
                  |
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode("register");
                    }}
                  >
                    Create new account
                  </a>
                </div>

                <div className="form-action" class="col-sm-12">
                  {/* <button
                  type="submit"
                  disabled={isEmpty(email) && isEmpty(password) ? true : false}
                  className={"div-button"}
                >
                  Login
                  {loginLoading && <CircularProgress size={15} />}
                </button> */}
                  {/* https://stackoverflow.com/questions/55023073/react-google-login-inline-styling */}
                  <GoogleLogin
                    clientId="693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    className="btnGoogle"
                    render={(renderProps) => (
                      <botton onClick={renderProps.onClick}>
                        Sign In with Google
                      </botton>
                    )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                  <FacebookLogin
                    appId="1088597931155576"
                    // autoLoad={true}
                    fields="name,email,picture"
                    onClick={() => {
                      clickedFacebook();
                    }}
                    callback={(response) => {
                      responseFacebook(response);
                    }}
                    cssClass="btnFacebook"
                    icon={
                      <i
                        className="fa fa-facebook"
                        style={{ marginLeft: "5px" }}
                      />
                    }
                    textButton="Sign In with Facebook"
                  />
                </div>

                <div>
                  By continuing, you agree to Banlist's Terms of Service and
                  acknowledge you've read our Privacy Policy
                </div>
              </fieldset>
            </form>
          </div>
        );
      }

      case "register": {
        return (
          <div>
            <div>
              <div
                onClick={() => {
                  props.onClose(false);
                }}
              >
                Close
              </div>
              <form className="form-horizontal form-loanable">
                <fieldset>
                  <div className="form-group has-feedback required">
                    <label htmlFor="login-email" className="col-sm-5">
                      Username
                    </label>
                    <div className="col-sm-12">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        placeholder="Enter username"
                        value={displayName}
                        onChange={(e) => {
                          setDisplayName(e.target.value);
                        }}
                      />
                    </div>
                    {_.isEmpty(rgUsernameError) ? (
                      ""
                    ) : (
                      <span className="col-sm-12 rg-username-error">
                        {rgUsernameError}
                      </span>
                    )}
                  </div>
                  <div className="form-group has-feedback required">
                    <label htmlFor="login-email" className="col-sm-5">
                      Email address
                    </label>
                    <div className="col-sm-12">
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                    {_.isEmpty(rgEmailAddressError) ? (
                      ""
                    ) : (
                      <span className="col-sm-12 rg-email-address-error">
                        {rgEmailAddressError}
                      </span>
                    )}
                  </div>
                  <div className="form-group has-feedback required">
                    <PasswordField
                      label="Password"
                      placeholder="*****"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    {_.isEmpty(rgPasswordError) ? (
                      ""
                    ) : (
                      <span className="col-sm-12 rg-password-error">
                        {rgPasswordError}
                      </span>
                    )}
                    <div>
                      {_.isEmpty(rgError) ? (
                        ""
                      ) : (
                        <span className="col-sm-12 rg-password-error">
                          {rgError}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="form-group has-feedback required">
                    <PasswordField
                      label="Confirm password"
                      placeholder="*****"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                    />
                    {_.isEmpty(rgConfirmPasswordError) ? (
                      ""
                    ) : (
                      <span className="col-sm-12 rg-password-error">
                        {rgConfirmPasswordError}
                      </span>
                    )}
                    <div>
                      {_.isEmpty(rgError) ? (
                        ""
                      ) : (
                        <span className="col-sm-12 rg-password-error">
                          {rgError}
                        </span>
                      )}
                    </div>
                  </div>
                </fieldset>
                {/* <div className="form-action" className="col-sm-12">
                  <button
                    type="submit"
                    disabled={ (isEmpty(displayName) && isEmpty(email) && isEmpty(password)) ? true: false }
                    className={"div-button"} >Register 
                    { registerLoading && <CircularProgress size={15}/> }
                    </button>
                </div> */}

                <button onClick={handleFormSubmit}>Register</button>
              </form>
            </div>
            <div className="col-sm-12">
              <span
                style={{ cursor: "pointer" }}
                className={"span-border-bottom "}
                onClick={(e) => {
                  setMode("login");
                }}
              >
                &lt;&lt; Back to login
              </span>
            </div>
          </div>
        );
      }

      case "forgot": {
        return (
          <div>
            <div
              onClick={() => {
                props.onClose(false);
              }}
            >
              Close
            </div>
            <form className="form-horizontal form-loanable">
              <div className="col-sm-12">
                <span className="form-control-feedback" aria-hidden="true">
                  Email address
                </span>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                {_.isEmpty(fgEmailaddressError) ? (
                  ""
                ) : (
                  <span className="col-sm-12 fg-email-address-error">
                    {fgEmailaddressError}
                  </span>
                )}
              </div>
              <div>
                {_.isEmpty(fgError) ? (
                  ""
                ) : (
                  <span className="col-sm-12 rg-password-error">{fgError}</span>
                )}
              </div>
              <button onClick={handleFormSubmit}>Send</button>
              <div className="col-sm-12">
                <span
                  style={{ cursor: "pointer" }}
                  className={"span-border-bottom"}
                  onClick={(e) => {
                    setMode("login");
                  }}
                >
                  &lt;&lt; Back to login
                </span>
              </div>
            </form>
          </div>
        );
      }
    }
  };

  const contentFooter = () => {
    switch (mode) {
      case "login": {
        return (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => props.onClose()}>
              Close
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              Login {loginLoading && <CircularProgress size={15} />}
            </Button>
          </Modal.Footer>
        );

        /*
        return  <div>
                  <button
                    type="submit"
                    onClick={handleFormSubmit}
                    disabled={ (isEmpty(email) && isEmpty(password)) ? true: false }
                    className={"div-button"} >Login
                    { loginLoading && <CircularProgress size={15}/> }
                  </button>    
                  <GoogleLogin
                    clientId="693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                  />

                  <FacebookLogin
                    appId="1088597931155576"
                    // autoLoad={true}
                    fields="name,email,picture"
                    onClick={()=>{
                      clickedFacebook()
                    }}
                    callback={(response)=>{
                      this.responseFacebook(response)
                    }} />
                </div>
                */
      }

      case "register": {
        return (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => props.onClose()}>
              Close
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              Register {registerLoading && <CircularProgress size={15} />}
            </Button>
          </Modal.Footer>
        );

        // return  <div className="form-action" className="col-sm-12">
        //           <button
        //             type="submit"
        //             disabled={ (isEmpty(displayName) && isEmpty(email) && isEmpty(password)) ? true: false }
        //             className={"div-button"} >Register
        //             { registerLoading && <CircularProgress size={15}/> }
        //             </button>
        //         </div>
      }

      case "forgot": {
        return (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => props.onClose()}>
              Close
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              Send {forgotLoading && <CircularProgress size={15} />}
            </Button>
          </Modal.Footer>
        );

        // return<div className="form-action" className="col-sm-12">
        //         <button
        //           type="submit"
        //           disabled={ isEmpty(email) ? true: false }
        //           className={"div-button"} >Send
        //           { forgotLoading && <CircularProgress size={15}/> }
        //         </button>
        //       </div>
      }
    }
  };

  const handleFormSubmit = async (formSubmitEvent) => {
    console.log("handleFormSubmit mode : ", mode);
    formSubmitEvent.preventDefault();

    switch (mode) {
      case "login": {
        let _email = email.trim();
        let _password = password.trim();

        setUserNameOREmailError("");
        setPasswordError("");
        setLoginError("");

        if (isEmpty(_email) && isEmpty(_password)) {
          setUserNameOREmailError("Email is empty.");
          setPasswordError("Password is empty.");
        } else if (isEmpty(_email)) {
          setUserNameOREmailError("Email is empty.");
        } else if (isEmpty(_password)) {
          setPasswordError("Password is empty.");
        } else {
          setLoginLoading(true);
          let response = await axios.post(
            `/v1/login`,
            { email: _email, password: _password },
            {
              headers: {
                Authorization: `Basic ${process.env.REACT_APP_AUTHORIZATION}`,
              },
            }
          );

          response = response.data;

          console.log("/v1/login : response = xx ", response);

          if (response.result) {
            let {
              basic_auth,
              session,
              user,
              contents,
              follows,
              conversations,
              messages,
            } = response.data;

            ls.set("basic_auth", basic_auth);
            ls.set("session", session);

            props.addFriend([user]);

            props.userLogin(user);
            // props.addContentsData(contents)
            props.addFollowsData(follows);

            props.addConversations(conversations);
            props.addMessages(messages);

            props.onClose();

            console.log("/login > user : ", response.data);
            onToast("info", `Welcome to banlist.info`);
          } else {
            setLoginError(response.message);
          }

          setLoginLoading(false);
        }

        break;
      }

      case "register": {
        let flag = true;
        let _displayName = displayName.trim();
        let _email = email.trim();

        let _password = password.trim();
        let _confirmPassword = confirmPassword.trim();

        setRgUsernameError("");
        setRgEmailAddressError("");
        setRgPasswordError("");
        setRgConfirmPasswordError("");

        if (_.isEmpty(_displayName)) {
          flag = false;
          setRgUsernameError("Display name is empty");
        }

        if (_.isEmpty(_email)) {
          flag = false;
          setRgEmailAddressError("Email name is empty");
        }

        if (!_.isEmpty(_email)) {
          if (!isEmailValid(_email)) {
            flag = false;
            setRgEmailAddressError("Email is Invalid.");
          }
        }

        if (_.isEmpty(_password)) {
          flag = false;
          setRgPasswordError("Password is empty");
        }

        if (_.isEmpty(_confirmPassword)) {
          flag = false;
          setRgConfirmPasswordError("Confirm password is empty");
        }

        if (!_.isEmpty(_password) && !_.isEmpty(_confirmPassword)) {
          if (_password !== _confirmPassword) {
            flag = false;
            setRgConfirmPasswordError(
              "Password and Confirm password not match"
            );
          }
        }

        if (flag) {
          // props.onClose()

          /*
          setRegisterLoading(true)
          axios.post(`/api/v1/login`, {
            type: 0,
            name: _displayName,
            email: _email, 
            password: _password,
          })
          .then((response) => {
            let results = response.data
            if(results.result === true){ 
              onToast("info", `Please check email.`)
            }else{
              onToast("error", results.message)
            }

            props.onClose()
    
            setRegisterLoading(false)
    
            console.log('/register > results : ', results)
          })
          .catch((error)=>{
            onToast("error", error)
            setRegisterLoading(false)
          });

          */

          setRegisterLoading(true);

          console.log("/v1/register > start");
          let response = await axios.post(
            `/v1/register`,
            { email: _email, name: _displayName, password: _password },
            {
              headers: {
                Authorization: `Basic ${process.env.REACT_APP_AUTHORIZATION}`,
              },
            }
          );

          console.log("/v1/register > response : ", response);
          response = response.data;

          // setLoginLoading(false)
          if (response.result) {
            setMode("login");

            onToast("info", `Register success`);
          } else {
            // onToast("error", response.message);

            setRgError(response.message);
          }

          setRegisterLoading(false);
        }
        break;
      }

      case "forgot": {
        let _email = email.trim();

        setFgEmailaddressError("");
        if (isEmpty(_email)) {
          // onToast("error", "Email is empty.");
          setFgEmailaddressError("Email is empty.");
        } else if (!isEmailValid(_email)) {
          // onToast("error", "Email is Invalid.");
          setFgEmailaddressError("Email is Invalid.");
        } else {
          /*
          setForgotLoading(true)
          axios.post(`/api/v1/reset_password`, {
            email: _email
          })
          .then((response) => {
            let results = response.data
            if(results.result === true){ 
              onToast("info", `Please check email.`)
            }else{
              onToast("error", results.message)
            }

            props.onClose()
    
            setForgotLoading(false)
          })
          .catch((error)=>{
            onToast("error", error)
            setForgotLoading(false)
          });
          */

          setForgotLoading(true);
          console.log("/api/v1/reset_password > start");
          let response = await axios.post(
            `/api/v1/reset_password`,
            { email: _email },
            {
              headers: {
                Authorization: `Basic ${process.env.REACT_APP_AUTHORIZATION}`,
              },
            }
          );

          console.log("/api/v1/reset_password > response : ", response);
          response = response.data;

          setForgotLoading(false);
        }
        break;
      }
    }
  };

  const responseGoogle = (response) => {
    console.log("responseGoogle :", response);
  };

  const responseFacebook = (response) => {
    console.log("responseFacebook :", response);
  };

  const clickedFacebook = () => {
    console.log("clickedFacebook");
  };

  return (
    <div>
      <Modal
        show={showModal}
        onHide={props.onClose}
        // onSubmit={handleFormSubmit}
        //   bsSize="large"

        backdrop="static"
      >
        {/* <Modal.Header closeButton={true}>
          <h2>
            {mode === "login"
              ? "Login"
              : mode === "register"
              ? "Create new account"
              : "Forgot password"}
          </h2>
        </Modal.Header> */}
        <Modal.Body>{contentBody()}</Modal.Body>

        {/* {contentFooter()} */}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    data: state.app.data,
  };
};

const mapDispatchToProps = {
  userLogin,
  ___followUp,
  fetchMyApps,
  addfollowerPost,

  addMyAppALL,

  addContentsData,
  addFollowsData,

  addConversations,
  addMessages,

  addFriend,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog);
