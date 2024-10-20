import express, { Request, Response, Router } from 'express';
import Seat, { ISeat } from '../models/Seat';

const seatRouter: Router = express.Router();

// Initialize seats
seatRouter.post('/init', async (req: Request, res: Response) => {
    try {
        await Seat.deleteMany({});
        const seats: Partial<ISeat>[] = [];
        for (let i = 1; i <= 80; i++) {
            const rowNumber = Math.ceil(i / 7);
            seats.push({ seatNumber: i, rowNumber, isBooked: false });
        }
        await Seat.insertMany(seats);
        res.status(201).json({ message: 'Seats initialized successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing seats', error });
    }
});

seatRouter.get('/', async (req: Request, res: Response) => {
    try {
        const seats = await Seat.find().sort('seatNumber');
        res.json(seats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seats', error });
    }
});

seatRouter.post('/book', async (req: Request, res: Response) => {
    try {
        const { numSeats } = req.body;
        if (typeof numSeats !== 'number' || numSeats < 1 || numSeats > 7) {
            res.status(400).json({ message: 'Invalid number of seats' });
            return; // Exit early after sending a response
        }

        const availableSeats = await Seat.find({ isBooked: false }).sort('seatNumber');
        console.log(availableSeats);
        if (availableSeats.length < numSeats) {
            res.status(400).json({ message: 'Not enough seats available' });
            return; // Exit early after sending a response
        }

        const bookedSeats: ISeat[] = [];
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
        await Seat.updateMany(
            { _id: { $in: bookedSeats.map(seat => seat._id) } },
            { $set: { isBooked: true } }
        );

        // Send the response only after all operations are done
        res.json({ bookedSeats: bookedSeats.map(seat => seat.seatNumber) });
    } catch (error) {
        res.status(500).json({ message: 'Error booking seats', error });
    }
});

// Reset all seats to unbooked
seatRouter.post('/reset', async (req: Request, res: Response) => {
    try {
        await Seat.updateMany({}, { isBooked: false });
        res.status(200).json({ message: 'All seats have been reset to unbooked' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting seats', error });
    }
});

export { seatRouter };
