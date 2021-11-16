module.exports = {
    ensureAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.locals.user = req.user
            return next()
        }
        return res.redirect('/')
    },

    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard')
        }
        res.locals.user = null
        return next()
    }
}