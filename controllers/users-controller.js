const fs = require('fs') // Import the file system module to handle file operations
const multer  = require('multer');
const countryList = require('../common/currency-list') // Import the list of countries/currencies
const { validationResult } = require('express-validator') // Import validation result from express-validator
const {trackActivity} = require('../common/track-activity')
const upload = require('../lib/multer-upload') // Import the upload function from the upload module
// Set the API key for the currency converter service
const apiKey = 'c50ca59ab4a6fbf8a8525554'

const dashboard = (req, res) => {
    // Render the user dashboard with relevant data
    trackActivity({req, action: 'Visited dashboard'})

    res.status(200).json({
        countries: countryList, // Pass the country/currency list
        user: req.user
    });
}

const listConversions = async (req, res) => {
    // Get current logged-in user's ID from the session
    const userId = req.user.id

    // Fetch the user's conversion history from the database
    const dbQuery = new Promise((resolve, reject) => {
        req.app.get('db').all(`
            SELECT currency_from, currency_to, amount, converted_amount, conversion_date, b.id FROM users a JOIN conversions b ON a.id = b.user_id WHERE b.user_id = ?
        `, [userId], (err, rows) => {
            if (err) {
                reject(err) // Handle database error
            }
            if (rows) {
                resolve(rows) // Return the fetched conversion data
            }
        })
    })

    const result = await dbQuery // Wait for the database query to complete

    res.status(200).json({
        conversions: result, // Pass the conversion data
    })
}

const updateAccount = async (req, res) => {
    // Validate the form fields
    const validate = validationResult(req)
    const firstname = req.body.first_name
    const lastname = req.body.last_name
    let password = req?.body?.password // Optional chaining for password
    const email = req.body.email
    const userId = req.user.id

    let errors = []
    // Check if validation failed, collect error messages
    if (!validate.isEmpty()) {
        errors = validate.array().map(error => error.msg) // Map error messages
    }

    if (errors.length === 0) {
        // Check if email already exists for another user
        const dbQuery = new Promise((resolve, reject) => {
            req.app.get('db').all(`
                SELECT * FROM users WHERE email = ?
            `, [email], (err, rows) => {
                if (err) {
                    reject(err) // Handle database error
                }
                if (rows) {
                    resolve(rows) // Return the fetched user data
                }
            })
        })
        const result = await dbQuery

        // If email exists and belongs to another user, add error message
        if (result.length > 0 && result[0].id !== userId) {
            errors.push('Email already exists')
        } else {
            if (!password) {
                password = result[0].password // Keep existing password if not updated
            }
            // Update user details in the database
            req.app.get('db').run(`
                UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE id = ?
            `, [firstname, lastname, email, password, userId])
        }
    }

    trackActivity({req, action: 'Updated account data'}) // Track user activity

    // Redirect to the account update page after submission
    return res.redirect('/users/update-account');
}

const uploadPhoto = async (req, res) => {
    const currentPhoto = req.user.photo // Get the current user photo from the session

    const uploadSingle = upload.single('photo')

    uploadSingle(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            req.flash('uploadError', 'File too large. Maximum size is 1MB')
            return res.redirect('/users/update-account')
        } else if (err) {
            req.flash('uploadError', 'Only image files are allowed')
            return res.redirect('/users/update-account')
        }

        // File upload successful - proceed with database update
        const photoPath = req.file.filename

        // Update the user photo in the database
        req.app.get('db').run(`
            UPDATE users SET photo = ? WHERE id = ?
        `, [photoPath, req.user.id])

        // Update the user session data with the new photo
        req.user = {
            ...req.user,
            photo: photoPath,
        }

        // Delete the old photo from the filesystem
        fs.unlink(process.cwd() + '/public/images/' + currentPhoto, function (err) {
            console.log(err) // Log any errors
        })
        // Redirect to the account update page
        req.flash('success', 'Photo uploaded successfully')
        trackActivity({req, action: 'Uploaded new photo'}) // Track user activity

        // Redirect to the account update page
        return res.redirect('/users/update-account');
    })
}

const convertCurrency = async (req, res, next) => {
    const validate = validationResult(req)
    const currencyFrom = req.body.currencyFrom
    const currencyTo = req.body.currencyTo
    const amountToConvert = req.body.amount
    const convertedDate = new Date() // Get current date for the conversion
    let errors = []
    // Check if validation failed, collect error messages
    if (!validate.isEmpty()) {
        errors = validate.array().map(error => error.msg) // Map error messages
    }

    if(errors.length > 0) {
        return res.json({
            errors: errors,
        })
    }

    // Make a request to the currency conversion API with selected values
    const request = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${currencyFrom}/${currencyTo}/${amountToConvert}`)
    const data = await request.json() // Parse the JSON response from the API
    const convertedAmount = data.conversion_result // Extract the converted amount from the response

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyTo // Use the target currency for formatting
    }).format(convertedAmount)

    // Save conversion data to the database
    req.app.get('db').run(`
        INSERT INTO conversions (user_id, currency_from, currency_to, amount, converted_amount, conversion_date) VALUES (?, ?, ?, ?, ?, ?)
    `, [req.user.id, currencyFrom, currencyTo, amountToConvert, convertedAmount, convertedDate.toDateString()]
    )

    return res.json({
        convertedAmount: formattedAmount,
        fromCurrency: currencyFrom,
        toCurrency: currencyTo,
        amountToConvert: amountToConvert,
    })
}

const deleteHistory = async (req, res) => {
    // Get the conversion ID from the query string
    const conversionId = req.param.conversionId
    console.log(conversionId)

    // Delete the conversion record from the database
    req.app.get('db').run(`DELETE FROM conversions WHERE ID = ?`, [conversionId])

    trackActivity({req, action: 'Deleted a conversion history'}) // Track user activity

    // Redirect to the conversions page
    return res.json({
        success: true,
        message: 'Conversion deleted successfully',
    })
}

const liveExchange = async (req, res) => {

    // Make an API request to fetch the latest exchange rates
    const request = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/CAD`)

    // Parse the JSON response from the API
    const data = await request.json()

    trackActivity({req, action: 'Performed a live exchange'}) // Track user activity

    // Render the live exchange rates page
    res.json({
        rates: data.conversion_rates, // Pass the exchange rates data
    });
}
// Export the module functions for use in other parts of the app where they are needed
module.exports = {
    dashboard,
    updateAccount,
    listConversions,
    uploadPhoto,
    liveExchange,
    deleteHistory,
    convertCurrency,
}
