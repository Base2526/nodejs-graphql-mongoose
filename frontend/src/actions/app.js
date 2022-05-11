import Ajv from "ajv";
import {
  ADD_CONTENTS_DATA,
  UPDATE_APP_FOLLOWER,
  SET_TOTAL_VALUE,
  CLEAR_ALL_CONTENTS_DATA,
  APP_COMMENT,
} from "../constants";

const _addContentsData = (data) => ({
  type: ADD_CONTENTS_DATA,
  data,
});

const _setTotalValue = (data) => ({
  type: SET_TOTAL_VALUE,
  data,
});

const _clearAllContentsData = () => ({
  type: CLEAR_ALL_CONTENTS_DATA,
});

const _updateAppFollower = (data) => ({
  type: UPDATE_APP_FOLLOWER,
  data,
});

const _addComment = (data) => ({
  type: APP_COMMENT,
  data,
});

export const addContentsData = (data) => (dispatch) => {
  var innerSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      owner_id: { type: "string" },
      // ref: { type: "string" },
      title: { type: "string" },
      status: { type: "boolean" },
    },
    required: ["_id", "owner_id", /*"ref",*/ "title", "status"],
  };

  const schema = {
    type: "array",
    items: innerSchema,
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addContentsData(data));
  } else {
    console.log("Ajv invalid addContentsData : ", data);
  }
};

export const setTotalValue = (data) => (dispatch) => {
  const schema = {
    type: "integer",
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_setTotalValue(data));
  } else {
    console.log("Ajv invalid setTotalValue : ", data);
  }
};

export const clearAllContentsData = () => (dispatch) => {
  dispatch(_clearAllContentsData());
};

export const updateAppFollower = (data) => (dispatch) => {
  dispatch(_updateAppFollower(data));
};

export const addComment = (data) => (dispatch) => {
  var innerSchema = {
    type: "object",
    properties: {
      avatarUrl: { type: "string" },
      fullName: { type: "string" },
      comId: { type: "string" },
      text: { type: "string" },
      userId: { type: "string" },
    },
    required: ["avatarUrl", "fullName", "comId", "text", "userId"],
  };

  const schema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      comments: {
        type: "array",
        items: innerSchema,
      },
    },
    required: ["_id"],
    additionalProperties: false,
  };

  // nodeId: 427, comments: Array(1)}

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addComment(data));
  } else {
    console.log("Ajv invalid addComment : ", data);
  }
};
