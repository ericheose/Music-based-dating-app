import { func } from "prop-types";
import "./MessageBox.css";
import { useEffect, useRef } from "react";

interface Message {
	content: string;
	sender: string;
	date: Date;
}

export default function MessageBox({ own, message }: { own: Boolean; message: Message }) {
	return (
		<div className={own ? "message own" : "message"}>
			<div className="bubble">
				<img className="image" src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" alt="" />
				<p className="message-content">{message.content}</p>
			</div>
			<div className="date">{new Date(message.date).toLocaleString("en-GB")}</div>
		</div>
	);
}
