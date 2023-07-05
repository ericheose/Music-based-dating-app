import { useState } from "react";
import LiveSearch from "./LiveSearch";

interface Props {
    showRemove?: boolean;
}

interface ProfileSearchResponse {
    error?: {
        status: number;
        message: string;
    };
    favouriteSongs?: {
        id: string; name: string;
    }[];
    favouriteArtists?: {
        id: string; name: string;
    }[];
    favouriteAlbums?: {
        id: string; name: string;
    }[];
    favouriteGenres?: {
        id: string; name: string;
    }[];
}

const getItemsByType = (data: ProfileSearchResponse, type: string): { id: string; name: string }[] | undefined => {
    switch (type) {
        case 'Song':
            return data.favouriteSongs;
        case 'Artist':
            return data.favouriteArtists;
        case 'Album':
            return data.favouriteAlbums;
        case 'Genre':
            return data.favouriteGenres;
        default:
            return undefined;
    }
}

const removeFromProfile = (type: string, toRemove: Array<object>) => {
    const url = `/api/users/removeFromProfile?type=${type}`

    for (const item of toRemove) {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        }).then((res) => res.json())
            .then((data) => {
                location.reload()
            }).catch((error) => {
                console.error(error);
            }
            );
    }
}


const getFromProfile = async (type: string): Promise<{ id: string; name: string; }[]> => {
    const url = `/api/users/getProfileMusic?type=${type}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json() as ProfileSearchResponse;
    const items = getItemsByType(data, type);
    return items || [];
}

const getSongFromProfile = () => getFromProfile('Song');
const getArtistFromProfile = () => getFromProfile('Artist');
const getAlbumFromProfile = () => getFromProfile('Album');
const getGenreFromProfile = () => getFromProfile('Genre');

const ProfileSongSearch = ({ showRemove = true }: Props) => {
    const [profileSelectedSong, setProfileSelectedSong] = useState<Array<{ id: string; name: string; }>>([]);
    const profileArtistOnSelect = (id: string, name: string) => setProfileSelectedSong([...profileSelectedSong, { id, name }]);

    const handleRemoveSong = () => {
        removeFromProfile('Song', profileSelectedSong);
        setProfileSelectedSong([]);
    }
    return (
        <div>
            <LiveSearch
                resultsList={getSongFromProfile}
                onSelect={profileArtistOnSelect}
                loadingText='Search for your songs...'
                searchPlaceholder='Your Songs '
                displayCount={100}
                filter
            />
            <div>
            {showRemove && <button style={{ marginTop: "0.3rem"}} onClick={() => handleRemoveSong()}>Remove Songs</button>}
                {profileSelectedSong.map((song) => (
                    <div key={song.id}>
                        {song.name}
                    </div>
                ))}
            </div>
            <br />
        </div>
    );
};

const ProfileArtistSearch = ({ showRemove = true }: Props) => {
    const [profileSelectedArtist, setProfileSelectedArtist] = useState<Array<{ id: string; name: string; }>>([]);
    const profileArtistOnSelect = (id: string, name: string) => setProfileSelectedArtist([...profileSelectedArtist, { id, name }]);

    const handleRemoveArtist = () => {
        removeFromProfile('Artist', profileSelectedArtist);
        setProfileSelectedArtist([]);
    }

    return (
        <div>
            <LiveSearch
                resultsList={getArtistFromProfile}
                onSelect={profileArtistOnSelect}
                loadingText='Search for your artists...'
                searchPlaceholder='Your Artists '
                displayCount={100}
                filter
            />
            {showRemove && <button style={{ marginTop: "0.3rem"}} onClick={() => handleRemoveArtist()}>Remove Artists</button>}
            <div>
                {profileSelectedArtist.map((artist) => (
                    <div key={artist.id}>
                        {artist.name}
                    </div>
                ))}
            </div>
            <br />
        </div>
    );
};

const ProfileAlbumSearch = ({ showRemove = true }: Props) => {
    const [profileSelectedAlbum, setProfileSelectedAlbum] = useState<Array<{ id: string; name: string; }>>([]);
    const profileAlbumOnSelect = (id: string, name: string) => setProfileSelectedAlbum([...profileSelectedAlbum, { id, name }]);

    const handleRemoveAlbum = () => {
        removeFromProfile('Album', profileSelectedAlbum);
        setProfileSelectedAlbum([]);
    }

    return (
        <div>
            <LiveSearch
                resultsList={getAlbumFromProfile}
                onSelect={profileAlbumOnSelect}
                loadingText='Search for your albums...'
                searchPlaceholder='Your Albums '
                displayCount={100}
                filter
            />
            {showRemove && <button style={{ marginTop: "0.3rem"}} onClick={() => handleRemoveAlbum()}>Remove Artists</button>}
            <div>
                {profileSelectedAlbum.map((album) => (
                    <div key={album.id}>
                        {album.name}
                    </div>
                ))}
            </div>
            <br />
        </div>
    );
};

const ProfileGenreSearch = ({ showRemove = true }: Props) => {
    const [profileSelectedGenre, setProfileSelectedGenre] = useState<Array<{ id: string; name: string; }>>([]);
    const profileGenreOnSelect = (id: string, name: string) => setProfileSelectedGenre([...profileSelectedGenre, { id, name }]);

    const handleRemoveGenre = () => {
        removeFromProfile('Genre', profileSelectedGenre);
        setProfileSelectedGenre([]);
    }
    return (
        <div>
            <LiveSearch
                resultsList={getGenreFromProfile}
                onSelect={profileGenreOnSelect}
                loadingText='Search for your genres...'
                searchPlaceholder='Your Genres '
                displayCount={100}
                filter
            />
            {showRemove && <button style={{ marginTop: "0.3rem"}} onClick={() => handleRemoveGenre()}>Remove Genre</button>}
            <div>
                {profileSelectedGenre.map((genre) => (
                    <div key={genre.id}>
                        {genre.name}
                    </div>
                ))}
            </div>
            <br />
        </div>
    );
};


export { ProfileArtistSearch, ProfileSongSearch, ProfileAlbumSearch, ProfileGenreSearch };