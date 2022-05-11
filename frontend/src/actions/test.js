import { TEST } from "../constants";

const _dataTEST = (data) => ({
  type: TEST,
  data,
});

export const addTEST = (data) => (dispatch) => {
  dispatch(_dataTEST(data));
};
