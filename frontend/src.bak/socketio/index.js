const { io } = require("socket.io-client");

let soc = undefined
const socket = async() => {
    soc = io("http://localhost:4040" , { transports : ['websocket'], query: {  x: 42} })

    if (soc.connected === false && soc.connecting === false) {
        // use a connect() or reconnect() here if you want
        soc.connect();
        console.log("socket")
    }

    return soc;

    // socket.on('connect', (socket) => {
    //     console.log('socket connected', socket);
    // }) 
}

export {
    socket
} ;