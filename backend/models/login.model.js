const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            require: true,
        },
        last_name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true,
            unique: true
        },
        admin_type: {
            type: Number,
            require: true,
            enum: [1, 2, 3, 4, 5]
        },
        deletedAt: {
            type: Date,
            default: null
        },
        lastActive: {
            type: Date,
            default: null
        },
        block: {
            type: Boolean,
            default: false
        }
    }, ({ timestamps: true })
)

const Login = mongoose.model("Login", LoginSchema);

module.exports = Login;