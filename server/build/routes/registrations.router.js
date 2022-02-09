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
exports.RegistrationsRouter = void 0;
const express = __importStar(require("express"));
const RegistrationsService = __importStar(require("../models/registrations/registrations.service"));
/**
 * Router Definition
 */
exports.RegistrationsRouter = express.Router();
/**
 * Controller Definitions
 */
// GET registrations/
exports.RegistrationsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const httpResponse = yield RegistrationsService.getAll();
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
// GET registrations/:id
exports.RegistrationsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const httpResponse = yield RegistrationsService.find(id);
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
// POST registrations/
exports.RegistrationsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registration = req.body;
        const httpResponse = yield RegistrationsService.create(registration);
        let data = JSON.parse(JSON.stringify(httpResponse.data));
        console.log(data);
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
// PUT registrations/
exports.RegistrationsRouter.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registration = req.body;
        const httpResponse = yield RegistrationsService.update(registration);
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
// DELETE registrations/
exports.RegistrationsRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield RegistrationsService.remove(id);
        res.sendStatus(200);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
