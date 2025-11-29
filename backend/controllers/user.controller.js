const express = require("express");
const User = require("../models/user.model");
const Cryptr = require('cryptr');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cryptr = new Cryptr('ishopwebsie7734866092');

const UserController = {
    async register(req, res) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            const userExists = await User.findOne({ email: email });
            if (userExists) {
                res.send({ emailError: "Email Already Register", flag: 0 })
            } else {
                if (!validator.equals(password, confirmPassword)) {
                    return res.send({ confirmPasswrdError: "Passwords do not match", flag: 0 });
                }
                const encryptedPassword = cryptr.encrypt(password);
                const user = new User({ name: name, email: email, password: encryptedPassword })
                user.save().then(
                    () => {
                        const token = jwt.sign({ ...user.toJSON() }, process.env.jwt_key, {
                            expiresIn: "24h"
                        })
                        res.send({ message: "Registeration Successfully", flag: 1, token, user })
                    }
                ).catch(
                    () => {
                        res.send({ message: "Unable to register", flag: 0 })
                    }
                )
            }
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.send({ emailError: "Email not Exist", flag: 0 });
            } else {
                if (cryptr.decrypt(existingUser.password) == password) {
                    const token = jwt.sign({ ...existingUser.toJSON() }, process.env.jwt_key, {
                        expiresIn: "24h"
                    });
                    return res.send({ message: "Login Successfully", flag: 1, existingUser, token })
                } else {
                    return res.send({ passwordError: "Invalid Password", flag: 0 })
                }
            }
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 });
        }
    },

    async updateProfile(req, res) {
        try {
            const { name, email, user_id } = req.body;
            User.findByIdAndUpdate(user_id, { name: name, email: email }).then(
                async () => {
                    const new_User = await User.findById(user_id)
                    res.send({ message: "Profile Updated Successfully", flag: 1, new_User })
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to Updated profile", flag: 0 })
                }
            )
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    async changePassword(req, res) {
        try {
            const { old_password, new_password, confirm_new_password, user_id } = req.body;
            const user = await User.findById(user_id);
            if (cryptr.decrypt(user.password) == old_password) {
                if (validator.equals(new_password, confirm_new_password)) {
                    User.findByIdAndUpdate(user_id, { password: cryptr.encrypt(new_password) }).then(
                        async () => {
                            const new_User = await User.findById(user_id)
                            res.send({ message: "Password Updated Successfully", flag: 1, new_User })
                        }
                    ).catch(
                        () => {
                            res.send({ message: "Unable to Updated password", flag: 0 })
                        }
                    )
                } else {
                    res.send({ message: "Confirm password not match", flag: 0 })
                }
            }
        } catch (error) {
            console.log(error.message)
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    async deleteAddress(req, res) {
        try {
            const index = req.params.id;
            const { user_id } = req.body;
            const user = await User.findById(user_id);
            if (!user) {
                return res.send({ message: "User not found", flag: 0 });
            }
            // Remove the address at the given index
            user.address.splice(index, 1);
            await user.save();
            const new_User = await User.findById(user_id);
            res.send({ message: "Address Deleted Successfully", flag: 1, new_User });
        } catch (error) {
            console.log("Error", error.message);
            res.send({ message: "Internal Server Error", flag: 0 });
        }
    },

    async saveAddress(req, res) {
        try {
            const { name, street, area, landmark, pincode, city, state, mobile, isDefault, user_id } = req.body;
            const user = await User.findById(user_id);
            if (isDefault) {
                user.address.forEach(addr => addr.isdefault = false);
            }
            user.address.push({ name: name, street: street, area: area, landmark: landmark, zipcode: pincode, city: city, state: state, mobile: mobile, isdefault: isDefault })

            await user.save();
            const new_user = await User.findById(user_id);
            res.send({ message: "Address Added Successfully", flag: 1, new_user });
        } catch (error) {
            console.log(error.message)
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    async setDefaultAddress(req, res) {
        try {
            const { index, user_id } = req.body;
            const user = await User.findById(user_id);
            user.address.forEach(addr => addr.isdefault = false);
            user.address[index].isdefault = true

            await user.save();
            const new_user = await User.findById(user_id);
            res.send({ message: "Address set as default", flag: 1, new_user })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    async editAddress(req, res) {
        try {
            const { index, user_id, name, street, area, landmark, pincode, city, state, mobile } = req.body;
            const user = await User.findById(user_id);

            user.address[index] = { name: name, street: street, area: area, landmark: landmark, zipcode: pincode, city: city, state: state, mobile: mobile };

            await user.save();
            const new_user = await User.findById(user_id);
            res.send({ message: "Address Edit Successfully", flag: 1, new_user })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    async getAllUsers(req, res) {
        try {
            const allUsers = await User.find().sort({ createdAt: -1 });
            res.send({ message: "All Users Fetched Successfully", flag: 1, allUsers })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    }
};

module.exports = UserController;
