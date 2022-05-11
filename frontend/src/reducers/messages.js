import { ADD_MESSAGES, ADD_MESSAGE } from "../constants";

var _ = require("lodash");

const initialState = {
  messages: [],
};

const messages = (state = initialState, action) => {
  console.log("messages : ", action);
  switch (action.type) {
    case ADD_MESSAGES: {
      // let state_messages = state.messages;
      // let action_data = action.data;
      // let merged = _.merge(
      //   _.keyBy(state_messages, "_id"),
      //   _.keyBy(action_data, "_id")
      // );

      // //   console.log("#0 >> ", _.values(merged));
      // //   return initialState;
      // return { ...state, messages: _.values(merged) };

      return {
        ...state,
        messages: _.unionBy(action.data, state.messages, "_id"),
      };
    }

    case ADD_MESSAGE: {
      // let state_messages = state.messages;
      // let action_data = action.data;

      // let find = _.find(state_messages, (o) => o._id === action_data._id);
      // if (_.isEmpty(find)) {
      //   let messages = [...state_messages, action_data];

      //   console.log("#1 >> ", messages);
      //   return { ...state, messages };
      // }
      // return state;

      return {
        ...state,
        messages: _.unionBy([action.data], state.messages, "_id"),
      };
    }

    default:
      return state;
  }

  return state;
};

export default messages;
