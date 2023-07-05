import React, { useState } from "react";
import LiveSearch from "../../../components/LiveSearch";
import { searchSpotify } from "../../../components/SpotifySearch";
import "../../../styles/PreferenceSearch.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface Props {
	onSelect: (id: string, value: string) => void;
	searchType: "track" | "artist" | "album" | "genre";
}

export interface SpotifyItem {
	id: string;
	name: string;
}

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

const PreferenceSearch = ({ onSelect, searchType }: Props) => {
	const [selected, setSelected] = useState<Array<SpotifyItem>>([]);
	const getSongFromQuery = (query: string) => searchSpotify(query, searchType);

	const handleOnSelect = (id: string, name: string) => {
		onSelect(id, name);
		setSelected([...selected, { id, name }]);
	};
	console.log(selected)

	return (
		<div>
			<ThemeProvider theme={inputTheme}>
				<LiveSearch resultsList={getSongFromQuery} onSelect={handleOnSelect} loadingText={"Search for a " + searchType + "..."} searchPlaceholder={searchType.charAt(0).toUpperCase() + searchType.slice(1) + " Search"} />
				<div id="content">
					{selected.map((item) => (
						<div className="badge" key={item.id}>
							{item.name}
						</div>
					))}
				</div>
			</ThemeProvider>
		</div>
	);
};

export default PreferenceSearch;
