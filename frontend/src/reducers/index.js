import { combineReducers } from "redux";

import user from "./user";
import friends from "./friends";
import app from "./app";
import setting from "./setting";

import my_apps from "./my_apps";
import my_follows from "./my_follows";
import app_follow_up from "./app_follow_up";
import socket from "./socket";

import messages from "./messages";

import test from "./test";

export default combineReducers({
  user,
  friends,
  app,
  setting,
  my_apps,
  my_follows,
  app_follow_up,
  socket,
  messages,

  test,
});
