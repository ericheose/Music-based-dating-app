import express from 'express';
import { getSpotifyToken, searchSpotify } from '../controllers/spotifyMethods';

interface SpotifySearchResponse {
    error?: {
        status: number;
        message: string;
    };
    artists?: {
        items: {
            id: string;
            name: string;
        }[];
    };
    albums?: {
        items: {
            id: string;
            name: string;
        }[];
    };
}

const router = express.Router();

router.get('/getSpotifyToken', async (req, res) => {
    try {
        const data = await getSpotifyToken();
        return res.json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/searchSpotify', async (req, res) => {
    try {
        
        const token = req.query.spotifyToken;
        const { query } = req.query;
        const type = req.query.type;
        if (token && query && type) {
            const data = await searchSpotify(token.toString(), query.toString(), type.toString()) as SpotifySearchResponse;
            if (data.error && data.error.status === 401) {
                return res.status(401).json({ message: 'Invalid token' });
            } 
            return res.json(data);
        } else {
            return res.status(400).json({ message: 'Missing token or query' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;