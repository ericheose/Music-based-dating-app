import { Box } from '@mui/material';

export type SpotifyContentProps = {
    spotifyURL: string;
    trackType: string;
  };

const SpotifyModal: React.FC<SpotifyContentProps> = ({ spotifyURL, trackType }) => {
  return (
    <Box>
      <iframe style={{borderRadius:"12px", border:"none"}} 
        src={`https://open.spotify.com/embed/${trackType}/${spotifyURL}?utm_source=generator`}
        width="100%" 
        height="352" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"></iframe>
    </Box>
  );
};

export default SpotifyModal;