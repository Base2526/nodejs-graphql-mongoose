import {
  USER_LOGIN,
  USER_LOGOUT,
  FETCH_PROFILE,
  FOLLOW_UP,
  ___FOLLOW_UP,
  FETCH_MY_APPS,
  ADD_HISTORY,
  DELETE_HISTORY,
  DELETE_HISTORY_ALL,
  ADD_FOLLOWER_POST,
  FOLLOWER_POST,
  NET_INFO,
  NOTIFICATIONS,
  LOADING_OVERLAY,
  CLEAR_CACHED,
  ADD_FOLLOWS_DATA,
  ADD_FOLLOW_DATA,
  ADD_MY_APPS,
  ADD_POSTS,
  ADD_POST,
  EDIT_POST,
  DELETE_POST,
  ADD_CONVERSATIONS,
  ADD_CONVERSATION,
  EDIT_CONVERSATION,
  DELETE_CONVERSATION,
} from "../constants";
import { isEmpty } from "../utils";
var _ = require("lodash");

export const mergeArrays = (...arrays) => {
  let jointArray = [];

  arrays.forEach((array) => {
    jointArray = [...jointArray, ...array];
  });
  const uniqueArray = jointArray.reduce((newArray, item) => {
    if (newArray.includes(item)) {
      return newArray;
    } else {
      return [...newArray, item];
    }
  }, []);
  return uniqueArray;
};

export const mergeArraysId = (...arrays) => {
  let jointArray = [];

  arrays.forEach((array) => {
    jointArray = [...jointArray, ...array];
  });
  const uniqueArray = jointArray.reduce((newArray, item) => {
    let found = newArray.find(({ id }) => id === item.id);
    if (found) {
      return newArray;
    } else {
      return [...newArray, item];
    }
  }, []);
  return uniqueArray;
};

const initialState = {
  data: {},
  profile: [],
  follow_ups: [],
  ___follow_ups: [],
  // my_apps: [],
  historys: [],
  follower_post: [],

  net_info: {},

  notifications: [],

  is_loading_overlay: false,

  posts: [],
  follows: [],

  converstions: [], // CONVERSATIONS
};

const user = (state = initialState, action) => {
  // console.log("user >>>>> ", action.type, action.data);
  switch (action.type) {
    case USER_LOGIN: {
      return { ...state, data: action.data };
    }

    case USER_LOGOUT: {
      return initialState;
    }

    case CLEAR_CACHED: {
      return initialState;
    }

    case FETCH_PROFILE: {
      return { ...state, data: { ...state.data, ...action.data } };
    }

    case FOLLOW_UP: {
      let follow_ups = state.follow_ups;
      let data = action.data;
      if (isEmpty(follow_ups.find((item) => item.id === data.id))) {
        follow_ups = [
          ...follow_ups,
          {
            id: data.id,
            local: true,
            status: true,
            owner_id: data.owner_id,
            date: Date.now(),
          },
        ];
      } else {
        follow_ups = follow_ups.map((el) =>
          el.id === data.id ? { ...el, status: !el.status } : el
        );
      }
      /*
       ___followUp({"id": item.id, 
                              "local": true, 
                              "follow_up": follow_up, 
                              "unique_id": getUniqueId(), 
                              "owner_id": item.owner_id, 
                              "date": Date.now()}, 0);
      */
      return { ...state, follow_ups };
    }

    case ___FOLLOW_UP: {
      if (action.mode == 0) {
        let ___follow_ups = mergeArraysId([action.data], state.___follow_ups);
        return {
          ...state,
          ___follow_ups,
        };
      } else if (action.mode == 1) {
        let ___follow_ups = mergeArraysId(action.data, state.___follow_ups);
        return {
          ...state,
          ___follow_ups,
        };
      }
      return state;
    }

    case NOTIFICATIONS: {
      let notifications = mergeArraysId(action.data, state.notifications);
      return {
        ...state,
        notifications,
      };
    }

    case ADD_POSTS: {
      return { ...state, posts: action.data };
    }

    case ADD_POST: {
      return { ...state, posts: [...state.posts, action.data] };
    }

    case EDIT_POST: {
      let posts = _.map(state.posts, (im, k) => {
        return im._id === action.data._id ? action.data : im;
      });
      return { ...state, posts };
    }

    case DELETE_POST: {
      let posts = _.filter(state.posts, (im, k) => {
        return im._id !== action.data._id;
      });

      return { ...state, posts };
    }

    /*
    ,
  ,
  ,
  ,

  
    */

    case ADD_CONVERSATIONS: {
      //

      console.log("ADD_CONVERSATIONS : ", action.data, state);
      return { ...state, converstions: action.data };
    }

    case ADD_CONVERSATION: {
      // return { ...state, data: _.unionBy(action.data, state.data, "_id") };
      console.log(
        "ADD_CONVERSATION : ",
        _.unionBy([action.data], state.converstions, "_id")
      );
      // return { ...state, converstions: [...state.converstions, action.data] };

      return state;
    }

    case EDIT_CONVERSATION: {
      let converstions = _.map(state.converstions, (im, k) => {
        return im._id === action.data._id ? action.data : im;
      });
      return { ...state, converstions };
    }

    case DELETE_CONVERSATION: {
      let converstions = _.filter(state.converstions, (im, k) => {
        return im._id !== action.data._id;
      });

      return { ...state, converstions };
    }

    // case FETCH_MY_APPS: {
    //   return {
    //     ...state, my_apps: action.data
    //   }
    // }

    case ADD_HISTORY: {
      let historys = state.historys.filter((item) => {
        return item.search_text !== action.data.search_text;
      });
      historys.splice(0, 0, action.data);

      return { ...state, historys };
    }

    case DELETE_HISTORY: {
      let historys = state.historys.filter((item) => {
        return item.search_text !== action.data.search_text;
      });
      return { ...state, historys };
    }

    case DELETE_HISTORY_ALL: {
      return { ...state, historys: [] };
    }

    case ADD_FOLLOWER_POST: {
      return { ...state, follower_post: action.data };
    }

    case FOLLOWER_POST: {
      let follower_post = state.follower_post.filter((item) => {
        return item.post_id !== action.data.post_id;
      });
      return { ...state, follower_post: [...follower_post, action.data] };
    }

    case NET_INFO: {
      return { ...state, net_info: action.data };
    }

    case LOADING_OVERLAY: {
      return { ...state, is_loading_overlay: action.data };
    }

    case ADD_FOLLOWS_DATA: {
      // console.log('state.follows > ', state.follows, action.data)
      // let merged = _.merge(_.keyBy(state.follows, 'nid'), _.keyBy(action.data, 'nid'));
      return { ...state, follows: action.data };
    }

    case ADD_FOLLOW_DATA: {
      let state_follows = state.follows;
      let action_data = action.data;

      let follows = [];
      if (!_.isEmpty(state_follows)) {
        let find = state_follows.find((o) => o._id === action_data._id);

        if (_.isEmpty(find)) {
          follows = [...state_follows, action_data];
        } else {
          follows = _.map(state_follows, function (o) {
            return o._id === action_data._id ? action_data : o;
          });
        }
      } else {
        follows = [action_data];
      }

      console.log("ADD_FOLLOW_DATA : ", follows);
      return { ...state, follows };
    }

    default:
      return state;
  }

  return state;
};

export default user;
