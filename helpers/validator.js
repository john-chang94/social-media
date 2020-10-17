exports.createPostValidator = (req, res, next) => {
    req.check('title', 'Title required').notEmpty()
    req.check('title', 'Title must be between 4 and 150 characters').isLength({
        min: 4,
        max: 150
    })
    req.check('body', 'Body required').notEmpty()
    req.check('body', 'Body must be between 4 and 2000 characters').isLength({
        min: 4,
        max: 2000
    })

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0]; // Show the first error if more than one
        return res.status(400).json({
            error: firstError
        })
    }

    next();
}

exports.signUpValidator = (req, res, next) => {
    req.check('name', 'Name required').notEmpty();
    req.check('email', 'Email required').notEmpty();
    req.check('email', 'Must be a valid email').isEmail();
    req.check('email', 'Email must be between 4 to 200 characters').isLength({
        min: 4,
        max: 200
    });
    req.check('password', 'Password required');
    req.check('password', 'Password must be at least 8 characters').isLength({ min: 8 })

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({
            error: firstError
        })
    }

    next();
}

exports.passwordResetValidator = (req, res, next) => {
    req.check('newPassword', 'Password is required').notEmpty();
    req.check('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')

    const errors = req.validationErrors();
    if (errors) {
        const error = errors.map(error => error.msg)[0];
        return res.status(400).json({ error })
    }

    next();
}