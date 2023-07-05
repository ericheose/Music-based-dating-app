import Navbar from "../../components/Navbar";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import "./Profile.css";
import { useEffect, useState } from "react";
import { Modal } from '@mui/material';
import SpotifyModal from "./SpotifyModal";
import { SpotifyContentProps } from "./SpotifyModal";

const hslToRgb = (h: number, s: number, l: number): number[] => {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hueToRgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const isLight = (color: number[]): boolean => {
    const r = color[0];
    const g = color[1];
    const b = color[2];
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
};

const randomHSL = (): { color: string; isLight: boolean } => {
    const h = Math.random();
    const s = Math.floor(Math.random() * 80) / 100 + 0.2;
    const l = Math.floor(Math.random() * 80) / 100 + 0.2;
    const color = `hsl(${Math.floor(h * 360)}, ${Math.floor(s * 100)}%, ${Math.floor(l * 100)}%)`;
    const rgbColor = hslToRgb(h, s, l);
    return {
        color,
        isLight: isLight(rgbColor),
    };
};
export interface ProfileProps {
    firstName: string;
    lastName: string;
    age: number;
    bio: string;
    profilePicture: string;
    favouriteArtists: { id: string, name: string }[]
    favouriteSongs: { id: string, name: string }[]
    favouriteAlbums: { id: string, name: string }[]
    favouriteGenres: { id: string, name: string }[]
    connections: {
        facebookLink?: string,
        instagramLink?: string,
        twitterLink?: string,
        spotifyLink?: string,
        soundcloudLink?: string,
        youtubeLink?: string;
    }
}

const mouseMoveBackground = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    const targetRect = target.getBoundingClientRect(),
        relX = e.pageX - targetRect.left,
        relY = e.pageY - targetRect.top;

    target.style.setProperty("--mouse-x", relX + "px");
    target.style.setProperty("--mouse-y", relY + "px");
}

const getUserProfile = (urlID: string) => {

    const url = `/api/users/getProfile/${urlID}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .catch(() => {
            throw new Error("Error in fetch url");
        });
};

const Profile: React.FC = () => {
    const { urlID } = useParams();

    const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const [spotifyProps, setSpotifyProps] = useState<SpotifyContentProps>({
        spotifyURL: '',
        trackType: '',
    });

    const handleOpen = (id: string, type: string) => {
        setSpotifyProps({
            spotifyURL: id,
            trackType: type,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [profileInfo, setProfileInfo] = useState<ProfileProps>({
        firstName: '',
        lastName: '',
        age: 0,
        bio: '',
        profilePicture: '',
        favouriteArtists: [],
        favouriteSongs: [],
        favouriteAlbums: [],
        favouriteGenres: [],
        connections: {}
    });

    useEffect(() => {
        if (urlID != undefined) {
            (async () => {
                const data = await getUserProfile(urlID);
                setProfileInfo(data);
                setFetchSuccess(true);
            })().finally(() => {
                setLoading(false);
            });
        }

        const musicCards = document.querySelectorAll<HTMLElement>(".musicCard");
        for (const musicCard of musicCards) {
            musicCard.addEventListener("mousemove", mouseMoveBackground);
        }
        return () => {
            for (const musicCard of musicCards) {
                musicCard.removeEventListener("mousemove", mouseMoveBackground);
            }
        };
    }, [urlID]);

    if (loading) {
        return (
            <div id="gradientBackground">
                <Navbar />
                <h1>Loading...</h1>
            </div>
        );
    }



    if (fetchSuccess) {
        return (
            <div id="gradientBackground">
                <Navbar />
                <div id="topRow">
                    <div className="musicCard" style={{ marginLeft: '6rem', marginRight: '2rem' }}>
                        <h2>Songs</h2>
                        <div className="interests-grid">
                            {profileInfo.favouriteSongs.map((song, index) => {
                                const { color, isLight } = randomHSL();
                                return (
                                    <div
                                        key={index}
                                        className={`interest-item ${isLight ? "light" : "dark"}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleOpen(song.id, 'track')}
                                    >
                                        {song.name}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                    <div id="nameAndPicture">
                        <div id="picture">
                            <img src={profileInfo.profilePicture} style={{maxWidth: "400px", aspectRatio: "1 / 1"}} alt="Profile Picture" />
                        </div>
                        <div id="name">
                            <h1>{profileInfo.firstName} {profileInfo.lastName}</h1>
                        </div>
                    </div>
                    <div className="musicCard" style={{ marginLeft: '2rem', marginRight: '6rem' }}>
                        <h2>Artists</h2>
                        <div className="interests-grid">
                            {profileInfo.favouriteArtists.map((artist, index) => {
                                const { color, isLight } = randomHSL();
                                return (
                                    <div
                                        key={index}
                                        className={`interest-item ${isLight ? "light" : "dark"}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleOpen(artist.id, 'artist')}
                                    >
                                        {artist.name}
                                    </div>
                                );
                            })}
                        </div>


                    </div>
                </div>
                <div id="bottomRow">
                    <div className="musicCard" style={{ marginLeft: '3rem', marginRight: '5rem' }}>
                        <h2>Albums</h2>
                        <div className="interests-grid">
                            {profileInfo.favouriteAlbums.map((album, index) => {
                                const { color, isLight } = randomHSL();
                                return (
                                    <div
                                        key={index}
                                        className={`interest-item ${isLight ? "light" : "dark"}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleOpen(album.id, 'album')}
                                    >
                                        {album.name}
                                    </div>
                                );
                            })}
                        </div>


                    </div>
                    <div id="connections">
                    {Object.values(profileInfo.connections).some(val => val !== "") && 
                            <div>
                                <h2>Connections</h2>
                                <div id="connections-grid">
                                    {
                                        profileInfo.connections.facebookLink != undefined && profileInfo.connections.facebookLink != "" &&
                                        <a href={profileInfo.connections.facebookLink} target="_blank" rel="noreferrer">
                                            <img src={`https://i.imgur.com/VrXj4bs.png`} alt="Facebook" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                        </a>
                                    }
                                    {profileInfo.connections.instagramLink != undefined && profileInfo.connections.instagramLink != "" &&
                                        <a href={profileInfo.connections.instagramLink} target="_blank" rel="noreferrer">
                                            <img src={`https://i.imgur.com/Vys6nrM.png`} alt="Instagram" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                        </a>
                                    }
                                    {profileInfo.connections.twitterLink != undefined && profileInfo.connections.twitterLink != "" &&
                                        <a href={profileInfo.connections.twitterLink} target="_blank" rel="noreferrer">
                                            <img src={`https://i.imgur.com/XaBMSy8.png`} alt="Twitter" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                        </a>
                                    }
                                    {profileInfo.connections.spotifyLink != undefined && profileInfo.connections.spotifyLink != "" &&
                                        <a href={profileInfo.connections.spotifyLink} target="_blank" rel="noreferrer">
                                            <img src={`https://i.imgur.com/5bfBM3c.png`} alt="Spotify" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                        </a>
                                    }
                                    {profileInfo.connections.soundcloudLink != undefined && profileInfo.connections.soundcloudLink != "" &&
                                        <a href={profileInfo.connections.soundcloudLink} target="_blank" rel="noreferrer">
                                            <img src={`https://i.imgur.com/ARAR7BW.png`} alt="Soundcloud" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                        </a>
                                    }
                                    {profileInfo.connections.youtubeLink != undefined && profileInfo.connections.youtubeLink != "" &&
                                        <a href={profileInfo.connections.youtubeLink} target="_blank" rel="noreferrer">
                                            <img src={`https://i.imgur.com/57ymTfR.png`} alt="Youtube" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                        </a>
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    <div id="bio">
                        <h2>Bio</h2>
                        <p>{profileInfo.bio}</p>
                    </div>
                    <div className="musicCard" style={{ marginLeft: '5rem', marginRight: '3rem' }}>
                        <h2>Genres</h2>
                        <div className="interests-grid">
                            {profileInfo.favouriteGenres.map((genre, index) => {
                                const { color, isLight } = randomHSL();
                                return (
                                    <div
                                        key={index}
                                        className={`interest-item ${isLight ? "light" : "dark"}`}
                                        style={{ backgroundColor: color }}
                                    >
                                        {genre.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <Modal open={open} onClose={handleClose} style={{maxWidth: '500px'}}>
                    <div id="spotifyModalDiv" onClick={handleClose}>
                        <SpotifyModal spotifyURL={spotifyProps.spotifyURL} trackType={spotifyProps.trackType}/>
                    </div>
                </Modal>
            </div>
        );
    }

    return (
        <div id="gradientBackground">
            <Navbar />
            <h1>Error 404 Profile Not Found</h1>
        </div>
    );

};

export default Profile;
