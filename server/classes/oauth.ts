import axios from "axios";
import * as queryString from "querystring";

interface Token {
    access_token?: string | null;
    expires_in?: number;
    refresh_token?: string | null;
    scope?: string;
    id_token?: string | null;
    token_type?: string | null;
    expiry_date?: number | null;
}

const scopes = [
    'user-read-currently-playing',
    'user-library-read', 'user-top-read',
    'user-read-recently-played', 'user-read-playback-position',
    'user-read-email', 'playlist-read-private', 'playlist-read-collaborative'
];

const credentials = {
    client_id: '6c7d6c1fdef247438ebe3f46af4aa8b4',
    client_secret: '87bfd5ebe22d439b9083f0b9519042a0',
    redirect_uri: 'http://localhost:3000/api/getSpot',
}

export default class Oauth {
    spotifyGenTokenUrl = (state: string) => {
        const stringifyParams = queryString.stringify({
            response_type: 'code',
            client_id: credentials.client_id,
            redirect_uri: credentials.redirect_uri,
            scope: scopes.join(' '),
            state
        });

        return `https://accounts.spotify.com/authorize?${stringifyParams}`;
    }

    genToken = async (state: string, code: string) => {
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('client_id', credentials.client_id);
        params.append('grant_type', 'authorization_code');
        params.append('client_secret', credentials.client_secret);
        params.append('redirect_uri', credentials.redirect_uri);
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        return await new Promise<Token | null>(resolve => {
            axios.post(
               'https://accounts.spotify.com/api/token',
                params, config
            ).then(res => resolve(res.data as Token))
                .catch(err => {
                    console.log(err);
                    resolve(null);
                })
        })
    }
}
