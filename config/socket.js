const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:4200',
            credentials: true
        }
    });

    io.on('connect', (socket) => {
    console.log('User connected: ', socket.id);

    //Join user room - 'join' custom event
    socket.on('join', (userId) => {
        socket.join(userId);

        console.log(`User joined room: ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
    
});
    return io;

};

const getIo = () => {
    if(!io) {
        throw new Error("Socket.io not initialized");
    }

    return io;
}

module.exports = {
    initSocket,
    getIo
}

