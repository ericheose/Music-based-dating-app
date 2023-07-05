const clientId = 'c7aa975fa0d84326b978398b21a8eac5';
const clientSecret = '6c72a39903a04303a57d2c1aca439896';

async function getSpotifyToken() {
    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials' +
            '&client_id=' + encodeURIComponent(clientId) +
            '&client_secret=' + encodeURIComponent(clientSecret)
    })
    .then(response => response.json())
    .catch(error => console.error(error));
}

async function searchSpotify(token: string, query: string, type: string) {
    return fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent(query) + '&type=' + encodeURIComponent(type), {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .catch(error => console.error(error));
}



export { getSpotifyToken, searchSpotify };