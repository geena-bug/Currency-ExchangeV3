// Import the file system module to handle file operations
const fs = require('fs');
// Import multer for handling multipart/form-data, used for uploading files
const multer = require('multer');
// Import the list of countries/currencies
const countryList = require('../common/currency-list');
// Import validation result from express-validator
const { validationResult } = require('express-validator');
// Import the track activity function
const { trackActivity } = require('../common/track-activity');
// Import the upload function from the upload module
const upload = require('../lib/multer-upload');
// Set the API key for the currency converter service
const apiKey = 'c50ca59ab4a6fbf8a8525554';

// Export the dashboard function
const dashboard = (req, res) => {
    trackActivity({ req, action: 'Visited dashboard' }); // Track user activity
    res.status(200).json({
        countries: countryList, // Pass the country/currency list
        user: req.user // Pass the user object from the request
    });
};

// Export the me function
const me = async (req, res) => {
    res.status(200).json({
        user: req.user // Respond with the user object
    });
};

// Export the countryCurrencyList function
const countryCurrencyList = async (req, res) => {
    res.status(200).json({
        countryList // Respond with the country list
    });
};

// Export the listConversions function
const listConversions = async (req, res) => {
    const userId = req.user.id; // Get current logged-in user's ID from the session
    const limit = req.query.limit || 20; // Get limit from query or default to 20
    const page = req.query.page || 1; // Get page from query or default to 1
    const offset = (page - 1) * limit; // Calculate offset for pagination
    const models = req.app.get('models'); // Get models from the application context

    const result = await models.conversions.findAll({
        where: {
            userId: userId // Filter by user's conversions
        },
        limit,
        offset,
        order: [['id', 'DESC']] // Order by latest conversions
    });

    res.status(200).json({
        conversions: result, // Pass the conversion data
        countryList
    });
};

// Export the updateAccount function
const updateAccount = async (req, res) => {
    const validate = validationResult(req); // Validate the form fields
    const firstname = req.body.first_name;
    const lastname = req.body.last_name;
    const email = req.body.email;
    const userType = req.body.user_type;
    const userId = req.user.id;
    const models = req.app.get('models');

    let errors = [];
    if (!validate.isEmpty()) {
        errors = validate.array().map(error => error.msg);
        return res.status(400).json({
            errors,
            message: 'Error updating account'
        });
    }

    if (errors.length === 0) {
        const user = await models.users.findOne({
            where: { id: userId }
        });

        if (user && user.id !== userId) {
            errors.push('Email already exists');
        } else {
            await models.users.update({
                first_name: firstname,
                last_name: lastname,
                email: email,
                user_type: userType
            }, {
                where: { id: userId }
            });
        }
    }

    return res.status(200).json({
        message: 'Account updated successfully'
    });
};

// Export the updatePassword function
const updatePassword = async (req, res) => {
    const validate = validationResult(req);
    const password = req.body.new_password;
    const currentPassword = req.body.current_password;
    const userId = req.user.id;
    const models = req.app.get('models');

    let errors = [];
    if (!validate.isEmpty()) {
        errors = validate.array().map(error => error.msg);
        return res.status(400).json({
            errors,
            message: 'Error updating password'
        });
    }

    if (errors.length === 0) {
        const user = await models.users.findOne({
            where: { id: userId }
        });

        if (user && user.password !== currentPassword) {
            return res.status(400).json({
                message: 'Current password does not match'
            });
        } else {
            await models.users.update({
                password
            }, {
                where: { id: userId }
            });
        }
    }

    return res.status(200).json({
        message: 'Password updated successfully'
    });
};

// Export the uploadPhoto function
const uploadPhoto = async (req, res) => {
    const currentPhoto = req.user.photo; // Get the current user photo from the session

    const uploadSingle = upload.single('photo');

    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            req.flash('uploadError', 'File too large. Maximum size is 1MB');
            return res.redirect('/users/update-account');
        } else if (err) {
            req.flash('uploadError', 'Only image files are allowed');
            return res.redirect('/users/update-account');
        }

        const photoPath = req.file.filename;

        req.app.get('db').run(`
            UPDATE users SET photo = ? WHERE id = ?
        `, [photoPath, req.user.id]);

        req.user = {
            ...req.user,
            photo: photoPath,
        };

        fs.unlink(process.cwd() + '/public/images/' + currentPhoto, function (err) {
            console.log(err);
        });

        req.flash('success', 'Photo uploaded successfully');
        trackActivity({ req, action: 'Uploaded new photo' });

        return res.redirect('/users/update-account');
    });
};

// Export the convertCurrency function
const convertCurrency = async (req, res, next) => {
    const validate = validationResult(req);
    const currencyFrom = req.body.currencyFrom;
    const currencyTo = req.body.currencyTo;
    const amountToConvert = req.body.amount;
    const saveToHistory = req.body.saveToHistory;
    const convertedDate = new Date();
    const models = req.app.get('models');

    if (!validate.isEmpty()) {
        return res.status(400).json({
            errors: validate.array().map(error => error.msg),
            message: 'Validation failed'
        });
    }

    const request = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${currencyFrom}/${currencyTo}/${amountToConvert}`);
    const data = await request.json();
    const convertedAmount = data.conversion_result;
    const lastUpdated = data.time_last_update_utc;
    const conversionRate = data.conversion_rate;

    if (saveToHistory === true) {
        models.conversions.create({
            userId: req.user.id,
            currency_from: currencyFrom,
            currency_to: currencyTo,
            amount: amountToConvert,
            converted_amount: convertedAmount,
            conversion_date: convertedDate.toDateString(),
        });
    }

    return res.json({
        convertedAmount,
        fromCurrency: currencyFrom,
        toCurrency: currencyTo,
        amountToConvert,
        lastUpdated,
        conversionRate,
    });
};

// Export the deleteHistory function
const deleteHistory = async (req, res) => {
    const conversionId = req.params.conversionId;
    const models = req.app.get('models');

    models.conversions.destroy({
        where: { id: conversionId }
    });

    return res.json({
        success: true,
        message: 'Conversion deleted successfully'
    });
};

// Export the liveExchange function
const liveExchange = async (req, res) => {
    const request = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/CAD`);
    const data = await request.json();

    const getCountry = (currencyCode) => countryList.find((country) => country.currency_code === currencyCode);

    const rates = [];
    for (const currency in data.conversion_rates) {
        const country = getCountry(currency);
        if (country) {
            rates.push({
                currencyCode: currency,
                rate: data.conversion_rates[currency],
                symbol: country.currency_symbol ?? null,
                countryCode: country.country_iso ?? null,
                countryName: country.name ?? null,
            });
        }
    }

    res.json({
        rates,
        lastUpdate: data.time_last_update_utc
    });
};

// Export the module functions for use in other parts of the app where they are needed
module.exports = {
    dashboard,
    updateAccount,
    listConversions,
    uploadPhoto,
    liveExchange,
    deleteHistory,
    convertCurrency,
    me,
    countryCurrencyList,
    updatePassword,
};