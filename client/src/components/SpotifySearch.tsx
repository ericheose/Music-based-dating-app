import { useState } from "react";
import LiveSearch from "./LiveSearch";


interface Props {
    onSelect?: (id: string, value: string) => void;
}

interface SpotifyAccessTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export interface SpotifyItem {
    id: string;
    name: string;
    artists?: [{
        name: string;
    }]
}

interface SpotifySearchResponse {
    error?: {
        status: number;
        message: string;
    };
    artists?: {
        items: SpotifyItem[];
    };
    tracks?: {
        items: SpotifyItem[];
    };
    albums?: {
        items: SpotifyItem[];
    };
    genres?: {
        items: SpotifyItem[];
    };
}

function getItemsByType(data: SpotifySearchResponse, type: string): SpotifyItem[] | undefined {
    switch (type) {
        case "artist":
            return data.artists?.items;
        case "track":
            return data.tracks?.items;
        case "album":
            return data.albums?.items;
        default:
            return undefined;
    }
}


const getAccessToken = async () => {
    const response = await fetch("/api/spotify/getSpotifyToken", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = (await response.json()) as SpotifyAccessTokenResponse;
    localStorage.setItem("spotifyToken", data.access_token);
};

const searchSpotify = async (query: string, type: string): Promise<{ id: string; name: string; }[]> => {
    const spotifyToken = localStorage.getItem("spotifyToken");
    if (query === "") {
        return [];
    }
    if (!spotifyToken) {
        await getAccessToken();
        return searchSpotify(query, type);
    }
    const url = `/api/spotify/searchSpotify?spotifyToken=${encodeURIComponent(spotifyToken)}&query=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json() as SpotifySearchResponse;

    if (response.status === 401) {
        await getAccessToken();
        return searchSpotify(query, type);
    }

    const items = getItemsByType(data, type);

    // Add artist name to the label of songs and albums to display to user
    const filteredItems = items?.map((item) => {
        if (item.artists) {
            const label = item.name + " - " + item.artists[0].name;
            return { id: item.id, name: label };
        }
        return { id: item.id, name: item.name };
    });
    
    return filteredItems || [];
};


const addToProfile = (type: string, toAdd: Array<object>) => {
    const url = `/api/users/addToProfile?type=${type}`;

    for (const item of toAdd) {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
            .then((res) => res.json())
            .then(() => {
                location.reload();
            })
            .catch((error) => {
                console.error(error);
            });
    }
};

const SpotifyArtistSearch = () => {

    const [selectedArtist, setSelectedArtist] = useState<Array<{ id: string; name: string; }>>([]);
    const artistOnSelect = (id: string, name: string) => setSelectedArtist([...selectedArtist, { id, name }]);

    const getArtistFromQuery = (query: string) => searchSpotify(query, 'artist');

    const handleAddArtist = () => {
        addToProfile('Artist', selectedArtist);
        setSelectedArtist([]);
    };

    return (
        <div>
            <LiveSearch
                resultsList={getArtistFromQuery}
                onSelect={artistOnSelect}
                loadingText='Search for an artist...'
                searchPlaceholder='Artist Search'
            />
            <button style={{ marginTop: "0.3rem"}} onClick={() => handleAddArtist()}>Add Artists</button>
            <div>
                {selectedArtist.map((artist) => (
                    <div key={artist.id}>
                        {artist.name}
                    </div>
                ))}
            </div>
            <br />

        </div>
    );
};

const SpotifySongSearch = () => {

    const [selectedSong, setSelectedSong] = useState<Array<{ id: string; name: string; }>>([]);
    const songOnSelect = (id: string, name: string) => setSelectedSong([...selectedSong, { id, name }]);
    const getSongFromQuery = (query: string) => searchSpotify(query, 'track');

    const handleAddSong = () => {
        addToProfile('Song', selectedSong);
        setSelectedSong([]);
    };

    return (
        <div>
            <LiveSearch
                resultsList={getSongFromQuery}
                onSelect={songOnSelect}
                loadingText='Search for a song...'
                searchPlaceholder='Song Search'
            />
            <button style={{ marginTop: "0.3rem"}} onClick={() => handleAddSong()}>Add Songs</button>
            <div>
                {selectedSong.map((song) => (
                    <div key={song.id}>
                        {song.name}
                    </div>
                ))}
            </div>
            <br />
        </div>
    );
};

const SpotifyAlbumSearch = () => {

    const [selectedAlbum, setSelectedAlbum] = useState<Array<{ id: string; name: string; }>>([]);
    const albumOnSelect = (id: string, name: string) => setSelectedAlbum([...selectedAlbum, { id, name }]);
    const getAlbumFromQuery = (query: string) => searchSpotify(query, 'album');

    const handleAddAlbum = () => {
        addToProfile('Album', selectedAlbum);
        setSelectedAlbum([]);
    };

    return (
        <div>
            <LiveSearch
                resultsList={getAlbumFromQuery}
                onSelect={albumOnSelect}
                loadingText='Search for an album...'
                searchPlaceholder='Album Search'
            />
            <button style={{ marginTop: "0.3rem"}} onClick={() => handleAddAlbum()}>Add Albums</button>
            <div>
                {selectedAlbum.map((album) => (
                    <div key={album.id}>
                        {album.name}
                    </div>
                ))}
            </div>
            <br />
        </div>
    );
};

export { SpotifyArtistSearch, SpotifySongSearch, SpotifyAlbumSearch, searchSpotify };

