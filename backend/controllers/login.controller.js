const express = require("express");
const Login = require("../models/login.model");
const jwt = require("jsonwebtoken");

const LoginController = {
    async create(req, res) {
        try {
            const data = req.body;
            const EmailChecks = await Login.findOne({ email: data.email }).countDocuments();
            if (EmailChecks == 1) {
                return res.send({
                    message: "Email already exists",
                    flag: 0
                })
            }
            const createAccount = new Login({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password
            });
            createAccount.save().then(() => {
                res.send({
                    message: "Account Created Successfull",
                    flag: 1,
                });
            }).catch((error) => {
                res.send({
                    error: error,
                    message: "Unable to create account",
                    flag: 0,
                });
            })

        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async checklogin(req, res) {
        try {
            const data = req.body;
            const { email, password } = req.body;
            const AdminExist = await Login.findOne({ email: email });
            if (!AdminExist) {
                return res.send({ message: "Email not found", flag: 0 })
            }
            if (AdminExist.block == true) {
                return res.send({ message: "Your account has been blocked. Please contact the administrator.", flag: 0 });
            }
            AdminExist.lastActive = new Date();
            await AdminExist.save();
            if (AdminExist.password == password) {

                const token = jwt.sign({ ...AdminExist.toJSON() }, process.env.jwt_key, {
                    expiresIn: '24h'
                });

                res.cookie(
                    "admin_token", token,
                    {
                        httpOnly: false,
                        sameSite: "lax",
                        maxAge: 1000 * 60 * 60 * 24,
                        secure: false
                    }
                )
                return res.send({
                    message: "Login Successfully", flag: 1, AdminExist: {
                        ...AdminExist.toJSON(),
                        password: "",
                        token
                    }
                })
            } else {
                return res.send({ message: "Password Incorrect", flag: 0 })
            }
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    logout(req, res) {
        try {
            res.clearCookie("admin_token", {
                httpOnly: false,
                sameSite: "lax",
                secure: false
            });
            res.send({ message: "Logout Successfully", flag: 1 })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0, error })
        }
    },
    async getalluser(req, res) {
        try {
            const allUser = await Login.find().sort({ createdAt: -1 });
            console.log("all user", allUser)
            res.send({ message: "All Users Fetched Successfully", flag: 1, allUser });
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async toggleBlock(req, res) {
        try {
            const { id, block } = req.body;
            await Login.findByIdAndUpdate(id, { block: block });
            const allUser = await Login.find().sort({ createdAt: -1 });
            res.send({ message: "User block status toggled", flag: 1, allUser });
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })

        }
    },
    async deleteUser(req, res) {
        try {
            const id = req.params.id;
            await Login.findByIdAndDelete(id);
            const allUser = await Login.find().sort({ createdAt: -1 });
            res.send({ message: "User deleted successfully", flag: 1, allUser });
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0, error })
        }
    }
}

module.exports = LoginController;