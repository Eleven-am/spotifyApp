import {NextApiRequest, NextApiResponse} from "next";
import Oauth from "../../../server/classes/oauth";

const oauth = new Oauth();

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        res.status(400).json('Invalid request method');
        return;
    }

    let response: any = {};
    const body = {...req.query};

    if (body.type === 'genSpot') {
        let state = Array.isArray(body.state) ? body.state[0] : body.state;
        res.redirect(307, oauth.spotifyGenTokenUrl(state));
        res.end();
        return;
    }

    if (body.type === 'getSpot') {
        const code = Array.isArray(body.code) ? body.code[0] : body.code;
        response = await oauth.genToken('', code)
    }

    res.status(200).json(response);
}