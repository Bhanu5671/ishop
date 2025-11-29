const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const CategoryRouter = require('./routers/category.router');
const ProductRouter = require('./routers/product.router');
const LoginRouter = require("./routers/login.router")
const UserRouter = require("./routers/user.router")
const cors = require('cors');
const ColorRouter = require('./routers/color.router');
const AdminLogsRouter = require("./routers/adminLogs.router");
const cookieParser = require('cookie-parser');
const CartRouter = require('./routers/cart.router');
const OrderRouter = require('./routers/order.router');
const WishListRouter = require('./routers/wishlist.router');
const authorizationMiddleware = require('./middlewares/authorization');
// const jwt=require("jsonwebtoken")
// console.log(jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGEyN2M4MTM2OTUzMzY1ZmI4MTFlNzciLCJmaXJzdF9uYW1lIjoiQmhhbnUiLCJsYXN0X25hbWUiOiJKYW5naWQiLCJlbWFpbCI6ImJoYW51QHNhbGVhc3Npc3QuYWkiLCJwYXNzd29yZCI6IjEyMzQ1NiIsImRlbGV0ZWRBdCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNS0wOC0xOFQwMTowNjowOS40NDdaIiwidXBkYXRlZEF0IjoiMjAyNS0wOC0xOFQwMTowNjowOS40NDdaIiwiX192IjowLCJpYXQiOjE3NTU2MzA1MjV9.nsqILw75JqvTqfEMeAkUCN9F2GO6-xPZl9hTTKtxrLU"))

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow all origins for CORS

app.use('/category', CategoryRouter);
app.use('/color', ColorRouter);
app.use('/product', ProductRouter);
app.use('/login', LoginRouter);
app.use("/adminlogs", AdminLogsRouter);
app.use("/user", UserRouter);
app.use("/cart", CartRouter);
app.use("/order", OrderRouter);
app.use("/wishlist", WishListRouter);

app.get("/get-cookies",
    (req, res) => {
        return res.json({ ...req.cookies })
    }
)

mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'ecommerce' }).then(() => {
    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    })
}).catch((err) => {
    console.error("Database connection failed:", err);
});