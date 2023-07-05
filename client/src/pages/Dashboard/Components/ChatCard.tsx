import { MatchDisplayData } from "./ChatDisplay";
import "./ChatCard.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

interface ChatCardProps {
	match: MatchDisplayData;
	removeMatch: (matchId: string) => void;
}

const ChatCard: React.FC<ChatCardProps> = ({ match, removeMatch }) => {
	const MAX_MESSAGE_LENGTH = 25;

	const message = match.lastMessageSent.length > MAX_MESSAGE_LENGTH ? match.lastMessageSent.slice(0, MAX_MESSAGE_LENGTH) + "..." : match.lastMessageSent;

	const handleRemoveMatch = () => {
		removeMatch(match.matchId);
	};

	return (
		<div key={match.matchId} className="chatCard">
			<div id="profileDiv">
				<img id="profilePic" src={match.matchedWithUser.profilePicture} alt="profile picture" />
			</div>
			<div id="rightContents">
				<div id="nameDetails">
					<p style={{ fontSize: "larger" }}>
						{match.matchedWithUser.firstName} {match.matchedWithUser.lastName}
					</p>
					<p style={{ fontSize: "large" }}>@{match.matchedWithUser.username}</p>
				</div>
				<div id="lastMessage">
					<p>{message}</p>
					<p>
						{match.lastMessageTime} - {match.lastMessageDate}
					</p>
				</div>
				<div id="bottomBar">
					<Button
						style={{ backgroundColor: "rgb(186, 133, 246)", marginRight: "0.5rem", textAlign: "center" }}
						variant="contained"
						component={Link}
						to={`/messages/${match.matchId}`}
					>
						Message
					</Button>
					<Button
						style={{ backgroundColor: "rgb(186, 133, 246)", marginRight: "0.5rem", textAlign: "center" }}
						variant="contained"
						component={Link}
						to={`/user/${match.matchedWithUser._id}`}
					>
						View Profile
					</Button>
					<Button style={{ backgroundColor: "rgb(186, 133, 246)", marginRight: "0.5rem", textAlign: "center" }} variant="contained" onClick={handleRemoveMatch}>
						Remove Match
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChatCard;
