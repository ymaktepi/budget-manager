import {google} from "googleapis";
import {Credentials, OAuth2Client} from "google-auth-library";
import {CLIENT_ID, CLIENT_SECRET, REDIRECT_URL} from "./credentials";
import {debug} from "./simpleLogger";

const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file";

export function getNewClient(): OAuth2Client {
    return new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URL,
    );
}

export function getClientFromStorage(): OAuth2Client | undefined {
    let client = getNewClient();
    const credentials = getTokensFromStorage();
    if(!credentials) {
        return undefined;
    }
    client.setCredentials(credentials);
    return client;
}

export function getAuthUrl(client: OAuth2Client) {
    return client.generateAuthUrl({
        scope: SCOPES,
    });
}

export function generateToken() {
    window.location.replace(getAuthUrl(getNewClient()));
}

export function saveTokens(tokens: Credentials) {
    localStorage.setItem("credentials", JSON.stringify(tokens));
}

export function getTokensFromStorage(): Credentials | undefined {
    const tokens = localStorage.getItem("credentials");
    if(tokens === null) {
        debug("No tokens in storage");
        return undefined;
    }
    const credentials = JSON.parse(tokens) as Credentials;
    if(credentials.expiry_date === undefined || credentials.expiry_date === null) {
        debug("No expiry date", credentials);
        return undefined;
    }
    const now = Date.now();
    if (credentials.expiry_date > now) {
        return credentials;
    } else {
        debug(`expiry date: ${now} is not before ${credentials.expiry_date}`);
        localStorage.removeItem("credentials");
        return undefined;
    }
}

export function redirectToAuth(){
    window.location.replace("/auth");
}