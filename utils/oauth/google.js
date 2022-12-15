const { google } = require("googleapis");

const { GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } =
  process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

module.exports = {
  generateAuthURL: () => {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      response_type: "code",
      scope: scopes,
    });
    console.log("url :", authUrl);
    return authUrl;
  },

  setCredentials: async (code) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        console.log("tokens:", tokens);
        return resolve(tokens);
      } catch (error) {
        return reject(error);
      }
    });
  },

  getUserData: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const oauth2 = google.oauth2({
          auth: oauth2Client,
          version: "v2",
        });
        console.log("user info : ", oauth2.userinfo);

        oauth2.userinfo.get((err, res) => {
          if (err) {
            return reject(err);
          } else {
            resolve(res);
          }
        });
      } catch (err) {
        return reject(err);
      }
    });
  },
};
