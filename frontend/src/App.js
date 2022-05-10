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

const { io } = require("socket.io-client");

let socket = undefined;

const App =(params)=> {
  // const query = useQuery()
  const { loading, error, data } = useQuery(EXCHANGE_RATES);
  useEffect(()=>{
    socket = io("http://localhost:4040" , 
                    { transports : ['websocket'], query: {  x: 42} }
                    );

    if (socket.connected === false && socket.connecting === false) {
      // use a connect() or reconnect() here if you want
      socket.connect();

      console.log("socket")
    }
    
    // query(User)
  }, [])

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
