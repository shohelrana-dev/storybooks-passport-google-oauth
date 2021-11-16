const { ensureGuest, ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')

const router = require('express').Router()

// @desc login/landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', { layout: 'login' })
})


// @desc dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.displayName,
            stories
        })
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = router