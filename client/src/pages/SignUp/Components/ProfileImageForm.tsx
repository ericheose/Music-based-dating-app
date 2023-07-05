import { FormWrapper } from "../../../components/form/FormWrapper";
import "../../../styles/form.css";
import Button from "@mui/material/Button";
import { useState } from "react";
type UserData = {
	profilePicture: string;
};


type ProfileImageFormProps = UserData & {
	updateFields: (fields: Partial<UserData>) => void;
};

export function ProfileImageForm({ updateFields }: ProfileImageFormProps) {

	const [selectedImage, setSelectedImage] = useState<string>("");
	const [selectedImageFile, setSelectedImageFile] = useState();
	const [previewImage, setPreviewImage] = useState<string>("");

	const handleFileUpload = async (e: any) => {
		if (selectedImage) {
			uploadImageToImgur(selectedImage)
				.then(link => {
					console.log(link)
					updateFields({ profilePicture: link });
				})
				.catch(error => {
					console.error('Error while uploading profile picture:', error);
				});
		}
	};



	const handleInputChange = async (e: any) => {
		const file = e.target.files[0];
		setSelectedImageFile(file);
		setPreviewImage(URL.createObjectURL(file));
		const base64 = await convertToBase64(file);
		const base64String = (base64 as string);
		setSelectedImage(base64String);
		console.log(base64String)
	};


	const uploadImageToImgur = async (base64Image: string) => {
		const url = '/api/users/uploadPicture';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ base64: base64Image }),
		});
		
		const data = await response.text();
		
		return data;


	};

	return (
		<FormWrapper title="Upload Image">
			{previewImage && <img src={previewImage} alt="Profile Image" className="previewImage" style={{maxWidth: "500px", maxHeight: "500px"}}/>}
			<label className="inputTag">
				<text className="inputText">Select Image</text>
				<input type="file" name="myFile" id="file-upload" accept=".jpeg, .png, .jpg" onChange={handleInputChange} className="chooseFile" />
				<span id="imageName"></span>
			</label>
			<Button onClick={handleFileUpload}> Confirm Profile Photo </Button>
		</FormWrapper>
	);
}

function convertToBase64(file: any) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			resolve(fileReader.result);
		};
		fileReader.onerror = (e) => {
			reject(e);
		};
	});
}