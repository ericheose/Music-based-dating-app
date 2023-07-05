import { useEffect } from "react";
import { Match } from "../../../models/matchModel"
import { MatchDisplayData } from "./MatchDisplay"

const mouseMoveBackground = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    const targetRect = target.getBoundingClientRect(),
        relX = e.pageX - targetRect.left,
        relY = e.pageY - targetRect.top;

    target.style.setProperty("--mouse-x", relX + "px");
    target.style.setProperty("--mouse-y", relY + "px");
}

const MatchCard: React.FC<{match:MatchDisplayData}> = ({match}) => {

    const songs = match.sharedMusic.sharedSongs.map(allSongs => allSongs.name);
    const artists = match.sharedMusic.sharedArtists.map(allArtists => allArtists.name);
    const albums = match.sharedMusic.sharedAlbums.map(allAlbums => allAlbums.name);
    const genres = match.sharedMusic.sharedGenres.map(allGenres => allGenres.name);

    useEffect(() => {
		const matchCards = document.querySelectorAll<HTMLElement>(".matchCard");
        for (const matchCard of matchCards) {
            matchCard.addEventListener("mousemove", mouseMoveBackground);
        }
        return () => {
            for (const matchCard of matchCards) {
                matchCard.removeEventListener("mousemove", mouseMoveBackground);
            }
        };
	}, []);

    return (
        <div key={match.matchId} className="matchCard">
            <div className="topRowMatch">
                <div className="matchSelfUser">
                    <p>{match.currentUser.firstName} {match.currentUser.lastName}</p>
                    <img className="profileImage" src={match.currentUser.profilePicture}/>
                    <p>@{match.currentUser.username}</p>
                </div>
                <div className="matchSymbol">
                    <img src="images/harmony.svg"/>
                </div>
                <div className="matchedUser">
                    <p>{match.matchedWithUser.firstName} {match.matchedWithUser.lastName}</p>
                    <img className="profileImage" src={match.matchedWithUser.profilePicture}/>
                    <p>@{match.matchedWithUser.username}</p>
                </div>

            </div>
            <div className="bottomRowMatch">
                <p>You Rhythmically Related to the music of:</p>
            </div>
            <div className="matchedMusicInfo">
                <br/>
                {songs.length > 0 && <p>Songs: {songs.join(', ')}</p>}
                {artists.length > 0 && <p>Artists: {artists.join(', ')}</p>}
                {albums.length > 0 && <p>Albums: {albums.join(', ')}</p>}
                {genres.length > 0 && <p>Genres: {genres.join(', ')}</p>}
            </div>
        </div>
    )
}

export default MatchCard