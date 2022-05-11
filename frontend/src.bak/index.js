import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";


import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const client = new ApolloClient({
  uri: 'http://localhost:4040/graphql',
  cache: new InMemoryCache()
});

// client
//   .query({
//     query: gql`
//       query User{
//               User(_id: "6277293cc6551f01ee726df8"){
//               status
//               data{
//                   id: _id
//                   username
//                   password
//                   email
//                   displayName
//                   roles
//                   isActive
//                   image{
//                       _id
//                       size
//                       type
//                       lastModified
//                       base64
//                   }
//                   lastAccess
//               }
//           }
//       }
//     `
//   })
//   .then(result => console.log(result));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
