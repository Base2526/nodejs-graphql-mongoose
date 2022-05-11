import Ajv from "ajv";
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
  ADD_POSTS,
  ADD_POST,
  EDIT_POST,
  DELETE_POST,
  ADD_CONVERSATIONS,
  ADD_CONVERSATION,
  EDIT_CONVERSATION,
  DELETE_CONVERSATION,
} from "../constants";

const _dataUserLogin = (data) => ({
  type: USER_LOGIN,
  data,
});

const _dataUserLogout = (data) => ({
  type: USER_LOGOUT,
  data,
});

const _fetchProfile = (data) => ({
  type: FETCH_PROFILE,
  data,
});

const _dataFollowup = (data) => ({
  type: FOLLOW_UP,
  data,
});

/*
Mode
 0 : single
 1 : multi
*/
const ___dataFollowup = (data, mode) => ({
  type: ___FOLLOW_UP,
  data,
  mode,
});

const _fetchMyApps = (data) => ({
  type: FETCH_MY_APPS,
  data,
});

const _addHistory = (data) => ({
  type: ADD_HISTORY,
  data,
});

const _deleteHistory = (data) => ({
  type: DELETE_HISTORY,
  data,
});

const _deleteHistoryAll = (data) => ({
  type: DELETE_HISTORY_ALL,
  data,
});

// ADD_FOLLOWER_POST
const _addfollowerPost = (data) => ({
  type: ADD_FOLLOWER_POST,
  data,
});

// FOLLOWER_POST
const _followerPost = (data) => ({
  type: FOLLOWER_POST,
  data,
});

// NET_INFO
const _netInfo = (data) => ({
  type: NET_INFO,
  data,
});

const _notifications = (data) => ({
  type: NOTIFICATIONS,
  data,
});

const _loading_overlay = (data) => ({
  type: LOADING_OVERLAY,
  data,
});

//
const _clear_cached = (data) => ({
  type: CLEAR_CACHED,
  data,
});

const _addFollowsData = (data) => ({
  type: ADD_FOLLOWS_DATA,
  data,
});

const _addFollowData = (data) => ({
  type: ADD_FOLLOW_DATA,
  data,
});

const _addPosts = (data) => ({
  type: ADD_POSTS,
  data,
});

const _addPost = (data) => ({
  type: ADD_POST,
  data,
});

const _editPost = (data) => ({
  type: EDIT_POST,
  data,
});

const _deletePost = (data) => ({
  type: DELETE_POST,
  data,
});

///

/*
export const ADD_CONVERSATIONS = "ADD_CONVERSATIONS";
export const ADD_CONVERSATION = "ADD_CONVERSATION";
export const EDIT_CONVERSATION = "EDIT_CONVERSATION";
export const DELETE_CONVERSATION = "DELETE_CONVERSATION";
*/

const _addConversations = (data) => ({
  type: ADD_CONVERSATIONS,
  data,
});

const _addConversation = (data) => ({
  type: ADD_CONVERSATION,
  data,
});

const _editConversation = (data) => ({
  type: EDIT_CONVERSATION,
  data,
});

const _deleteConversation = (data) => ({
  type: DELETE_CONVERSATION,
  data,
});

///

export const userLogin = (data) => (dispatch) => {
  const schema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      account_name: { type: "string" },
      display_name: { type: "string" },
      // pass: { type: "string" },
      email: { type: "string" },
      gender: { type: "string" },
      type_login: { type: "string" },
      image_url: { type: "string" },
      status: { type: "string" },
    },
    required: ["_id", "email"],
    // additionalProperties: false,
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  console.log("userLogin : >> ", data);
  if (validate(data)) {
    dispatch(_dataUserLogin(data));
  } else {
    console.log("Ajv invalid userLogin : ", data);
  }
};

export const userLogout = () => (dispatch) => {
  dispatch(_dataUserLogout({}));
};

export const fetchProfile = (basic_auth) => (dispatch) => {
  // axios.post(`${API_URL}/api/fetch_profile?_format=json`, {}, {
  //   headers: {
  //     'Authorization': `Basic ${basic_auth}`
  //   }
  // })
  // .then(function (response) {
  //   let results = response.data
  //   console.log('updateProfile : ', results)
  //   if(results.result){
  //     let {profile} = results
  //     dispatch(_fetchProfile(profile));
  //   }
  // })
  // .catch(function (error) {
  //   console.log(error)
  // });
};

export const followUp = (data) => (dispatch) => {
  dispatch({ type: FOLLOW_UP, data });
};

export const ___followUp = (data, mode) => (dispatch) => {
  dispatch(___dataFollowup(data, mode));
};

// export const addMyApps = (data) => dispatch => {
//   dispatch({ type: ADD_MY_APPS, data });
// }

export const fetchMyApps = (basic_auth) => (dispatch) => {
  // axios.post(`${API_URL}/api/fetch_mypost?_format=json`, {}, {
  //   headers: {
  //     'Authorization': `Basic ${basic_auth}`
  //   }
  // })
  // .then(function (response) {
  //   let results = response.data
  //   if(results.result){
  //     let {datas} = results
  //     dispatch(_fetchMyApps(datas.map(function (my_app) {return my_app.id})));
  //   }
  // })
  // .catch(function (error) {
  //   console.log(error)
  // });
};

export const addHistory = (data) => (dispatch) => {
  const schema = {
    type: "object",
    properties: {
      search_text: { type: "string" },
      search_category: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: ["search_text"],
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addHistory(data));
  } else {
    console.log("Ajv invalid addHistory : ", data);
  }
};

export const deleteHistory = (data) => (dispatch) => {
  const schema = {
    properties: {
      search_text: { type: "string" },
    },
    required: ["search_text"],
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_deleteHistory(data));
  } else {
    console.log("Ajv invalid deleteHistory : ", data);
  }
};

export const deleteHistoryAll = (data) => (dispatch) => {
  dispatch(_deleteHistoryAll(data));
};

export const addfollowerPost = (data) => (dispatch) => {
  dispatch(_addfollowerPost(data));
};

export const followerPost = (data) => (dispatch) => {
  dispatch(_followerPost(data));
};

export const netInfo = (data) => (dispatch) => {
  dispatch(_netInfo(data));
};

export const onNotifications = (data) => (dispatch) => {
  dispatch(_notifications(data));
};

// const _loading_overlay = data => ({
//   type: LOADING_OVERLAY,
//   data,
// });
export const loadingOverlay = (data) => (dispatch) => {
  dispatch(_loading_overlay(data));
};

export const clearCached = (data) => (dispatch) => {
  dispatch(_clear_cached(data));
};

export const addFollowsData = (data) => (dispatch) => {
  var innerSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      status: { type: "boolean" },
      local: { type: "boolean" },
    },
    required: ["_id", "status", "local"],
  };

  const schema = {
    type: "array",
    items: innerSchema,
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addFollowsData(data));
  } else {
    console.log("Ajv invalid addFollowsData : ", data);
  }
};

export const addFollowData = (data) => (dispatch) => {
  const schema = {
    properties: {
      _id: { type: "string" },
      status: { type: "boolean" },
      local: { type: "boolean" },
    },
    required: ["_id", "status", "local"],
    additionalProperties: true,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addFollowData(data));
  } else {
    console.log("Ajv invalid addFollowData : ", data);
  }
};

export const addPosts = (data) => (dispatch) => {
  var innerSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      owner_id: { type: "string" },
      title: { type: "string" },
      status: { type: "boolean" },
    },
    required: ["_id", "owner_id", "title", "status"],
  };

  const schema = {
    type: "array",
    items: innerSchema,
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addPosts(data));
  } else {
    console.log("Ajv invalid addPosts : ", data);
  }
};

export const addPost = (data) => (dispatch) => {
  const schema = {
    properties: {
      _id: { type: "string" },
      owner_id: { type: "string" },
      title: { type: "string" },
      status: { type: "boolean" },
    },
    required: ["_id", "owner_id", "title", "status"],
    additionalProperties: true,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addPost(data));
  } else {
    console.log("Ajv invalid addPost : ", data);
  }
};

export const editPost = (data) => (dispatch) => {
  const schema = {
    properties: {
      _id: { type: "string" },
      owner_id: { type: "string" },
      title: { type: "string" },
      status: { type: "boolean" },
    },
    required: ["_id", "owner_id", "title", "status"],
    additionalProperties: true,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_editPost(data));
  } else {
    console.log("Ajv invalid editPost : ", data);
  }
};

export const deletePost = (data) => (dispatch) => {
  const schema = {
    properties: {
      _id: { type: "string" },
    },
    required: ["_id"],
    additionalProperties: true,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_deletePost(data));
  } else {
    console.log("Ajv invalid deletePost : ", data);
  }
};

export const addConversations = (data) => (dispatch) => {
  var innerSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
    },
    required: ["_id"],
  };

  const schema = {
    type: "array",
    items: innerSchema,
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addConversations(data));
  } else {
    console.log("Ajv invalid addConversations : ", data);
  }
};

export const addConversation = (data) => (dispatch) => {
  const schema = {
    properties: {
      _id: { type: "string" },
    },
    required: ["_id"],
    additionalProperties: true,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addConversation(data));
  } else {
    console.log("Ajv invalid addConversation : ", data);
  }
};

export const editConversation = (data) => (dispatch) => {
  const schema = {
    properties: {
      _id: { type: "string" },
      owner_id: { type: "string" },
      title: { type: "string" },
      status: { type: "boolean" },
    },
    required: ["_id", "owner_id", "title", "status"],
    additionalProperties: true,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_editConversation(data));
  } else {
    console.log("Ajv invalid editConversation : ", data);
  }
};

export const deleteConversation = (data) => (dispatch) => {
  const schema = {
    properties: {
      _id: { type: "string" },
    },
    required: ["_id"],
    additionalProperties: true,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_deleteConversation(data));
  } else {
    console.log("Ajv invalid deleteConversation : ", data);
  }
};
