import { getSpotifyToken, searchSpotify } from '../controllers/spotifyMethods';

const clientId = 'c7aa975fa0d84326b978398b21a8eac5';
const clientSecret = '6c72a39903a04303a57d2c1aca439896';

describe('Spotify API', () => {
  beforeEach(() => {
    jest.resetModules(); // Reset modules before each test to clear any cached values
  });

  describe('getSpotifyToken', () => {
    it('returns the access token', async () => {
      const mockToken = 'mock_token';
      const mockResponse = {
        access_token: mockToken,
        expires_in: 3600,
        token_type: 'Bearer'
      };

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse)
      });

      const token = await getSpotifyToken();

      expect(token.access_token).toBe(mockToken);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials' +
          '&client_id=' + encodeURIComponent(clientId) +
          '&client_secret=' + encodeURIComponent(clientSecret)
      });
    });

    it('handles errors', async () => {
      const mockError = new Error('Something went wrong');
      global.fetch = jest.fn().mockRejectedValue(mockError);

      console.error = jest.fn(); // Mock console.error to silence output during tests

      const token = await getSpotifyToken();

      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(token).toBeUndefined();
    });

    describe('searchSpotify', () => {
      const mockToken = 'mock_token';
      const mockQuery = 'mock_query';
      const mockType = 'mock_type';
      const mockResponse = { tracks: { items: [] } };

      it('returns the search results', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockResponse)
        });

        const result = await searchSpotify(mockToken, mockQuery, mockType);

        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(mockQuery)}&type=${encodeURIComponent(mockType)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${mockToken}`
            }
          }
        );
      });

      it('handles errors', async () => {
        const mockError = new Error('Something went wrong');
        global.fetch = jest.fn().mockRejectedValue(mockError);

        console.error = jest.fn(); // Mock console.error to silence output during tests
        const result = await searchSpotify(mockToken, mockQuery, mockType);

        expect(console.error).toHaveBeenCalledWith(mockError);
        expect(result).toBeUndefined();
      });

      it('handles empty search results', async () => {
        const emptyResponse = { tracks: { items: [] } };

        global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue(emptyResponse)
        });

        const result = await searchSpotify(mockToken, mockQuery, mockType);

        expect(result).toEqual(emptyResponse);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(mockQuery)}&type=${encodeURIComponent(mockType)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${mockToken}`
            }
          }
        );
      });

      it('handles missing items in search response', async () => {
        const responseWithMissingItems = { tracks: {} };

        global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue(responseWithMissingItems)
        });

        const result = await searchSpotify(mockToken, mockQuery, mockType);

        expect(result).toEqual(responseWithMissingItems);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(mockQuery)}&type=${encodeURIComponent(mockType)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${mockToken}`
            }
          }
        );
      });
    });
  });
});



