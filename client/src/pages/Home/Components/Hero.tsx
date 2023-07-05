import styled from "styled-components";
import {useNavigate } from "react-router-dom";
import {useEffect} from "react";
import Navbar from "../../../components/Navbar";

const Section = styled.div`
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	background-image: linear-gradient(to right, #f1c057, #f297a6);

	@media only screen and (max-width: 768px) {
		height: 200vh;
	}
`;

const Container = styled.div`
	height: 100%;
	width: 80%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	@media only screen and (max-width: 768px) {
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
`;

const Heading = styled.div`
	display: flex;
	gap: 20px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-bottom: 100px;
`;

const Title = styled.h1`
	font-size: 90px;

	@media only screen and (max-width: 768px) {
		text-align: center;
	}
`;

const Subtitle = styled.h2`
	color: #fc3078;
	font-size: 30px;
	font-weight: bold;
`;

const Button = styled.button`
	background-color: #fc3078;
	color: white;
	font-weight: 500;
	width: 200px;
	height: 50px;
	padding: 10px;
	border: none;
	border-radius: 20px;
	cursor: pointer;

	&:hover {
		filter: saturate(0.9);
	}
`;

const Hero = () => {
	const navigate = useNavigate();

	const handleSignUp = () => {
		navigate("/signup");
	};

	const goToProfile = () => {
		navigate("/profile");
	};

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user){
			document.getElementById("createAcc")!.innerHTML = `Go To Your Profile`;
			document.getElementById("createAcc")!.onclick = goToProfile;
		} else {
			document.getElementById("createAcc")!.innerHTML = `Create Account`;
			document.getElementById("createAcc")!.onclick = handleSignUp;
		}
	}, []);

	return (
		<Section>
			<Navbar />
			<Container>
				<Heading>
					<Title>Connecting music lovers</Title>
					<Subtitle>one match at a time</Subtitle>
				</Heading>
				<Button id="createAcc" onClick={handleSignUp}>Create Account</Button>
			</Container>
		</Section>
	);
};

export default Hero;
