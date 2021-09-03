const password = process.env.MONGO_PASSWORD
const database = process.env.MONGO_DATABASE
const db = `mongodb+srv://learnNode:${password}@cluster0.qmark.mongodb.net/${database}?retryWrites=true&w=majority`

module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: db,
  watsonVersion: process.env.TRANSLATION_VERSION,
  watsonAPIKey: process.env.TRANSLATION_API_KEY,
  watsonURL: process.env.TRANSLATION_URL,
}
