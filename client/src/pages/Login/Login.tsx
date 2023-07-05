import React, { FormEvent, useContext, useEffect, useState } from "react";
import KeepLoggedInCheckbox from "./Components/KeepLoggedInCheckbox";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import bcrypt from "bcryptjs";
import Navbar from "../../components/Navbar";
import { User } from "../../models/userModel";
import { LoginCredentials } from "../../controllers/apiController";
import * as MatchesApi from "../../controllers/apiController";
import { UnauthorizedError } from "../../errors/httpErrors";
import TextField from "@mui/material/TextField";

const Container = styled.div`
	height: 100vh;
	width: 100%;
	background-image: linear-gradient(to right, #f1c057, #f297a6);
`;

const Content = styled.div`
	margin: 0 5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
`;

const CheckboxContainer = styled.div`
	width: 80%;
	margin: 1rem 0;
`;

const Box = styled.div`
	width: 30%;
	height: 450px;
	background-color: rgba(255,255,255,0.8);
	border-radius: 30px;
	padding: 2rem;
	margin: auto;
	text-align: center;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
`;

const BackButton = styled.button`
	position: absolute;
	top: 1.5rem;
	left: 2rem;
	background-color: transparent;
	border: none;
	font-weight: bold;
	font-size: 1.2rem;
	cursor: pointer;
	outline: none;

	&:hover {
		color: #dedede;
	}
`;

const Title = styled.h1`
	font-size: 2rem;
	font-weight: bold;
	margin-bottom: 4rem;
	margin-top: 2rem;
	color: #1c1c1c;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Input = styled.input`
	width: 80%;
	height: 3rem;
	margin: 1rem 0;
	padding: 0 1rem;
	border: none;
	border-radius: 15px;
	outline: none;
	font-size: 1rem;
	background-color: #f5f5f5;
	color: #000; /* set text color to black */
	box-sizing: border-box; /* include padding and border in width calculation */
	::placeholder {
		color: #a0a0a0; /* set placeholder text color */
	}
`;

const SignInButton = styled.button`
	width: 80%;
	height: 3rem;
	margin: 1rem 0;
	padding: 0 1rem;
	border: none;
	border-radius: 15px;
	outline: none;
	font-weight: bold;
	font-size: 1rem;
	background-image: linear-gradient(to right, #f1c057, #f297a6);
	box-sizing: border-box; /* include padding and border in width calculation */

	&:hover {
		filter: saturate(86%);
	}
`;

interface LoginProps {
	onLoginSuccessful: (user: User) => void;
}

const Login = ({ onLoginSuccessful }: LoginProps) => {
	const navigate = useNavigate();
	const [credentials, setCredentials] = useState<LoginCredentials>({
		username: "",
		password: "",
	});

	const handleInputChange = (event: {
		target: { name: any; value: any };
	}) => {
		const { name, value } = event.target;
		setCredentials((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const [errorText, setErrorText] = useState<string | null>(null);

	const handleLogin = async (event: { preventDefault: () => void }) => {
		event.preventDefault();

		try {
			const user = await MatchesApi.login(credentials);
			onLoginSuccessful(user);
			navigate("/");
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				setErrorText(error.message);
			} else {
				alert(error);
			}
			console.error(error);
		}
	};

	const handleBack = () => {
		navigate(-1);
	};

	return (
		<Container>
			<Content>
				<Box>
					<Title>SIGN IN TO YOUR ACCOUNT</Title>
					<Form>
						<TextField
							required
							label="Username"
							name="username"
							value={credentials.username}
							onChange={handleInputChange}
							margin="dense"
							sx={{ width: "80%", mb: 2 }}
						/>
						<TextField
							required
							label="Password"
							name="password"
							type="password"
							value={credentials.password}
							onChange={handleInputChange}
							margin="dense"
							sx={{ width: "80%", mb: 2 }}
						/>

						<p style={{color: "black"}}>{errorText}</p>

						<CheckboxContainer>
							<KeepLoggedInCheckbox />
						</CheckboxContainer>
						<SignInButton onClick={handleLogin}>
							SIGN IN
						</SignInButton>
					</Form>
				</Box>
				<BackButton onClick={handleBack}>Back</BackButton>
			</Content>
		</Container>
	);
};

export default Login;
