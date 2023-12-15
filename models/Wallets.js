const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WalletSchema = new Schema({
    wallet: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    pubKey: {
        type: String,
        required: true
    },
    prKey: {
        type: String,
        required: true
    }
}, { timestamps: true });

WalletSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

WalletSchema.set('toJSON', {
    virtuals: true
});

module.exports = User = mongoose.model("wallets", WalletSchema);
