const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');
const { setFips } = require('crypto');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), './services/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './services/credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function gmail_send_message(auth, to, txt) {
  const gmail = google.gmail({version: 'v1', auth});

  const options = {
    to: to,
    subject: 'Welcome to Ex-Rail',
    text: txt,
    html: `<p>${txt}</p>`,
    textEncoding: 'base64',
  };

  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();

  const rawMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: rawMessage,
    }, 
  }); 
}

// const funct = async() =>{
//   client = await authorize()
//   await gmail_send_message(client, "email_address", "text_to_send")
// }
// funct()

module.exports = {
  gmail_send_message
}
