const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3')
const { IamAuthenticator } = require('ibm-watson/auth')

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 'gbW0pvbDqOIdAppaNaiqyN73RGdKkfZFoVDDr_xNuEd4',
  }),
  serviceUrl:
    'https://api.eu-gb.language-translator.watson.cloud.ibm.com/instances/c9af68cd-b619-4ef3-abdb-fda5f3d20934',
  //disableSslVerification: true,
})

module.exports.translate = (input, lang) => {
  const inputText = input
  const language = lang

  //  👪 Checks to see if its a sv-pt or pt-sv translation because it will have to use 'en' as a middle language
  language === 'sv-pt'
    ? (language1 = 'sv-en')
    : language === 'pt-sv'
    ? (language1 = 'pt-en')
    : (language1 = language)

  language === 'sv-pt'
    ? (language2 = 'en-pt')
    : language === 'pt-sv'
    ? (language2 = 'en-sv')
    : (language2 = '')

  const translateParams1 = {
    text: inputText,
    modelId: language1,
  }

  return languageTranslator
    .translate(translateParams1)
    .then((translationResult) => {
      //👪 translate through 'en'
      if (language === 'sv-pt' || language === 'pt-sv') {
        const translateParams2 = {
          text: translationResult.result.translations[0].translation,
          modelId: language2,
        }
        return languageTranslator
          .translate(translateParams2)
          .then((translationResult2) => {
            return translationResult2.result.translations[0].translation
          })
          .catch((err) => {
            console.log('error:', err)
          })

        // 👪 back to not having to translate through 'en'... lucky
      } else {
        return translationResult.result.translations[0].translation
      }
    })
    .then((answer) => {
      return answer
    })
    .catch((err) => {
      console.log('error:', err)
    })
}
