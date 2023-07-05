import { FormEvent, useState } from "react";
import { AccountForm } from "./Components/AccountForm";
// import { AddressForm } from "../components/form/PreferenceForm";
import { useMultistepForm } from "../../components/form/useMultistepForm";
import { UserForm } from "./Components/UserForm";

import { useNavigate } from "react-router-dom";
import { User } from "../../models/userModel";
import { SignUpCredentials } from "../../controllers/apiController";
import * as MatchesApi from "../../controllers/apiController";
import { ConflictError } from "../../errors/httpErrors";
import "./SignUp.css";
import { SpotifyItem } from "../../components/SpotifySearch";
import { PreferenceForm } from "./Components/PreferenceForm";
import { DetailsForm } from "./Components/DetailsForm";
import { ProfileImageForm } from "./Components/ProfileImageForm";

type FormData = {
	firstName: string;
	lastName: string;
	age: number;
	username: string;
	email: string;
	password: string;
	orientation: string;
	gender: string;
	bio: string;
	favouriteSongs: SpotifyItem[];
	favouriteArtists: SpotifyItem[];
	favouriteAlbums: SpotifyItem[];
	favouriteGenres: SpotifyItem[];
	profilePicture: string;
};

const INITIAL_DATA: FormData = {
	firstName: "",
	lastName: "",
	age: 0,
	username: "",
	email: "",
	password: "",
	orientation: "",
	gender: "",
	bio: "",
	favouriteSongs: [],
	favouriteArtists: [],
	favouriteAlbums: [],
	favouriteGenres: [],
	profilePicture: "",
};

interface SignUpProps {
	onSignUpSuccessful: (user: User) => void;
}

const SignUp = ({ onSignUpSuccessful }: SignUpProps) => {
	const navigate = useNavigate();
	const [errorText, setErrorText] = useState<string | null>(null);
	const [data, setData] = useState(INITIAL_DATA);

	function updateFields(fields: Partial<FormData>) {
		setData((prev) => {
			console.log(data);
			return { ...prev, ...fields };
			
		});
	}

	const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
		<UserForm {...data} updateFields={updateFields} />,
		<ProfileImageForm {...data} updateFields={updateFields} />,
		<DetailsForm {...data} updateFields={updateFields} />,
		<PreferenceForm {...data} updateFields={updateFields} />,
		<AccountForm {...data} updateFields={updateFields} />,
	]);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		if (!isLastStep) return next();
		try {
			const user = await MatchesApi.signUp(data);
			onSignUpSuccessful(user);
			navigate("/");
		} catch (error) {
			if (error instanceof ConflictError) {
				setErrorText(error.message);
			} else {
				alert(error);
			}
			console.error(error);
		}
	}

	return (
		<div className="container">
			<form className="form-container" onSubmit={onSubmit}>
				<div style={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
					{currentStepIndex + 1} / {steps.length}
				</div>
				<div className="content">{step}</div>
				<div className="button-container">
					{!isFirstStep && (
						<button className="button" type="button" onClick={back}>
							Back
						</button>
					)}
					<button className="button" type="submit">
						{isLastStep ? "Finish" : "Next"}
					</button>
				</div>
			</form>
			<button id="exitForm" onClick={() => navigate(-1)}>Back</button>
		</div>
	);
};

export default SignUp;
