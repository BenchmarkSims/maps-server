//
// Falcon BMS Interactive Map Collaboration Server
//
// The server uses the default port of 3000 but you can also pass the port at start
//
// e.g.  node index.js 3100

// Process Arguments and remove node and JavaScript name
var argv = process.argv.slice(2);

const IMCS_DEBUG = false;
const DEFAULT_PORT = 3000;

const WebSocket = require("ws");
const imcs_port = (argv.length > 0)?{port: argv[0] >> 0}:{port: DEFAULT_PORT};
const imcs = new WebSocket.Server(imcs_port);

var client_id = 0;
var users = [];

// Debug Level Comments to Console
function imcsDebug(...args) {
    if (IMCS_DEBUG) args.forEach(arg => console.log(arg));
}

// Get User's index by Name
function imcsSessionIdxByName(session, callsign){
    for (var i = 0; i < users.length; i++) {
        if (users[i].session === session && users[i].callsign === callsign) return i;
    }
    return -1;
}

// Get User's index by Name
function imcsFindMissionCmdr(session){
    for (var i = 0; i < users.length; i++) {
        if (users[i].session === session && users[i].cmdr == true) return i;
    }
    return -1;
}

// Count Pilots in Session
function imcsSessionCount(session){
    var cnt = 0;
    for (var i = 0; i < users.length; i++) if (users[i].session === session) cnt++;
    return cnt;
}

// Get User's index by Socket
function imcsSessionIdxBySocket(socket) {
    for (var i = 0; i < users.length; i++) if (users[i].socket == socket) return i;
    return -1;
}

// Add a new pilot
function imcsSessionAdd(socket, session, callsign) {

    // See if this Pilot is registered already
    var index = imcsSessionIdxByName(session, callsign);
    var id = -1;

    if (index < 0) {
        var cmdr = (imcsFindMissionCmdr(session)<0)?true:false; // MC when session has none

        // Register New User with Session
        id = client_id++;
        users.push({socket: socket, session: session, callsign: callsign, cmdr: cmdr});
        if (cmdr) imcsDebug("Started Session: " + session + "/" + callsign + " as Commander");
        else imcsDebug("Started Session: " + session + "/" + callsign);
    } else {
        imcsDebug("Duplicate " + session + "/" + callsign);
    }
    return id;
}

function imcsMsgAuthRcvd(socket, msg) {
    var index = imcsSessionAdd(socket, msg.session, msg.callsign);
    socket.send(JSON.stringify({id: msg.id, result: index}));
}

function imcsMsgForward(socket, msg) {
    var index = imcsSessionIdxBySocket(socket);
    //imcsDebug("Relay from: " + users[index].session + "/" + users[index].callsign);
    var payload = JSON.stringify(msg);
    for (var i = 0; i < users.length; i++)
        // Forward to other clients in the session
        if (i != index && users[i].session == users[index].session) {
            users[i].socket.send(payload);
        }
}

// Setup a connect for each Client
imcs.on("connection", ws => {
    // Handle messages from each client
    ws.on("message", payload => {
        try {
            var msg = JSON.parse(payload);
            switch (msg.id) {
                case 0:
                    imcsMsgAuthRcvd(ws, msg);
                    break;

                case 10: // Silently ignore Keep Alive
                    break

                default: // default forward to peers
                    imcsMsgForward(ws, msg);
            }
        }
        catch (e) {
            console.error(e);
        }
    });

    // Close connection for a client
    ws.on("close", () => {
        var i = imcsSessionIdxBySocket(ws);
        if ( i >= 0) {
            imcsDebug("Stopped Session: " + users[i].session + "/" + users[i].callsign);
            users.splice(i, 1);
        }
    });
});
