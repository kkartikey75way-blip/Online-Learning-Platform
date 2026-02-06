import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { io, Socket } from "socket.io-client";
import { HiOutlineChatBubbleLeftRight, HiOutlinePaperAirplane } from "react-icons/hi2";

interface Message {
    _id: string;
    sender: { _id: string; name: string };
    content: string;
    createdAt: string;
}

interface ChatModuleProps {
    courseId: string;
    otherUserId: string;
    otherUserName: string;
    currentUserId: string;
}

export default function ChatModule({ courseId, otherUserId, otherUserName, currentUserId }: ChatModuleProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/messages/course/${courseId}/with/${otherUserId}`);
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();


        socketRef.current = io("http://localhost:5000");
        socketRef.current.emit("join_user", currentUserId);

        socketRef.current.on("private_message", (msg: Message) => {
            setMessages((prev) => {
                if (prev.find(m => m._id === msg._id)) return prev;
                return [...prev, msg];
            });
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [courseId, otherUserId, currentUserId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await api.post(`/messages/course/${courseId}`, {
                content: newMessage,
                receiverId: otherUserId,
            });

            setMessages((prev) => {
                if (prev.find(m => m._id === res.data._id)) return prev;
                return [...prev, { ...res.data, sender: { _id: currentUserId, name: "Me" } }];
            });
            setNewMessage("");
        } catch (error) {
            alert("Failed to send message");
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border">
            <div className="bg-indigo-600 p-3 flex items-center gap-2 text-white shrink-0">
                <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                <h3 className="font-bold text-sm">Chat with {otherUserName}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px]">
                {loading ? (
                    <p className="text-center text-gray-400 text-xs">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-xs italic">No messages yet. Say hello!</p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex flex-col ${msg.sender._id === currentUserId ? "items-end" : "items-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.sender._id === currentUserId
                                    ? "bg-indigo-600 text-white rounded-tr-none"
                                    : "bg-white text-gray-800 border rounded-tl-none"
                                    }`}
                            >
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                )}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2 shrink-0">
                <input
                    type="text"
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition shadow-md"
                >
                    <HiOutlinePaperAirplane className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
