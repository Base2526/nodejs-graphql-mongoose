import Ajv from "ajv";
import { ADD_MESSAGES, ADD_MESSAGE } from "../constants";

const _addMessages = (data) => ({
  type: ADD_MESSAGES,
  data,
});

const _addMessage = (data) => ({
  type: ADD_MESSAGE,
  data,
});

/*
_id: '61695002a50b4609a6d185ad',
type: 'text',
data: {
    text: 'abc'
},
status: 'complete',
conversationId: '61694feca50b4609a6d185a7',
senderId: 60,
receiverId: 66,
createdAt: ISODate('2021-10-15T09:55:14.151Z'),
updatedAt: ISODate('2021-10-15T09:55:14.151Z'),


search_category: {
        type: "array",
        items: {
          type: "string",
        },
      },
*/
export const addMessages = (data) => (dispatch) => {
  const schema = {
    type: "array",
    properties: {
      _id: { type: "string" },
      type: { type: "string" },
      // data: { type: "object", text: { type: "string" } },
      text: { type: "string" },
      status: { type: "string" },
      conversationId: { type: "string" },
      senderId: { type: "string" },
      receiverId: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
    },
    // required: [],
    additionalProperties: true,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addMessages(data));
  } else {
    console.log("Ajv invalid addMessages : ", data);
  }
};

export const addMessage = (data) => (dispatch) => {
  const schema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      type: { type: "string" },
      // data: { type: "object", text: { type: "string" } },
      text: { type: "string" },
      status: { type: "string" },
      conversationId: { type: "string" },
      senderId: { type: "string" },
      receiverId: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
    },
    required: ["_id"],
    additionalProperties: true,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addMessage(data));
  } else {
    console.log("Ajv invalid addMessage : ", data);
  }
};
