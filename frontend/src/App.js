import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Router, Route, Switch } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { ToastContainer, toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay-ts";
import io from "socket.io-client";
import { CacheSwitch, CacheRoute } from "react-router-cache-route";
import axios from "axios";
import { Base64 } from "js-base64";
import ls from "local-storage";
import { deviceDetect } from "react-device-detect";
import HeaderBar from "./components/HeaderBar";
import Breadcrumb from "./components/Breadcrumb";
import Footer from "./components/Footer";
import routes from "./routes";
import ScrollToTopBtn from "./components/ScrollToTopBtn";
import { addMyApp, updateMyApp, deleteMyApp } from "./actions/my_apps";
import { onMyFollowALL, onMyFollowUpdateStatus } from "./actions/my_follows";
import { onConnect, onDisconnect } from "./actions/socket";

import {
  userLogin,
  userLogout,
  addFollowData,
  addConversation,
} from "./actions/user";
import { addMessage } from "./actions/messages";
import { addFriend } from "./actions/friends";
import { setMaintenance } from "./actions/setting";
import history from "./history";
import { socketIO } from "./SocketioClient";

var _ = require("lodash");

var socket = undefined;
let interval = undefined;

const App = (props) => {
  const [maintenance, setMaintenance] = useState(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  const [isConnect, setIsConnect] = useState(false);

  useEffect(() => {
    console.log("process.env :", process.env);
    checkLocalStorage();

    setMaintenance(false);

    ////
    // let merged = _.merge(
    //   _.keyBy(
    //     [
    //       { _id: 1, text: 1 },
    //       { _id: 2, text: 2 },
    //     ],
    //     "_id"
    //   ),
    //   _.keyBy(
    //     [
    //       { _id: 1, text: 999 },
    //       // { _id: 4, text: 4 },
    //     ],
    //     "_id"
    //   )
    // );

    //   console.log("ADD_FRIEND :: ", action.data, _.values(merged), merged);

    // return { ...state, data: _.values(merged) };

    // console.log("_.values(merged)", _.values(merged));
    ////
    return () => {
      setMaintenance();
      setIsLoadingOverlay(false);

      //-------------- socket.io
      socket.off("connect", onConnect);
      socket.off("uniqueID", onUniqueID);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", handleErrors);
      socket.off("connect_failed", handleErrors);
      socket.off("onSyc", handleSyc);

      socket.off("onUser", onUser);
      socket.off("onProfile", onProfile);
      socket.off("onContent", onContent);
      socket.off("onMyFollows", onMyFollows);
      socket.off("test", test);
      socket.off("onAppFollowers", onAppFollowers);
      //-------------- socket.io

      socket = undefined;
      interval = undefined;
    };
  }, []);

  useEffect(() => {
    setMaintenance(props.maintenance);
  }, [props.maintenance]);

  useEffect(() => {
    console.log("props.user >> is_loading_overlay", props.user);
    setIsLoadingOverlay(props.is_loading_overlay);
  }, [props.is_loading_overlay]);

  useEffect(async () => {
    // console.log('socketid() > [props.user] #0 > ', props.user , socket )

    // if( !_.isEmpty(socket) ){
    //   socket.disconnect()
    //   socket = null;
    // }
    // socketid()

    // socketid();

    console.log("props.user >>", props.user);
  }, [props.user]);

  useEffect(async () => {
    if (_.isEmpty(interval)) {
      clearInterval(interval);

      interval = undefined;
    }

    // console.log('useEffect [props.follows] #1: ')

    let { user, follows } = props;
    // console.log("useEffect [props.follows] #2:", user, _.isEmpty(user), props)
    if (!_.isEmpty(user)) {
      if (_.isEmpty(follows)) {
        return;
      }

      let filter_follow_ups = follows.filter((im) => im.local);

      console.log("useEffect [props.follows] #3:", filter_follow_ups);
      if (!_.isEmpty(filter_follow_ups)) {
        interval = setInterval(
          async (props) => {
            let { user, follows } = props;

            let response = await axios.post(
              `/v1/syc_local`,
              {
                follows: JSON.stringify(follows),
              },
              // { headers: { Authorization: `Basic ${ls.get("basic_auth")}` } }

              {
                headers: {
                  Authorization: _.isEmpty(ls.get("basic_auth"))
                    ? `Basic ${process.env.REACT_APP_AUTHORIZATION}`
                    : ls.get("basic_auth"),
                },
              }
            );

            response = response.data;
            console.log("/v1/syc_local : ", response);

            if (response.result) {
              // props.onMyFollowUpdateStatus({})
            }

            clearInterval(interval);
          },
          2000,
          props
        );
      } else {
        console.log("useEffect [props.follows] #5:");
      }
    } else {
      console.log("useEffect [props.follows] #6:");
    }
  }, [props.follows]);

  useEffect(async () => {
    if (_.isEmpty(socket)) {
      return;
    }

    _.map(props.friends, (item) => {
      if (!_.isEmpty(props.user)) {
        if (props.user._id == item._id) {
          return;
        }
      }

      socket.on(`user-${item._id}`, sycUser);
    });

    return () => {
      _.map(props.friends, (item) => {
        if (!_.isEmpty(props.user)) {
          if (props.user._id == item._id) {
            return;
          }
        }
        socket.off(`user-${item._id}`);
      });
    };
  }, [props.friends, isConnect]);

  useEffect(async () => {
    console.log("App, props.user : ", props, isConnect);
    if (_.isEmpty(socket)) {
      return;
    }

    if (_.isEmpty(props.user)) {
      return;
    }

    socket.on(`user-${props.user._id}`, sycUser);
    return () => {
      if (!_.isEmpty(socket)) {
        socket.off(`user-${props.user._id}`);
      }
    };
  }, [props.user, isConnect]);

  useEffect(() => {
    if (_.isEmpty(socket)) {
      return;
    }

    console.log("converstions : #1 ", props.converstions);

    if (_.isEmpty(props.user)) {
      return;
    }

    console.log("converstions : #2 ", props.converstions);

    _.map(props.converstions, (item) => {
      socket.on(`converstions-${item._id}`, sycConverstions);
    });

    return () => {
      // socket.off(`user-${props.user._id}`);
      _.map(props.converstions, (item) => {
        if (!_.isEmpty(socket)) {
          socket.off(`converstions-${item._id}`);
        }
      });
    };
  }, [props.converstions, isConnect]);

  const sycUser = (i) => {
    // console.log("sycUser :", i);
    // user

    switch (i.type) {
      case "user": {
        switch (i.operation_type) {
          case "insert":
          case "update":
          case "replace": {
            console.log("sycUser : ", i);

            if (!_.isEmpty(props.user) && i.data._id == props.user._id) {
              props.userLogin(i.data);
            }
            //
            props.addFriend([i.data]);
            break;
          }
        }

        break;
      }
    }
  };

  const sycConverstions = (i) => {
    console.log("sycConverstions :", i);
    switch (i.type) {
      case "converstion": {
        switch (i.operation_type) {
          case "insert":
          case "update":
          case "replace": {
            console.log("sycConverstions, converstion : ", i);

            // find profile friend
            _.map(i.data.members, async (_id, index) => {
              if (!_.isEmpty(props.user)) {
                if (_id != props.user._id) {
                  let profile_friend = _.find(
                    props.friends,
                    (item) => item._id == _id
                  );

                  if (_.isEmpty(profile_friend)) {
                    try {
                      let response = await axios.post(
                        `/v1/friend`,
                        {
                          _id,
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
                      if (response.result) {
                        props.addFriend([response.data]);
                      }
                    } catch (e) {
                      console.log("Error", e.message);
                    }
                  }
                }
              }
            });

            props.addConversation(i.data);
            break;
          }
        }

        break;
      }

      case "message": {
        switch (i.operation_type) {
          case "insert":
          case "update":
          case "replace": {
            console.log("sycConverstions,  message :", i);
            props.addMessage(i.data);
            break;
          }
        }
        break;
      }
    }
  };

  const checkLocalStorage = () => {
    // http://apassant.net/2012/01/16/timeout-for-html5-localstorage/

    var hours = 4; // Reset when storage is more than 24hours
    var now = new Date().getTime();
    var setupTime = localStorage.getItem("setupTime");
    if (setupTime == null) {
      localStorage.setItem("setupTime", now);
    } else {
      if (now - setupTime > hours * 60 * 60 * 1000) {
        // localStorage.clear()

        localStorage.removeItem("geolocation");

        localStorage.setItem("setupTime", now);
      }
    }
  };

  const geolocation = async () => {
    let data = JSON.parse(localStorage.getItem("geolocation"));
    if (_.isEmpty(data)) {
      const res = await axios.get(process.env.REACT_APP_GEOLOCATION);
      if (res.status === 200) {
        data = res.data;
      }

      localStorage.setItem("geolocation", JSON.stringify(data));
    }
    return data;
  };

  const socketid = async () => {
    // console.log('process.env :', process.env, ', props : ', props, ', geolocation : ', await geolocation())

    /*
    if(_.isEmpty(socket)){
      socket = io( "/", 
        // { headers:  {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`} },
        
        // {
        //   auth: {
        //     token: "abcd"
        //   }
        // },
        { 
          // path: '/mysocket',
          // 'sync disconnect on unload': false,
          'sync disconnect on unload': true,
          query: {
            // "platform" : process.env.REACT_APP_PLATFORM, 
            // "unique_id": _uniqueId(props),
            "version"  : process.env.REACT_APP_VERSIONS,
            "device_detect" : JSON.stringify( deviceDetect() ),
            "geolocation" : JSON.stringify( await geolocation() ),
            auth_token: _.isEmpty(props.user) ? 0 : props.user.uid
          },
          // transports: ["websocket"]
        },
        // { transports: ["websocket"] }
      );
    }              
    
    if (socket.connected === false && socket.connecting === false) {
      // use a connect() or reconnect() here if you want
      socket.connect()
      console.log('reconnected!');

      socket.off('connect', onConnect)
      socket.off("uniqueID", onUniqueID);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', handleErrors);
      socket.off('connect_failed', handleErrors);
      socket.off('onSyc', handleSyc);

      socket.off('onUser', onUser);
      socket.off('onProfile', onProfile);
      socket.off('onContent', onContent);
      socket.off('onMyFollows', onMyFollows);
      socket.off('test', test);
      socket.off('onAppFollowers', onAppFollowers)
    }else{
      // console.log('socket :', socket)
    }
    */

    socket = await socketIO(props);

    console.log("socket : ", socket);

    socket.on("connect", onConnect);
    socket.on("uniqueID", onUniqueID);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", handleErrors);
    socket.on("connect_failed", handleErrors);
    socket.on("onSyc", handleSyc);

    socket.on("onUser", onUser);
    socket.on("onProfile", onProfile);
    socket.on("onContent", onContent);
    socket.on("onMyFollows", onMyFollows);
    socket.on("test", test);
    socket.on("onAppFollowers", onAppFollowers);

    socket.io.on("ping", () => {
      // ...
      // console.log('ping')
    });
  };

  const handleSyc = (i) => {
    console.log("handleSyc :", i);

    switch (i.type) {
      /*
      case "user": {
        let { operation_type } = i;

        switch (operation_type) {
          case "delete": {
            ls.remove("basic_auth");
            ls.remove("session");

            socket.disconnect();
            props.userLogout();

            history.push("/");
            break;
          }
        }
        break;
      }
      */

      case "follows": {
        let { operation_type, data } = i;

        switch (operation_type) {
          // case 'insert':{
          //   break;
          // }

          case "insert":
          case "replace":
          case "update": {
            console.log("handleSyc :", operation_type, i);
            props.addFollowData(data);
            break;
          }
        }

        break;
      }

      /*
      case "setting": {
        let { operation_type, datas } = i;

        switch (operation_type) {
          case "maintenance": {
            props.setMaintenance(false);
            break;
          }
        }
        break;
      }

      case "message": {
        let { operation_type, datas } = i;

        switch (operation_type) {
          // case 'insert':{
          //   break;
          // }

          case "insert":
          case "replace":
          case "update": {
            props.addMessage(datas);

            // console.log()
            break;
          }
        }
      }
      */
    }
  };

  const test = (data) => {
    console.log("test :", data);
  };

  const handleErrors = (err) => {
    console.log("connect_error + connect_failed", err);
  };

  const onConnect = () => {
    console.log("Socket io, connent!");

    props.onConnect({ connected: socket.connected });

    // props.setMaintenance(false)

    setIsConnect(true);
  };

  const onDisconnect = () => {
    console.log("Socket io, disconnect!");

    props.onDisconnect();

    setIsConnect(false);

    // props.setMaintenance(true)
  };

  const onUniqueID = (data) => {
    // console.log("unique_id :", data)
    // ls.set('socketIO', JSON.stringify(data))
    // var socketIO = ls.get('socketIO')
    // console.log("socketIO :", socketIO)
  };

  const onUser = (data) => {
    console.log("onUser :", data);

    /*
    try {
      let mode = data.mode
      console.log("onUser mode", mode)
      switch(mode){
        case 'delete':{
          socket.disconnect();

          console.log('------------- disconnect ------------- #4')

          ls.remove('basic_auth')
          ls.remove('session')
          props.userLogout()

          console.log("onUser ok",)
          break;
        }
      }
    } catch (error) {
      // Catch internal functions, variables and return (jsx) errors.
      // You can also create a lib to log the error to an error reporting service
      // and use it here.
      console.log("onUser error :", error)
    }

    */
    // mode: "delete"
  };

  const onProfile = (data) => {
    props.userLogin(data);
  };

  const onContent = (data) => {
    console.log("onContent :", data);

    // mode: "edit", nid: "104"}

    try {
      let mode = data.mode;
      console.log("onContent mode", mode);
      switch (mode) {
        case "add": {
          console.log("onContent add");
          props.addMyApp(data);
          break;
        }
        case "edit": {
          console.log("onContent edit");
          props.updateMyApp(data);
          break;
        }
        case "delete": {
          console.log("onContent delete");
          props.deleteMyApp(data);
          break;
        }
      }
    } catch (error) {
      // Catch internal functions, variables and return (jsx) errors.
      // You can also create a lib to log the error to an error reporting service
      // and use it here.
      console.log("onContent error :", error);
    }
  };

  const onMyFollows = (data) => {
    try {
      console.log("MY_FOLLOW_ALL : ", data);

      props.onMyFollowALL(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onAppFollowers = (data) => {
    console.log("onAppFollowers : ", data);

    // props.onMyFollowALL(data)
  };

  const onMaintenance = () => {
    return (
      <div>
        We’ll be back soon! Sorry for the inconvenience but we’re performing
        some maintenance at the moment. We’ll be back online shortly!
      </div>
    );
  };

  const onMainView = () => {
    return (
      <div>
        <Container>
          <ToastContainer />
          <CacheSwitch>
            {routes.map(({ path, name, Component }, key) => {
              return (
                <CacheRoute
                  exact
                  path={path}
                  key={key}
                  render={(props) => {
                    console.log("props : ", props);
                    /*
                    const crumbs = routes
                      // Get all routes that contain the current one.
                      .filter(({ path }) => props.match.path.includes(path))
                      // Swap out any dynamic routes with their param values.
                      // E.g. "/pizza/:pizzaId" will become "/pizza/1"
                      .map(({ path, ...rest }) => ({
                        path: Object.keys(props.match.params).length
                          ? Object.keys(props.match.params).reduce(
                              (path, param) =>
                                path.replace(
                                  `:${param}`,
                                  props.match.params[param]
                                ),
                              path
                            )
                          : path,
                        ...rest,
                      }));

                    // if(this.props.logged_in){
                    //   connect_socketIO(this.props)
                    // }

                    // console.log();
                    // console.log(`Generated crumbs for ${props.match.path}`);
                    crumbs.map(
                      ({ name, path }) => {}
                      //  console.log({ name, path })
                    );
                    */
                    return (
                      <div className="bg-gray25">
                        <div className="container">
                          <div className="row">
                            {/* <Breadcrumb crumbs={crumbs} /> */}
                          </div>

                          <Component {...props} />

                          <ScrollToTopBtn />
                        </div>
                      </div>
                    );
                  }}
                />
              );
            })}{" "}
          </CacheSwitch>
        </Container>
        <Footer />
      </div>
    );
  };

  return (
    <Router history={history}>
      <LoadingOverlay
        active={isLoadingOverlay}
        spinner
        text="Please wait a moment"
      >
        <div className="App">
          <HeaderBar {...props} />
          {/* { console.log('maintenance :', maintenance) } */}
          {maintenance ? onMaintenance() : onMainView()}
        </div>
      </LoadingOverlay>
    </Router>
  );
};

const mapStateToProps = (state, ownProps) => {
  console.log("App :", state);
  return {
    user: state.user.data,
    my_apps: state.my_apps.data,
    follow_ups: state.user.follow_ups,

    my_follows: state.my_follows.data,

    follows: state.user.follows,

    is_loading_overlay: state.user.is_loading_overlay,

    maintenance: state.setting.maintenance,

    friends: state.friends.data,

    converstions: state.user.converstions,
  };
};

const mapDispatchToProps = {
  userLogin,
  userLogout,

  addMyApp,
  updateMyApp,
  deleteMyApp,
  onMyFollowALL,
  onMyFollowUpdateStatus,

  onConnect,
  onDisconnect,

  addFollowData,
  setMaintenance,

  addMessage,

  addFriend,

  addConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
