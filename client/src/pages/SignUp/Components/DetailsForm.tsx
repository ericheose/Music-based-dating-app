import { FormWrapper } from "../../../components/form/FormWrapper";
import TextField from "@mui/material/TextField";
import "../../../styles/form.css";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme } from "@mui/material/styles";

type UserData = {
	bio: string;
};

type UserFormProps = UserData & {
	updateFields: (fields: Partial<UserData>) => void;
};

const inputTheme = createTheme({
	palette: {
	  primary: {
		main: '#FFA500', // Orange color
	  },
	  secondary: {
		main: '#FFFF00', // Yellow color
	  },
	},
});

export function DetailsForm({ bio, updateFields }: UserFormProps) {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		updateFields({ [name]: value });
	};

	return (
		<FormWrapper title="User Details">
			<ThemeProvider theme={inputTheme}>
				<TextField label="Biography" placeholder="Tell us about yourself!" name="bio" value={bio} onChange={handleInputChange} rows={10} multiline maxRows={Infinity} margin="dense" sx={{ width: "80%", mb: 2 }} />
			</ThemeProvider>
		</FormWrapper>
	);
}
