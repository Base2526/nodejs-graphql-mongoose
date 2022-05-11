import Ajv from "ajv";
import { ADD_FRIEND } from "../constants";

const _addFriend = (data) => ({
  type: ADD_FRIEND,
  data,
});

export const addFriend = (data) => (dispatch) => {
  // const schema = {
  //   type: "object",
  //   properties: {
  //     _id: { type: "string" },
  //     email: { type: "string" },
  //     display_name: { type: "string" },
  //     status: { type: "string" },
  //   },
  //   required: ["_id", "display_name", "email"],
  //   additionalProperties: true,
  // };

  var innerSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      email: { type: "string" },
      display_name: { type: "string" },
      status: { type: "string" },
    },
    required: ["_id", "display_name", "email"],
  };

  const schema = {
    type: "array",
    items: innerSchema,
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) {
    dispatch(_addFriend(data));
  } else {
    console.log("Ajv invalid addFriend : ", data);
  }
};
