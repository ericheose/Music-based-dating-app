import { useContext, useEffect, useRef, useState } from "react";
import { LoggedInUserContext } from "../../../App";
import ChatCard from "./ChatCard";

interface UserDetails {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profilePicture: string;
    age: number;
}


export interface MatchDisplayData {
    matchId: string;
    matchedWithUser: UserDetails;
    currentUser: UserDetails;
    lastMessageSent: string;
    lastMessageDate: string;
    lastMessageTime: string;
}

const MatchDisplay: React.FC = () => {

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
        }
    ]);

    const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext);
    const currentUserId = loggedInUser?._id;

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
                const otherUserId = match.userId === currentUserId ? match.matchedWithId : match.userId;
                const matchDisplayData: MatchDisplayData = {
                    matchId: match._id,
                    matchedWithUser: await getUserFromId(otherUserId),
                    currentUser: await getUserFromId(currentUserId as string),
                    lastMessageSent: match.lastMessage,
                    lastMessageDate: new Date(match.lastMessageDate).toLocaleDateString("en-GB"),
                    lastMessageTime: new Date(match.lastMessageDate).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', hour12: true }),

                };
                displayDataArr.push(matchDisplayData);
            }
            setDisplayData(prevDisplayData => [...prevDisplayData, ...displayDataArr]);

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
            }
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

    const removeMatch = async (matchId: string) => {
        const url = `/api/match/${matchId}`;
        try {
            await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

        } catch (error) {
            console.error(error);
        }
        window.location.reload();

        const firstUser = displayData.find((match) => match.matchId === matchId)?.currentUser._id;
        const secondUser = displayData.find((match) => match.matchId === matchId)?.matchedWithUser._id;

        let userToAdd = firstUser;
        if (firstUser == loggedInUser?._id) {
            userToAdd = secondUser;
        }
        const url2 = `/api/users/addToDisliked/${userToAdd}`;
        try {
            await fetch(url2, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error(error);
        }
    };
                
                


    const hasMounted = useRef(false);
    useEffect(() => {
        if (!hasMounted.current) {
            getMatches();
            hasMounted.current = true;
        }
    }, []);

    return (
        <div id="mainMatchBox">
            <h1 style={{alignSelf: 'center'}}>Friends!</h1>
            <div id="chatBox">
                {displayData.map((match: MatchDisplayData) => (
                    <ChatCard key={match.matchId} match={match} removeMatch={removeMatch}/>
                ))}
            </div>
        </div>
    )
}

export default MatchDisplay