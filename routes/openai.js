const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const get_response = async(prompt) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
    });
    return completion.data.choices[0].text;

};

router.get('/fortune', (req, res, next) => {
    res.render('fortune');
})

router.post('/fortune',
    async(req, res, next) => {
        console.log('getting fortune');
        res.locals.response = await get_response("Generate a fortune");
        res.render('fortuneResult');
    }
)

module.exports = router;