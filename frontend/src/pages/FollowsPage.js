import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ls from "local-storage";
import UseFollowsItem from "./UseFollowsItem";
import { followUp } from "../actions/user";

import { addContentsData } from "../actions/app";
import { addFollowsData } from "../actions/user";

import history from "../history";

var _ = require("lodash");

let {
  REACT_APP_DEBUG,
  REACT_APP_VERSIONS,
  REACT_APP_URL_SERVER,
  REACT_APP_GEOLOCATION,
  REACT_APP_AUTHORIZATION,
  REACT_APP_AXIOS_TIMEOUT,
} = process.env;

const FollowsPage = (props) => {
  const history = useHistory();

  const [datas, setDatas] = useState([]);

  useEffect(() => {
    // fetch()

    if (_.isEmpty(props.user)) {
      history.push({ pathname: `/`, state: {} });
      return;
    }

    return () => {
      setDatas([]);
    };
  }, []);

  useEffect(async () => {
    try {
      let follows = props.follows;

      if (_.isEmpty(follows)) {
        history.push("/");
        return;
      }

      let nids = JSON.stringify(
        _.map(follows, (o) => {
          if (o.status) return o._id;
        }).filter((o) => o !== undefined)
      );

      let response = await axios.post(
        REACT_APP_DEBUG ? "/v1/search" : REACT_APP_URL_SERVER + "/v1/search",
        {
          type: 3,
          key_word: nids,
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
      if (response.result) {
        setDatas(response.datas);
      }
    } catch (err) {
      console.log(err);
    }
  }, [props.follows]);

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

  return (
    <div>
      <h1>Your follows ({datas.length})</h1>
      {datas.map((item) => {
        return (
          <UseFollowsItem
            {...props}
            item={item}
            updateState={updateState}
            // onModalConfirmDelete={onModalConfirmDelete}
            // onModalConfirmUpdateStatus={onModalConfirmUpdateStatus}
          />
        );
      })}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  console.log("state.user :", state.user);
  return {
    user: state.user.data,
    datas: state.app.data,
    follows: state.user.follows,
    maintenance: state.setting.maintenance,
  };
};

const mapDispatchToProps = {
  followUp,

  addContentsData,
  addFollowsData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowsPage);
