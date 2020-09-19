"use strict";
/**
 * Required External Modules and Interfaces
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const RegistrationsService = __importStar(require("./registrations.service"));
/**
 * Router Definition
 */
exports.RegistrationsRouter = express.Router();
/**
 * Controller Definitions
 */
// GET registrations/
exports.RegistrationsRouter.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
exports.RegistrationsRouter.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
exports.RegistrationsRouter.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const registration = req.body;
        const httpResponse = yield RegistrationsService.create(registration);
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
// PUT registrations/
exports.RegistrationsRouter.put('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
exports.RegistrationsRouter.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield RegistrationsService.remove(id);
        res.sendStatus(200);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
