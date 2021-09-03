module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.QOVERY_MONGODB_Z471928CE_DATABASE_URL,
  watsonVersion: process.env.TRANSLATION_VERSION,
  watsonAPIKey: process.env.TRANSLATION_API_KEY,
  watsonURL: process.env.TRANSLATION_URL,
}
