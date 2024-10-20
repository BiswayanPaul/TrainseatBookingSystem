"use strict";
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
exports.seatRouter = void 0;
const express_1 = __importDefault(require("express"));
const Seat_1 = __importDefault(require("../models/Seat"));
const seatRouter = express_1.default.Router();
exports.seatRouter = seatRouter;
// Initialize seats
seatRouter.post('/init', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Seat_1.default.deleteMany({});
        const seats = [];
        for (let i = 1; i <= 80; i++) {
            const rowNumber = Math.ceil(i / 7);
            seats.push({ seatNumber: i, rowNumber, isBooked: false });
        }
        yield Seat_1.default.insertMany(seats);
        res.status(201).json({ message: 'Seats initialized successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error initializing seats', error });
    }
}));
seatRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seats = yield Seat_1.default.find().sort('seatNumber');
        res.json(seats);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching seats', error });
    }
}));
seatRouter.post('/book', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { numSeats } = req.body;
        if (typeof numSeats !== 'number' || numSeats < 1 || numSeats > 7) {
            res.status(400).json({ message: 'Invalid number of seats' });
            return; // Exit early after sending a response
        }
        const availableSeats = yield Seat_1.default.find({ isBooked: false }).sort('seatNumber');
        console.log(availableSeats);
        if (availableSeats.length < numSeats) {
            res.status(400).json({ message: 'Not enough seats available' });
            return; // Exit early after sending a response
        }
        const bookedSeats = [];
        let remainingSeats = numSeats;
        // Try to book seats in the same row
        for (let i = 1; i <= 12 && remainingSeats > 0; i++) {
            const rowSeats = availableSeats.filter(seat => seat.rowNumber === i);
            const seatsToBook = Math.min(remainingSeats, rowSeats.length);
            if (seatsToBook > 0) {
                bookedSeats.push(...rowSeats.slice(0, seatsToBook));
                remainingSeats -= seatsToBook;
            }
        }
        // Update booked seats in the database
        yield Seat_1.default.updateMany({ _id: { $in: bookedSeats.map(seat => seat._id) } }, { $set: { isBooked: true } });
        // Send the response only after all operations are done
        res.json({ bookedSeats: bookedSeats.map(seat => seat.seatNumber) });
    }
    catch (error) {
        res.status(500).json({ message: 'Error booking seats', error });
    }
}));
// Reset all seats to unbooked
seatRouter.post('/reset', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Seat_1.default.updateMany({}, { isBooked: false });
        res.status(200).json({ message: 'All seats have been reset to unbooked' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error resetting seats', error });
    }
}));
