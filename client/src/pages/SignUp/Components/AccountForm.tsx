import { FormWrapper } from "../../../components/form/FormWrapper";
import TextField from "@mui/material/TextField";
import "../../../styles/form.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

type AccountData = {
	username: string;
	email: string;
	password: string;
};

type UserFormProps = AccountData & {
	updateFields: (fields: Partial<AccountData>) => void;
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

export function AccountForm({ username, email, password, updateFields }: UserFormProps) {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		updateFields({ [name]: value });
	};

	return (
		<FormWrapper title="Account Details">
			<ThemeProvider theme={inputTheme}>
				<TextField required label="Username" name="username" value={username} onChange={handleInputChange} margin="dense" sx={{ width: "80%", mb: 2 }} />
				<TextField required label="Email" name="email" type="email" value={email} onChange={handleInputChange} margin="dense" sx={{ width: "80%", mb: 2 }} />
				<TextField required label="Password" name="password" type="password" value={password} onChange={handleInputChange} margin="dense" sx={{ width: "80%", mb: 2 }} />
			</ThemeProvider>
		</FormWrapper>
	);
}
