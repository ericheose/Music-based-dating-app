import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Autocomplete, TextField } from '@mui/material';

const Container = styled.div`
    display: flex;
    width: 500px;
    align-items: center;
`;


interface Result {
    id: string;
    name: string;
}

interface Props {
    resultsList(query?: string): Result[] | Promise<Result[]>;
    onSelect?: (id: string, name: string) => void;
    loadingText?: string;
    searchPlaceholder?: string;
    displayCount?: number;
    filter?: boolean;
}

const LiveSearch = ({ resultsList: getResults, onSelect, loadingText, searchPlaceholder, displayCount, filter }: Props) => {
    const [results, setResults] = useState<Result[]>([]);

    const handleOnChange = (value: string) => {
        if (onSelect) {
            const result = results.find((r) => r.name === value);
            if (result) {
                onSelect(result.id, result.name);
            }
        }
    };

    let sliceMax = 5;
    if (displayCount) {
        sliceMax = displayCount;
    }

    return (
        <Container className="live-search">
            <Autocomplete
                options={results.map((result) => result.name)}
                filterOptions={(options, { inputValue }) => {
                    let filteredOptions = options.filter((option) => option);
                    if (filter) {
                        filteredOptions = options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()));
                    }
                    return filteredOptions.slice(0, sliceMax);
                }}
                id="artistSearch"
                className="largeInputField"
                fullWidth
                loading
                loadingText={loadingText || "Search"}
                onInputChange={async (event, value) => {
                    const results = await getResults(value);
                    setResults(results);
                }}
                onChange={(event, value) => {
                    if (value) {
                        handleOnChange(value);
                    }
                }}
                renderInput={(params) => <TextField {...params} label={searchPlaceholder || "Search"} />}
            />
        </Container>
    );
};

export default LiveSearch;