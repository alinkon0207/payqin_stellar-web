const Validator = require("validator");
const isEmpty = require("is-empty");

function validateRegisterInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.permissions = !isEmpty(data.permissions) ? data.permissions : "";
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }
    if (Validator.isEmpty(data.permissions)) {
        errors.permissions = "Permissions field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

function isPrKey(strPrKey) {
    ///check validation of private key
    //start with S and has capitalized A-Z, has digits 0~9 and has length of 56 chars
    const regex = /^S[A-Z0-9]{55}$/;
    return regex.test(strPrKey);
}

function validateWalletAddInput(data) {
    let errors = {};
    data.prKey = !isEmpty(data.prKey) ? data.prKey : "";
    data.userId = !isEmpty(data.userId) ? data.userId : "";
    if (Validator.isEmpty(data.userId)) {
        errors.userId = "User ID is required";
    }
    if (Validator.isEmpty(data.prKey)) {
        errors.prKey = "Private key field is required";
    } else if (!isPrKey(data.prKey)) {
        errors.prKey = "Private key is invalid";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = {
    validateRegisterInput,
    validateWalletAddInput
}