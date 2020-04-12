import {google} from "googleapis";
import {Credentials, OAuth2Client} from "google-auth-library";
import {CLIENT_ID, CLIENT_SECRET, REDIRECT_URL} from "../config";
import {debug} from "./simpleLogger";

const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// need to renew authentication. tokens are valid 1h.
// 5 seconds before this hour is passed, auth is triggered again
const MILLISECONDS_TO_EXPIRACY_RENEW = 5000;

const CREDENTIALS_KEY = "credentials";

export const getNewClient = (): OAuth2Client => {
    return new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URL,
    );
};

export const getClientFromStorageOrRedirect = (): OAuth2Client => {
    const client = getClientFromStorage();
    if (client === undefined) {
        redirectToAuth();
        // @ts-ignore redirect happens before anything is returned
        return;
    }
    return client;
};

export const getClientFromStorage = (): OAuth2Client | undefined => {
    let client = getNewClient();
    const credentials = getTokensFromStorage();
    if (!credentials) {
        return undefined;
    }
    client.setCredentials(credentials);
    return client;
};

export const getAuthUrl = (client: OAuth2Client) => {
    return client.generateAuthUrl({
        scope: SCOPES,
    });
};

export const generateToken = () => {
    window.location.replace(getAuthUrl(getNewClient()));
};

export const regenerateToken = () => {
    localStorage.removeItem(CREDENTIALS_KEY);
    generateToken()
};

export const saveTokens = (tokens: Credentials) => {
    debug("Saving tokens");
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(tokens));
};

const getTokensFromStorage = (): Credentials | undefined => {
    const tokens = localStorage.getItem(CREDENTIALS_KEY);
    if (tokens === null) {
        debug("No tokens in storage");
        return undefined;
    }
    const credentials = JSON.parse(tokens) as Credentials;
    if (credentials.expiry_date === undefined || credentials.expiry_date === null) {
        debug("No expiry date", credentials);
        return undefined;
    }
    const now = Date.now();
    if (credentials.expiry_date > now + MILLISECONDS_TO_EXPIRACY_RENEW) {
        debug("Setting timeout to ", credentials.expiry_date - now - MILLISECONDS_TO_EXPIRACY_RENEW);
        setTimeout(regenerateToken, credentials.expiry_date - now - MILLISECONDS_TO_EXPIRACY_RENEW);
        return credentials;
    } else {
        debug(`expiry date: ${now} is not before ${credentials.expiry_date}`);
        localStorage.removeItem(CREDENTIALS_KEY);
        return undefined;
    }
};

export const redirectToAuth = () => {
    window.location.replace("/auth");
};