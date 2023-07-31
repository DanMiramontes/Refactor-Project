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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.sigininUser = exports.createUser = void 0;
const User_entity_1 = require("../entities/User.entity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CryptoJS = __importStar(require("crypto-js"));
const config_1 = __importDefault(require("../config"));
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstname, lastname, password, role, email } = req.body;
        let hasheadPassword = '';
        hasheadPassword = bcrypt_1.default.hashSync(password, 8);
        const user = new User_entity_1.User();
        user.firstName = firstname;
        user.email = email;
        user.lastName = lastname;
        user.password = hasheadPassword;
        user.role = role;
        yield user.save();
        res.status(201).send('User created');
    });
}
exports.createUser = createUser;
function sigininUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({ error: 'email or password is required' });
        }
        const user = yield User_entity_1.User.find({
            select: {
                id: true,
                firstName: true,
                email: true,
                password: true
            },
            relations: {
                role: true
            },
            where: {
                email: email
            },
        });
        const passwordCorrect = user.length === 0 ? false : yield bcrypt_1.default.compare(password, user[0].password);
        if (!(user && passwordCorrect)) {
            return res.status(401).json({ error: 'invalid user or password' });
        }
        const payload = {
            sub: user[0].id,
            name: user[0].firstName,
            role: user[0].role.role,
            iat: (0, moment_1.default)().unix(),
            exp: (0, moment_1.default)().add(7, 'day').unix(),
        };
        const token = jsonwebtoken_1.default.sign(payload, config_1.default.SECRET);
        res.status(200).send({ user: user[0].firstName, access_token: token });
    });
}
exports.sigininUser = sigininUser;
function verifyUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            if (!token) {
                throw new Error();
            }
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
            const id = decoded.sub;
            const user = yield User_entity_1.User.find({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
                relations: {
                    role: true
                },
                where: {
                    id: id
                },
            });
            if (!user) {
                return res.status(400).json({ error: "failer", message: "User not found" });
            }
            const response = {
                id: user[0].id,
                name: user[0].firstName,
                lastname: user[0].lastName,
                role: {
                    name: user[0].role.role,
                }
            };
            const message = yield set(JSON.stringify(response));
            console.log(message);
            res.status(200).send({ status: "ok", data: message });
        }
        catch (err) {
            res.status(401).send('Please authenticate');
        }
    });
}
exports.verifyUser = verifyUser;
function set(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const keys = config_1.default.KEY;
        const key = CryptoJS.enc.Utf8.parse(keys);
        const iv = CryptoJS.enc.Utf8.parse(keys);
        const encrypted = CryptoJS.DES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    });
}
