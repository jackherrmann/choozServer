const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const { Session } = require('./session');

const app = express();

const port = process.env.port || 4000;
const server = http.createServer(app);

const io = socketio(server);

app.get('/', (req, res) => {
    res.send(`Welcome to the server on port: ${port}`); 
})

io.on('connection', socket => {
    console.log('User connected!', socket.id);

    socket.on('create_session', (data) => {
        const { name, activityType, numSwipes, location, params } = data;
        const sessionId = createSession(socket, name, activityType, numSwipes, location, params);
        const emit_data = {
            'sessionId': sessionId
        }
        socket.emit('created_session', emit_data);
    });

    socket.on('join_session', (data) => {
        const { name, sessionId } = data;
        const joinResult = joinSession(socket, name, sessionId);
        if (joinResult == -1) {
            socket.emit('join_attempt_result', false);
        }
        else {
            const emit_data = {
                'username': name
            }
            socket.to(sessionId).emit('user_joined_session', emit_data);
            
            socket.emit('join_attempt_result', true);

            const session = sessions[sessionId];
            const emit_data_to_joiner = {
                'sessionId': sessionId,
                'participants': session.getMembers()
            }
            socket.emit('initial_joined_session', emit_data_to_joiner);
        }
    });

    socket.on('start_session', (room) => {
        /* startSession(room)
        .then(activities => {
            const emit_data = {
                activities: activities,
            }
            socket.to(room).emit('started_session', emit_data);
        }); */
        const test1 = {
            name: 'Pizza Hut',
            cuisine: 'Chicken Wings',
            url: '',
            imageUrl: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
            rating: 2.5,
            location: 'xavier\'s house',
        };
        
        const test2 = {
            name: 'Pizza Hut',
            cuisine: 'Chicken',
            url: '',
            imageUrl: 'https://homepages.cae.wisc.edu/~ece533/images/arctichare.png',
            rating: 2,
            location: 'xavier\'s house',
        };
        socket.to(room).emit('started_session', [test1, test2]);
        socket.emit('started_session', [test1, test2]);
    });

    socket.on('process_swipes', (room, name, userSwipes) => {
        processSwipes(room, name, userSwipes)
        const emit_data = {
            message: 'Swipes processed!',
        }
        socket.emit('processed_swipes', emit_data);

        if (isFinished()) {
            const matches = getMatches(room);
            const emit_results = {
                matches : matches
            }
            socket.to(room).emit('finished_all', emit_results);
        }
    });

    //socket.on('user_finish', finishUser);
});

const sessions = {}; //maps session 'socket room' name to the actual session



function joinSession(socket, name, room) {
    if (!(room in sessions)) {
        return -1;
    }
    currSesh = sessions[room];
    currSesh.addMember(name);

    socket.join(room);
    return room;
};

function createSession(socket, name, category, swipes, location, params) {
    const findCode = (Math.floor(Math.random()*100000+1));

    while (findCode.toString() in sessions) {
        findCode++;
    }

    const code = findCode.toString();

    const newSesh = new Session(category, swipes, location, params); //create new session
    newSesh.setHost(name);
    newSesh.addMember(name);
    
    sessions[code] = newSesh; //add session to session dict

    socket.join(code);

    return code;
}

async function startSession(room) {
    const newSesh = sessions[room];
    await newSesh.generateActivities()
    .then(activities => {
        return activities;
    });
}

function processSwipes(room, name, userSwipes) {
    const currSesh = sessions[room];

    currSesh.processSwipes(name, userSwipes);
}

function isFinished(room) {
    currSesh = sessions[room];
    return currSesh.isFinished();
}

function getMatches(room) {
    currSesh = sessions[room];
    return currSesh.getMatches();
}

server.listen(port, function() {
    console.log("listening on port " + port);
});