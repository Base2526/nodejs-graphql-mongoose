import {
  ADD_CONTENTS_DATA,
  UPDATE_APP_FOLLOWER,
  SET_TOTAL_VALUE,
  CLEAR_ALL_CONTENTS_DATA,
  MY_FOLLOW,
  APP_COMMENT,
} from "../constants";

var _ = require("lodash");

const initialState = {
  total_value: 0,
  data: [],
  follows: [],
  comments: [],
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONTENTS_DATA: {
      return { ...state, data: _.unionBy(action.data, state.data, "_id") };
    }

    case UPDATE_APP_FOLLOWER: {
      let state_data = state.data;

      let { nid, app_follower } = action.data;
      let find = state_data.find((o) => o.nid === nid);
      if (!_.isEmpty(find)) {
        if (_.has(find, "app_followers")) {
          let app_followers = find.app_followers;

          let index = _.findIndex(
            app_followers,
            (o) => o.uid === app_follower.uid
          );
          if (index === -1) {
            app_followers = [...app_followers, app_follower];
          } else {
            app_followers = _.map(app_followers, (a) => {
              return a.uid === app_follower.uid ? app_follower : a;
            });
          }

          find = { ...find, app_followers };
        } else {
          find = { ...find, app_followers: [app_follower] };
        }

        let data = _.map(state_data, (a) => {
          return a.nid == nid ? find : a;
        });

        return { ...state, data };
      }
      break;
    } // app_follower

    case SET_TOTAL_VALUE: {
      return { ...state, total_value: action.data };
    }

    case APP_COMMENT: {
      let state_comments = state.comments;
      let action_data = action.data;

      /*
      comments: [{…}]
      _id: 430
      */

      let find = _.find(state_comments, (o) => o._id === action_data._id);

      if (_.isEmpty(find)) {
        let comments = [...state.comments, action_data];
        return { ...state, comments };
      } else {
        let comments = _.map(state_comments, (i, j) => {
          if (i._id == action_data._id) {
            return action_data;
          }
          return i;
        });

        return { ...state, comments };
      }

      /*
      if (!_.isEmpty(find)) {
        find = { ...find, comments: action_data.comments };

        // console.log(
        //   "data > state , action_data, find: ",
        //   // state_data,
        //   // action_data,
        //   find
        // );

        let data = _.map(state_data, (a) => {
          return a.nid == action_data._id ? find : a;
        });

        console.log("data > find : #2", data);

        // return { ...state, data };
      }
      */
      return state;
    }

    case CLEAR_ALL_CONTENTS_DATA: {
      return initialState;
    }

    default:
      return state;
  }

  return state;
};

export default app;
