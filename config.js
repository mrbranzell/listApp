module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  watsonVersion: process.env.TRANSLATION_VERSION,
  watsonAPIKey: process.env.TRANSLATION_API_KEY,
  watsonURL: process.env.TRANSLATION_URL,
}
