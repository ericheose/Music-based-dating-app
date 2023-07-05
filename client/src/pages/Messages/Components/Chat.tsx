import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import MessageBox from "./MessageBox";
import "./MessageBox.css"

interface Message {
	content: string;
	sender: string;
	date: Date;
}

interface Props {
	userId: string;
	otherUserId: string;
	chatId: string;
}

const Chat: React.FC<Props> = ({ userId, chatId, otherUserId }) => {
	const [socket, setSocket] = useState<any>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState<string>("");

	useEffect(() => {
		// Connect to socket.io server
		const socket = io("http://localhost:5000");
		setSocket(socket);

		// Join chat room
		socket.emit("joinChat", chatId);

		// Listen for incoming messages
		socket.on("message", (message: Message) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		});

		// Get initial messages
		fetch(`/api/chat/${chatId}`)
			.then((response) => response.json())
			.then((data) => {
				setMessages(data);
			})
			.catch((error) => {
				console.log(error);
			});

		return () => {
			// Leave chat room and disconnect from socket.io server
			socket.emit("leaveChat", chatId);
			socket.disconnect();
			setSocket(null);
		};
	}, [chatId]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!socket || !newMessage) return;
		const message: Message = {
			content: newMessage,
			sender: userId,
			date: new Date(),
		};

		// Make a POST request to your server to send the message
		fetch("/api/chat/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				chatId,
				content: message.content,
				sender: message.sender,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to send message");
				}
				// Emit the message using socket.io
				socket.emit("message", { content: newMessage, sender: userId, date: new Date() });
				setMessages((prevMessages) => [...prevMessages, message]);
				setNewMessage("");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [messages]);

	return (
		<div>
			<h1>Chat Room: {otherUserId}</h1>
			<div className="section">
			<div className="chat-container" ref={containerRef}>
				{messages.map((message, index) => (
					<MessageBox key={index} message={message} own={userId === message.sender ? true : false} />
				))}
			</div>
			<form onSubmit={handleSubmit}>
				<input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
				<button type="submit" disabled={!newMessage}>Send</button>
			</form>
			</div>
		</div>
	);
};

export default Chat;