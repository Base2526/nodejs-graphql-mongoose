import { useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import {EXCHANGE_RATES} from './gql'
import logo from './logo.svg';
import './App.css';

import {socket} from './socketio'

var _ = require('lodash');

const { io } = require("socket.io-client");


// let socket = undefined;

const App =(params)=> {
  // const query = useQuery()
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  // await 
  useEffect(()=>{

    // async function fetchData() {
    //   // You can await here
    //   let _sock = await socket();
    //   _sock.on('connect', (socket) => {
    //         console.log('socket connected', socket);
    //     }) 
    //   // ...
    // }

    // fetchData();
    
    
    // if(!_.isEmpty(socket)){
    //   console.log("socket : ", socket.connected)
    // }
    // socket = io("http://localhost:4040" , 
    //                 { transports : ['websocket'], query: {  x: 42} }
    //                 );

    // if (socket.connected === false && socket.connecting === false) {
    //   // use a connect() or reconnect() here if you want
    //   socket.connect();

    //   console.log("socket")
    // }

    // socket.on('connect', (socket) => {
    //   console.log('socket connected', socket);
    // })


    socket();
    
  }, [])

  
  const socket = async () => {
    console.log('socket connected');
    // let _sock = await socket();

    // _sock.on('connect', (socket) => {
    //   console.log('socket connected', socket);
    // })
  }

  console.log(loading, error, data)

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      Learn React
    </div>
  );
}

export default App;
