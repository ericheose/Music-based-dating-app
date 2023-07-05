import { FormWrapper } from "../../../components/form/FormWrapper";
import TextField from "@mui/material/TextField";
import PreferenceSearch from "./PreferenceSearch";
import { SpotifyItem } from "../../../components/SpotifySearch";

import "../../../styles/form.css";
import { useState } from "react";
import GenreSearch from "../../../components/GenreSearch";

type UserData = {
	favouriteSongs: SpotifyItem[];
	favouriteArtists: SpotifyItem[];
	favouriteAlbums: SpotifyItem[];
	favouriteGenres: SpotifyItem[];
};

type UserFormProps = UserData & {
	updateFields: (fields: Partial<UserData>) => void;
};

export function PreferenceForm({ favouriteSongs, favouriteArtists, favouriteAlbums, favouriteGenres, updateFields }: UserFormProps) {
	const [selectedArtist, setSelectedArtist] = useState<Array<SpotifyItem>>([]);
	const [selectedSongs, setSelectedSongs] = useState<Array<SpotifyItem>>([]);
	const [selectedAlbum, setSelectedAlbum] = useState<Array<SpotifyItem>>([]);
	const [selectedGenre, setSelectedGenre] = useState<Array<SpotifyItem>>([]);

	const handleSongSelect = (id: string, name: string) => {
		setSelectedSongs([...selectedSongs, { id, name }]);
		updateFields({ favouriteSongs: [...selectedSongs, { id, name }] });
	};

    const handleArtistSelect = (id: string, name: string) => {
        setSelectedArtist([...selectedArtist, { id, name }]);
        updateFields({ favouriteArtists: [...selectedArtist, { id, name }] });
    };

    const handleAlbumSelect = (id: string, name: string) => {
        setSelectedAlbum([...selectedAlbum, { id, name }]);
        updateFields({ favouriteAlbums: [...selectedAlbum, { id, name }] });
    };

    const handleGenreSelect = (id: string, name: string) => {
        setSelectedGenre([...selectedGenre, { id, name }]);
        updateFields({ favouriteGenres: [...selectedGenre, { id, name }] });
    };

	return (
		<FormWrapper title="User Details">
			<PreferenceSearch onSelect={handleSongSelect} searchType="track" />
            <PreferenceSearch onSelect={handleArtistSelect} searchType="artist" />
            <PreferenceSearch onSelect={handleAlbumSelect} searchType="album" />
		</FormWrapper>
	);
}
