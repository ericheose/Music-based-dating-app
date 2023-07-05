import { FormWrapper } from "../../../components/form/FormWrapper";
import TextField from "@mui/material/TextField";
import "../../../styles/form.css";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme } from "@mui/material/styles";

type UserData = {
	firstName: string;
	lastName: string;
	age: number;
	gender: string;
	orientation: string;
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

export function UserForm({ firstName, lastName, age, gender, orientation, updateFields }: UserFormProps) {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		updateFields({ [name]: value });
	};

	return (
		<FormWrapper title="User Details">
			<ThemeProvider theme={inputTheme}>
				<TextField required label="First Name" name="firstName" value={firstName} onChange={handleInputChange} margin="dense" sx={{ width: "80%", mb: 3 }} />
				<TextField required label="Last Name" name="lastName" value={lastName} onChange={handleInputChange} margin="dense" sx={{ width: "80%", mb: 3 }} />
				<TextField
					required
					label="Age"
					defaultValue=""
					name="age"
					type="number"
					inputProps={{ min: 16, max: 110 }}
					value={age}
					onChange={handleInputChange}
					margin="dense"
					sx={{ width: "80%", mb: 3 }}
				/>
				<div className='horizontalFields'>
					<TextField 
						select 
						required 
						label="Gender" 
						name="gender" 
						value={gender} 
						onChange={handleInputChange} 
						margin="dense" 
						sx={{ width: "66%", mb: 3, textAlign: "left", marginRight: "0.25rem" }}>
						<MenuItem value="male">Male</MenuItem>
						<MenuItem value="female">Female</MenuItem>
						<MenuItem value="other">Other</MenuItem>
					</TextField>
					<TextField
						select
						required
						label="Preferred Gender of Partner"
						name="orientation"
						value={orientation}
						onChange={handleInputChange}
						margin="dense"
						sx={{ width: "100%", mb: 3, textAlign: "left", marginLeft: "0.25rem" }}
					>
						<MenuItem value="male">Male</MenuItem>
						<MenuItem value="female">Female</MenuItem>
						<MenuItem value="other">Both</MenuItem>
					</TextField>
				</div>
			</ThemeProvider>
		</FormWrapper>
	);
}
