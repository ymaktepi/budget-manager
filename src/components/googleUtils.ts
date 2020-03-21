import {google, sheets_v4} from "googleapis";

export function listFiles(client: any) {
    const service = google.drive("v3");
    service.files.list(
        {
            auth: client,
            pageSize: 10,
            // fields: 'nextPageToken, files(id, name)',
        },
        (err: any, res: any) => {
            if (err) {
                console.error('The API returned an error.');
                console.log(err);
                throw err;
            }
            const files = res.data.files;
            if (files.length === 0) {
                console.log('No files found.');
            } else {
                console.log('Files:');
                for (const file of files) {
                    console.log(`${file.name} (${file.id})`);
                }
            }
        }
    );
}

export async function createFile(client: any, name: string) {
    const truc = google.sheets({version: "v4", auth: client});

    const request: Partial<sheets_v4.Params$Resource$Spreadsheets$Create> = {
        auth: client,
        requestBody: {
            properties: {
                title: name,
            },
        }
    };
    try {
        const response = (await google.sheets("v4").spreadsheets.get()).data;
        console.log(JSON.stringify(response, null, 2));
    } catch (err) {
        console.error(err);
    }

}
