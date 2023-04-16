"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
var path = __importStar(require("path"));
var Datastore = require("nedb");
var Login = /** @class */ (function () {
    function Login() {
        this.db = new Datastore({
            filename: path.join(__dirname, "user.db"),
            autoload: true
        });
    }
    Login.prototype.getUsers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.find({}, function (err, users) {
                if (err) {
                    console.log(err);
                    reject({ msg: "error in db" });
                }
                else {
                    resolve(users);
                }
            });
        });
    };
    Login.prototype.getUser = function (username, password) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.find({ username: username }, function (err, user) {
                if (user.length > 0) {
                    if (password === user[0].password) {
                        var username_1 = user[0].username;
                        resolve({ username: username_1 });
                    }
                    else {
                        console.log("username or password not valid");
                        reject({ msg: "username or password not valid" });
                    }
                }
                else {
                    console.log("username or password not valid");
                    reject({ msg: "user not found" });
                }
            });
        });
    };
    Login.prototype.signinUser = function (username, password) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.insert({ username: username, password: password }, function (err, user) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ username: user.username });
                }
            });
        });
    };
    return Login;
}());
exports.Login = Login;
//# sourceMappingURL=Login.js.map