import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import { SpotifyAlbumSearch, SpotifyArtistSearch, SpotifySongSearch } from "../../components/SpotifySearch";
import GenreSearch from "../../components/GenreSearch";
import { ProfileAlbumSearch, ProfileArtistSearch, ProfileGenreSearch, ProfileSongSearch } from "../../components/ProfileSearches";
import { TextField } from "@mui/material";
import { LoggedInUserContext } from "../../App";
import MenuItem from "@mui/material/MenuItem";

const Container = styled.div`
	min-height: 100vh;
	width: 100%;
	background-image: linear-gradient(to right, #f1c057, #f297a6);
    display: flex;
    flex-direction: column;
`;

const Content = styled.div`
	margin: 0 3rem;
`;

export interface ProfileDetails {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    gender: string;
    age: number;
    profilePicture: string;
    bio: string;
    orientation: string;
    connections?: {
        facebookLink?: string,
        instagramLink?: string,
        twitterLink?: string,
        spotifyLink?: string,
        soundcloudLink?: string,
        youtubeLink?: string,
    }
}


const Settings = () => {

    const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext);
    const [showSearch, setShowSearch] = useState<boolean>(true);
    const switchToRemove = () => setShowSearch(!showSearch);

    const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
        _id: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        gender: "",
        age: 0,
        profilePicture: "",
        connections: {},
        bio: "",
        orientation: "",

    });

    const getProfileDetails = () => {
        const uid = loggedInUser?._id;
        if (uid === undefined) {
            return;
        }

        const url = `/api/users/getProfile/${uid}`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setProfileDetails(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfileDetails((prevState) => ({ ...prevState, [name]: value }));
        console.log(profileDetails)
    };

    const handleConnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value);

        if (value === "") {
            setProfileDetails((prevState) => {
                const connections = { ...prevState.connections };
                delete connections[name as keyof typeof connections];
                return { ...prevState, connections };
            });
        } else {
            setProfileDetails((prevState) => ({
                ...prevState,
                connections: { ...prevState.connections, [name]: value }
            }));
        }
    };



    const [updateResponse, setUpdateResponse] = useState<string>()

    useEffect(() => {
        getProfileDetails();
    }, [loggedInUser])

    const updateProfile = () => {
        const url = `/api/users/updateProfile/`;
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profileDetails),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoggedInUser(data);
                setUpdateResponse(data.message)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const detailsStyle = {
        width: 585.5,
        marginBottom: 20,
        marginRight: 20
    }

    const connectionStyle = {
        width: 784,
        marginBottom: 20,
        marginRight: 25
    }

    return (
        <Container style={{}}>
            <Navbar />

            <Content>

                <br />
                <h1>Profile Details</h1>
                <br />
                <TextField
                    id="changeFirstName"
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                    value={profileDetails.firstName || ''}
                    onChange={handleChange}
                    style={detailsStyle}
                />
                <TextField
                    id="changeLastName"
                    label="Last Name"
                    variant="outlined"
                    name="lastName"
                    value={profileDetails.lastName || ''}
                    onChange={handleChange}
                    style={detailsStyle}
                />
                <TextField
                    id="changeUsername"
                    label="Username"
                    variant="outlined"
                    name="username"
                    value={profileDetails.username || ''}
                    onChange={handleChange}
                    style={detailsStyle}
                />
                <TextField
                    id="changeEmail"
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={profileDetails.email || ''}
                    onChange={handleChange}
                    style={detailsStyle}
                />
                <TextField
                    id="changeBio"
                    label="Bio"
                    variant="outlined"
                    name="bio"
                    value={profileDetails.bio || ''}
                    onChange={handleChange}
                    style={detailsStyle}
                />
                <TextField
                    id="changeAge"
                    label="Age"
                    variant="outlined"
                    name="age"
                    value={profileDetails.age || ''}
                    onChange={handleChange}
                    style={detailsStyle}
                    type="number"
                />
                <TextField
                    select
                    id="changeGender"
                    label="Gender"
                    variant="outlined"
                    name="gender"
                    value={profileDetails.gender || ''}
                    onChange={handleChange}
                    style={detailsStyle}
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </TextField>
                <TextField
                    select
                    id="changeOrientation"
                    label="Preferred Gender of Partner"
                    variant="outlined"
                    name="orientation"
                    value={profileDetails.orientation || ''}
                    onChange={handleChange}
                    style={detailsStyle}
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Both</MenuItem>
                </TextField>



                <div>
                    <h1>Connections</h1>
                    <br />
                    <TextField
                        id="facebookLink"
                        label="Facebook Link"
                        variant="outlined"
                        name="facebookLink"
                        value={profileDetails.connections?.facebookLink || ''}
                        onChange={handleConnChange}
                        style={connectionStyle}
                    />
                    <TextField
                        id="instagramLink"
                        label="Instagram Link"
                        variant="outlined"
                        name="instagramLink"
                        value={profileDetails.connections?.instagramLink || ''}
                        onChange={handleConnChange}
                        style={connectionStyle}
                    />
                    <TextField
                        id="twitterLink"
                        label="Twitter Link"
                        variant="outlined"
                        name="twitterLink"
                        value={profileDetails.connections?.twitterLink || ''}
                        onChange={handleConnChange}
                        style={connectionStyle}
                    />
                    <TextField
                        id="spotifyLink"
                        label="Spotify Link"
                        variant="outlined"
                        name="spotifyLink"
                        value={profileDetails.connections?.spotifyLink || ''}
                        onChange={handleConnChange}
                        style={connectionStyle}
                    />
                    <TextField
                        id="soundcloudLink"
                        label="Soundcloud Link"
                        variant="outlined"
                        name="soundcloudLink"
                        value={profileDetails.connections?.soundcloudLink || ''}
                        onChange={handleConnChange}
                        style={connectionStyle}
                    />
                    <TextField
                        id="youtubeLink"
                        label="Youtube Link"
                        variant="outlined"
                        name="youtubeLink"
                        value={profileDetails.connections?.youtubeLink || ''}
                        onChange={handleConnChange}
                        style={connectionStyle}
                    />
                </div>

                <p> {updateResponse} </p>

                <button onClick={updateProfile}>Update Profile</button>

                <br />
                <br />
                <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", maxWidth: "1200px"}}>
                    {showSearch && (
                        <>
                            <h1 style={{width: "100%"}}>Add your favourites! </h1>
                            <SpotifyArtistSearch />
                            <SpotifySongSearch />
                            <SpotifyAlbumSearch />
                            <GenreSearch />
                        </>
                    )}
                    {!showSearch && (
                        <>
                            <h1 style={{width: "100%"}}>Remove your favourites! </h1>
                            <ProfileArtistSearch />
                            <ProfileSongSearch />
                            <ProfileAlbumSearch />
                            <ProfileGenreSearch />
                        </>
                    )}
                </div>
                <button onClick={() => switchToRemove()}>{showSearch ? 'Switch to Remove' : 'Switch to Add'}</button>


            </Content>
        </Container>
    );
};

export default Settings;
