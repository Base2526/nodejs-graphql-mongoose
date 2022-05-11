import { TEST } from "../constants";
var _ = require("lodash");

const initialState = {
  data: {},
};

const test = (state = initialState, action) => {
  // console.log("test >>>>> ", action.type, action.data);
  switch (action.type) {
    case TEST: {
      return { ...state, data: action.data };
    }

    default:
      return state;
  }

  return state;
};

export default test;
