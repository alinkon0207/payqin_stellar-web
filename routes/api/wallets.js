const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const keys = require('../../config/keys');
const { validateWalletAddInput } = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateUpdateUserInput = require('../../validation/updateUser');
const validateInviteInput = require('../../validation/inviteUser');
const Wallet = require('../../models/Wallets');

router.post('/wallet-add', (req, res) => {
    const { errors, isValid } = validateWalletAddInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Wallet.findOne({ prKey: req.body.prKey }).then(user => {
        if (user) {
            return res.status(400).json({ message: 'Wallet already exists' });
        } else {
            const newUser = new Wallet({
                pubKey: req.body.pubKey,
                prKey: req.body.prKey,
                user: req.body.userId,
            });
            newUser
                .save()
                .then(user => {
                    return res.status(200).json({ message: 'Wallet added successfully. Refreshing data...' })
                }).catch(err => console.log(err));
        }
    });
});

router.post('/wallet-data', (req, res) => {
    Wallet.find({}).populate("user").select(['-prKey']).then(user => {
        if (user) {
            return res.status(200).send(user);
        }
    });
});

router.post('/wallet-delete', (req, res) => {
    Wallet.deleteOne({ _id: req.body._id }).then(user => {
        if (user) {
            return res.status(200).json({ message: 'User deleted successfully. Refreshing data...', success: true })
        }
    });
});

router.post('/wallet-update', (req, res) => {
    const { errors, isValid } = validateUpdateUserInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const _id = req.body._id;
    Wallet.findOne({ _id }).then(user => {
        if (user) {
            if (req.body.password !== '') {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                    });
                });
            }
            let update = { 'name': req.body.name, 'email': req.body.email, 'password': user.password, 'permissions': req.body.permissions };
            Wallet.update({ _id: _id }, { $set: update }, function (err, result) {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update user.' });
                } else {
                    return res.status(200).json({ message: 'User updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'Now user found to update.' });
        }
    });
});

router.post('/wallet-invite', (req, res) => {
    const { errors, isValid } = validateInviteInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;

    // check if email exists
    Wallet.findOne({ email: email }).then(user => {
        if (user) {
            // Create a transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'alinkon0207@gmail.com',
                    pass: 'btet hlwp iarz zlmu',
                },
            });

            const mailOptions = {
                from: 'alinkon0207@gmail.com',
                to: email,
                subject: 'Invite to PayQin-Stellar',
                text: req.body.note,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error:', error);
                    return res.status(400).json({ message: 'Unable to invite.' });
                } else {
                    console.log('Email sent:', info.response);
                    return res.status(200).json({ message: 'Invited successfully.', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'No user found to invite.' });
        }
    });
});

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    Wallet.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ email: 'Email not found' });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name
                };
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ password: 'Password incorrect' });
            }
        });
    });
});


module.exports = router;
