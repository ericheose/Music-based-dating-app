import React, { useState, useContext, createContext, useEffect } from "react";

import * as MatchesApi from "./controllers/apiController";

import Home from "./pages/Home/Home";

import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { User } from "./models/userModel";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import Profile from "./pages/Profile/Profile";
import Messages from "./pages/Messages/Messages";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProfileSettings from "./pages/Settings/Settings";

export interface ProfileProps {
	name: string;
	age: number;
	bio: string;
	interests: string[];
}

export interface ProfileContextType {
	profileProps: ProfileProps;
	setProfileProps: React.Dispatch<React.SetStateAction<ProfileProps>>;
}

const defaultKian: ProfileProps = {
	name: "Kian",
	age: 35,
	bio: "I am a cool guy",
	interests: ["games", "games", "Games"],
};

const profileContext: ProfileContextType = {
	profileProps: defaultKian,
	setProfileProps: () => {},
};

export const ProfileContext = React.createContext<ProfileContextType>(profileContext);

export const LoggedInUserContext = React.createContext<{
	loggedInUser: User | null;
	setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
	loggedInUser: null,
	setLoggedInUser: () => {},
});

const App = () => {
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

	const [profileProps, setProfileProps] = useState<ProfileProps>(defaultKian);

	useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				const user = await MatchesApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				console.error(error);
			}
		}
		fetchLoggedInUser();
	}, []);

	return (
		<LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
			<BrowserRouter>
				<ProfileContext.Provider value={{ profileProps, setProfileProps }}>
					<Routes>
						<Route path="/" element={loggedInUser ? <Dashboard /> : <Home />} />
						<Route path="/user/:urlID" element={<Profile />} />
						<Route path="/profileSettings" element={<ProfileSettings />} />
						<Route
							path="/login"
							element={
								<Login
									onLoginSuccessful={(user) => {
										setLoggedInUser(user);
									}}
								/>
							}
						/>
						<Route
							path="/signup"
							element={
								<SignUp
									onSignUpSuccessful={(user) => {
										setLoggedInUser(user);
									}}
								/>
							}
						/>
					
				
				<Route path="/messages/:chatId" element={<Messages/>} />
				<Route path="/messages" element={<Messages/>} />

			</Routes>
			</ProfileContext.Provider>
		</BrowserRouter>
		</LoggedInUserContext.Provider>
	);
};

export default App;
