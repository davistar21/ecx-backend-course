"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.default.Schema({
    name: String,
    age: Number
});
var UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
