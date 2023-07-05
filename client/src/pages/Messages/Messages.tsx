import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import io from "socket.io-client";

import "./Messages.css";
import MatchedMessage from "./Components/MatchedMessage";
import MessageBox from "./Components/MessageBox";
import { LoggedInUserContext } from "../../App";
import Chat from "./Components/Chat";
import { MatchDisplayData } from "../Dashboard/Components/MatchDisplay";
import { useParams } from "react-router";

interface UserDetails {
	_id: string;
	firstName: string;
	lastName: string;
	username: string;
	profilePicture: string;
	age: number;
}

interface Message {
	content: string;
	sender: string;
	date: Date;
}

interface Props {
	chatId?: string;
}

const Messages = () => {
	const { chatId } = useParams();
	const [selectedChatId, setSelectedChatId] = useState<string | null>(chatId || null);
	const [selectedOtherUserId, setSelectedOtherUserId] = useState<string>("");
	const { loggedInUser } = useContext(LoggedInUserContext);
	const userId = loggedInUser?._id ?? "";
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [displayData, setDisplayData] = useState<MatchDisplayData[]>([
		{
			matchId: "",
			matchedWithUser: {
				_id: "",
				firstName: "",
				lastName: "",
				username: "",
				profilePicture: "",
				age: 0,
			},
			currentUser: {
				_id: "",
				firstName: "",
				lastName: "",
				username: "",
				profilePicture: "",
				age: 0,
			},
			lastMessageSent: "",
			lastMessageDate: "",
			lastMessageTime: "",
			sharedMusic: {
				sharedArtists: [
					{
						id: "",
						name: "",
					},
				],
				sharedSongs: [
					{
						id: "",
						name: "",
					},
				],
				sharedAlbums: [
					{
						id: "",
						name: "",
					},
				],
				sharedGenres: [
					{
						id: "",
						name: "",
					},
				],
			},
		},
	]);

	const getMatches = async () => {
		setDisplayData([]);
		const url = `/api/match`;
		try {
			const res = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const matches = await res.json();
			const displayDataArr: MatchDisplayData[] = [];

			for (const match of matches) {
				const otherUserId = match.userId === userId ? match.matchedWithId : match.userId;
				const matchDisplayData: MatchDisplayData = {
					matchId: match._id,
					matchedWithUser: await getUserFromId(otherUserId),
					currentUser: await getUserFromId(userId as string),
					lastMessageSent: match.lastMessage,
					lastMessageDate: new Date(match.lastMessageDate).toLocaleDateString("en-GB"),
					lastMessageTime: new Date(match.lastMessageDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true }),
					sharedMusic: {
						sharedArtists: match.sharedMusic.sharedartists,
						sharedSongs: match.sharedMusic.sharedsongs,
						sharedAlbums: match.sharedMusic.sharedalbums,
						sharedGenres: match.sharedMusic.sharedgenres,
					},
				};
				displayDataArr.push(matchDisplayData);
			}
			setDisplayData((prevDisplayData) => [...prevDisplayData, ...displayDataArr]);
		} catch (error) {
			console.error(error);
		}
	};

	const getUserFromId = async (id: string): Promise<UserDetails> => {
		const url = `/api/users/getProfile/${id}`;
		try {
			const res = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			return {
				_id: data._id,
				firstName: data.firstName,
				lastName: data.lastName,
				username: data.username,
				profilePicture: data.profilePicture,
				age: data.age,
			};
		} catch (error) {
			console.error(error);
			return {
				_id: "",
				firstName: "",
				lastName: "",
				username: "",
				profilePicture: "",
				age: 0,
			};
		}
	};

	const data = useMemo(() => {
		return displayData.filter((match) => {
			const sender = match.matchedWithUser.username.toLowerCase();
			const content = match.lastMessageSent.toLowerCase();
			const query = searchQuery.toLowerCase();
			return sender.includes(query) || content.includes(query);
		});
	}, [displayData, searchQuery]);

	const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const hasMounted = useRef(false);
	useEffect(() => {
		if (!hasMounted.current) {
			getMatches();
			hasMounted.current = true;
		}
	}, []);

	if (userId === "") {
		return <div>Not logged in</div>;
	}

	const handleMatchedMessageClick = (chatId: string, otherUserId: string) => {
		setSelectedChatId(chatId);
		setSelectedOtherUserId(otherUserId)
	};

	return (
		<div className="container">
			<Navbar />
			<div className="message-container">
				<div className="message-list">
					<input placeholder="Search" value={searchQuery} onChange={handleSearchQueryChange} />
					{data.map((match) => (
						<MatchedMessage
							onClick={handleMatchedMessageClick}
							chatId={match.matchId}
							sender={match.matchedWithUser.username}
							content={match.lastMessageSent}
							date={match.lastMessageDate}
						/>
					))}
				</div>
				<div className="message-box">{selectedChatId && <Chat otherUserId={selectedOtherUserId} userId={userId} chatId={selectedChatId} />}</div>
			</div>
		</div>
	);
};

export default Messages;