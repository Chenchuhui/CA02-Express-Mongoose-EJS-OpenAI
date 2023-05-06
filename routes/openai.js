const express = require('express');
const router = express.Router();
const Fortune = require('../models/Fortune');
const User = require('../models/User');

const { Configuration, OpenAIApi } = require("openai");
const { isLoggedIn } = require('./pwauth');
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

router.get('/fortune',
    isLoggedIn,
    async(req, res, next) => {
        response = await Fortune.findOne({ userId: req.user._id });
        if (response) {
            res.locals.response = response.item;
        } else {
            res.locals.response = "Haven't got one yet!"
        }

        res.render('fortune');
    }
)

router.post('/fortune',
    isLoggedIn,
    async(req, res, next) => {
        console.log('getting fortune');
        res.locals.response = await get_response("Please generate a fortune! Give a warm message directly!");
        response = await Fortune.findOneAndUpdate({ userId: req.user._id }, { $set: { item: res.locals.response } });
        console.log(response);
        if (!response) {
            const fortune = new Fortune({
                item: res.locals.response,
                userId: req.user._id
            })
            await fortune.save();
        };

        res.render('fortuneResult');
    }
)

module.exports = router;