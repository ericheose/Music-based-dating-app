import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LiveSearch from './LiveSearch';

interface Props {
    onSelect: (id: string, value: string) => void;
}
interface Result {
    id: string;
    name: string;
}

const genres: Result[] = [
    { id: '0', name: 'pop' },
    { id: '1', name: 'rock' },
    { id: '2', name: 'hip-hop' },
    { id: '3', name: 'electronic' },
    { id: '4', name: 'country' },
    { id: '5', name: 'jazz' },
    { id: '6', name: 'classical' },
    { id: '7', name: 'metal' },
    { id: '8', name: 'punk' },
    { id: '9', name: 'indie' },
    { id: '10', name: 'alternative' },
    { id: '11', name: 'folk' },
    { id: '12', name: 'r&b' },
    { id: '13', name: 'soul' },
    { id: '14', name: 'reggae' },
    { id: '15', name: 'blues' },
    { id: '16', name: 'funk' },
    { id: '17', name: 'disco' },
    { id: '18', name: 'dance' },
    { id: '19', name: 'techno' },
    { id: '20', name: 'house' },
    { id: '21', name: 'ambient' },
    { id: '22', name: 'chill' },
    { id: '23', name: 'lo-fi' },
    { id: '24', name: 'instrumental' },
    { id: '25', name: 'acoustic' },
    { id: '26', name: 'singer-songwriter' },
    { id: '27', name: 'emo' },
    { id: '28', name: 'gospel' },
    { id: '29', name: 'christian' },
    { id: '30', name: 'holiday' },
    { id: '31', name: 'christmas' },
    { id: '32', name: 'k-pop' },
    { id: '33', name: 'j-pop' },
    { id: '34', name: 'latin' },
    { id: '35', name: 'reggaeton' },
    { id: '36', name: 'ska' },
    { id: '37', name: 'bluegrass' },
];

const getGenreFromQuery = async (query?: string): Promise<Result[]> => {
    if (!query) {
        return [];
    }
    const results = genres.filter((genre) => genre.name.toLowerCase().startsWith(query.toLowerCase()));
    return results;
};


const GenreSearch = () => {


    const [selectedGenre, setSelectedGenre] = useState<Array<{ id: string; name: string; }>>([]);
    const genreOnSelect = (id: string, name: string) => setSelectedGenre([...selectedGenre, { id, name }]);
    
    const handleAddGenre = () => {
        addToProfile(selectedGenre);
        setSelectedGenre([]);
    };


    const addToProfile = (toAdd: Array<object>) => {
        const url = `/api/users/addToProfile?type=Genre`;
    
        for (const item of toAdd) {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            })
                .then((res) => res.json())
                .then (() => {
                    location.reload();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <div>
            <LiveSearch
                resultsList={getGenreFromQuery}
                onSelect={genreOnSelect}
                loadingText='Search for a genre...'
                searchPlaceholder='Genre Search'
            />
            <button style={{ marginTop: "0.3rem"}} onClick={() =>handleAddGenre()}>Add Genre</button>
            <div>
                {selectedGenre.map((genre) => (
                    <div key={genre.id}>
                        {genre.name}
                    </div>
                ))}
            </div>
            <br />
        </div>
        
    );
};

export default GenreSearch;

