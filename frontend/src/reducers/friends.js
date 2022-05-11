import { ADD_FRIEND, UPDATE_FRIEND, DELETE_FRIEND } from "../constants";
var _ = require("lodash");

const initialState = {
  data: [],
};

const friends = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FRIEND: {
      return { ...state, data: _.unionBy(action.data, state.data, "_id") };
    }

    case UPDATE_FRIEND: {
      //  return initialState;
    }

    case DELETE_FRIEND: {
      //  return initialState;
    }

    default:
      return state;
  }

  return state;
};

export default friends;
