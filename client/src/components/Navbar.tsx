import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoggedInUserContext } from "../App";
import { logout } from "../controllers/apiController";
import "../styles/Navbar.css";

type NavItem = {
	path: string;
	label: string;
};



const NAV_ITEMS: NavItem[] = [
	{ path: "/", label: "Home" },
	{ path: "/user", label: "Profile" },
	{ path: "/messages", label: "Messages"},
	{ path :"/profileSettings", label: "Settings"},
];

const Navbar = () => {
	const navigate = useNavigate();
	const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext);

	const handleSignIn = () => {
		navigate("/login");
	};

	const handleGithubClick = () => {
		window.location.href = "https://github.com/UOA-CS732-SE750-Students-2023/project-group-enlightened-elks";
	}

	const handleSignOut = async () => {
		try {
			await logout();
			navigate("/");
			setLoggedInUser(null);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	};

	return (
		<div className="navbar-section">
			<div className="navbar-container">
				<div className="links">
					{loggedInUser ? (
						<ul className="list">
							<img src="images/logo.png" alt="" width={80} />
							{NAV_ITEMS.map((item) => (
								<li key={item.path}>
									<NavLink to= {item.path === "/user" && loggedInUser._id ? "/user/" + loggedInUser._id : item.path}>{item.label}</NavLink>
								</li>
							))}
						</ul>
					) : (
						<ul className="list">
							<img src="images/logo.png" alt="" width={80} />
						</ul>
					)}
				</div>
				{loggedInUser ? (
					<div className="icons">
						<h4>{loggedInUser.username}</h4>
						<button id="signOut" className="navbar-button" onClick={handleSignOut}>
							Log Out
						</button>
					</div>
				) : (
					<div className="icons">
						<img src="images/github.png" alt="" className="icon" onClick={handleGithubClick} />
						<button id="signIn" className="navbar-button" onClick={handleSignIn}>
							Log In
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
