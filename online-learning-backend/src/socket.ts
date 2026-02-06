import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Adjust this in production
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);

        socket.on("join_course", (courseId: string) => {
            socket.join(courseId);
            console.log(`User joined course room: ${courseId}`);
        });

        socket.on("join_user", (userId: string) => {
            socket.join(userId);
            console.log(`User joined personal room: ${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
