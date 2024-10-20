import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { seatRouter } from './routes/seatRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/train_booking')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/seats', seatRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
