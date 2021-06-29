"use strict";
/**
 * Required External Modules and Interfaces
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRouter = void 0;
const express = __importStar(require("express"));
const UsersService = __importStar(require("../models/users/users.service"));
const authCheck_1 = require("../middlewares/authCheck");
/**
 * Router Definition
 */
exports.UsersRouter = express.Router();
/**
 * Controller Definitions
 */
// GET users/
exports.UsersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const httpResponse = yield UsersService.getAll();
        let data = JSON.parse(JSON.stringify(httpResponse.data));
        res.status(httpResponse.status_code)
            .send({
            message: httpResponse.message,
            status: res.status,
            data
        });
    }
    catch (e) {
        res.status(404).send(e.message);
    }
}));
// GET users/id/:id
exports.UsersRouter.get('/id/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const httpResponse = yield UsersService.findById(id);
        let data = JSON.parse(JSON.stringify(httpResponse.data));
        res.status(httpResponse.status_code)
            .send({
            message: httpResponse.message,
            status: res.status,
            data
        });
    }
    catch (e) {
        res.status(404).send(e.message);
    }
}));
// GET users/:email
exports.UsersRouter.get('/email/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const httpResponse = yield UsersService.findByEmail(email);
        let data = JSON.parse(JSON.stringify(httpResponse.data));
        res.status(httpResponse.status_code)
            .send({
            message: httpResponse.message,
            status: res.status,
            data
        });
    }
    catch (e) {
        res.status(404).send(e.message);
    }
}));
// POST users/
exports.UsersRouter.post('/', authCheck_1.authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const httpResponse = yield UsersService.create(user);
        let data = JSON.parse(JSON.stringify(httpResponse.data));
        res.status(httpResponse.status_code)
            .send({
            message: httpResponse.message,
            status: res.status,
            data
        });
    }
    catch (e) {
        res.status(404).send(e.message);
    }
}));
// POST users/login
exports.UsersRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userLogin = req.body;
        const httpResponse = yield UsersService.login(userLogin);
        let data = JSON.parse(JSON.stringify(httpResponse.data));
        res.status(httpResponse.status_code)
            .send({
            message: httpResponse.message,
            status: res.status,
            data
        });
    }
    catch (e) {
        res.status(404).send(e.message);
    }
}));
// PUT users/
exports.UsersRouter.put('/', authCheck_1.authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const httpResponse = yield UsersService.update(user);
        let data = JSON.parse(JSON.stringify(httpResponse.data));
        res.status(httpResponse.status_code)
            .send({
            message: httpResponse.message,
            status: res.status,
            data
        });
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
// DELETE users/
exports.UsersRouter.delete('/:id', authCheck_1.authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield UsersService.remove(id);
        res.sendStatus(200);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
