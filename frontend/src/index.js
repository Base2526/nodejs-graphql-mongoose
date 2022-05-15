import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";

import thunk from "redux-thunk";

// Logger with default options
import { createLogger } from "redux-logger";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

// persist
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, Switch } from "react-router-dom";
import rootReducer from "./reducers";
import App from "./App";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-image-lightbox/style.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-datepicker/dist/react-datepicker.css";

import "./custom.css";
// import "./custom.scss";

const persistConfig = {
  key: "root",
  storage,
};

const reducer = persistReducer(persistConfig, rootReducer);
// persist

// https://github.com/LogRocket/redux-logger/issues/6
const logger = createLogger({
  predicate: () => process.env.NODE_ENV !== "development",
  // predicate: () => process.env.NODE_ENV !== 'production'
});

// thunk

const store = createStore(reducer, applyMiddleware(thunk, logger));
const persistor = persistStore(store);


const client = new ApolloClient({
  uri: 'http://localhost:4040/graphql',
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

// ReactDOM.render(<div>Hello world</div>, document.getElementById('root'));
