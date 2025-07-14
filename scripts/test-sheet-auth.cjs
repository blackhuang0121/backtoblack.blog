const { google } = require('googleapis');
const credentials = require('/Users/e0121n/Documents/wordpress-project-367716-ed43ba2f94df.json'); // 這裡填你下載下來的 service account json
const SHEET_ID = '1yP3a6EEndTaPuISsgsvFgkla81yjJOVf6CtlJnjntWA';

async function main() {
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        scopes
    );
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    console.log(res.data);
}

main().catch(e => {
    console.error(e.response ? e.response.data : e);
    process.exit(1);
});
