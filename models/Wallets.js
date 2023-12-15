const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WalletSchema = new Schema({
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
        unique: true,
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
