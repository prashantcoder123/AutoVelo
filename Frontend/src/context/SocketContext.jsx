
// import React, { createContext, useEffect } from 'react';
// import { io } from 'socket.io-client';

// export const SocketContext = createContext();

// const socket = io(`${import.meta.env.VITE_BASE_URL}`); // Replace with your server URL

// const SocketProvider = ({ children }) => {
//     useEffect(() => {
//         // Basic connection logic
//         socket.on('connect', () => {
//             console.log('Connected to server');
//         });

//         socket.on('disconnect', () => {
//             console.log('Disconnected from server');
//         });

//     }, []);



//     return (
//         <SocketContext.Provider value={{ socket }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export default SocketProvider;


import React, { createContext, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { CaptainDataContext } from './CapatainContext'; // 👈 IMPORT THIS

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const SocketProvider = ({ children }) => {
    const { captain } = useContext(CaptainDataContext); // 👈 GET CAPTAIN

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

    }, []);

    // 🔥 NEW EFFECT (IMPORTANT)
    useEffect(() => {
        if (captain?._id) {
            console.log("Joining socket:", captain._id)

            socket.emit("join", {
                userId: captain._id,
                userType: "captain"
            });
        }
    }, [captain]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;