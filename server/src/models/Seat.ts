import mongoose, { Document, Schema } from 'mongoose';

export interface ISeat extends Document {
  seatNumber: number;
  isBooked: boolean;
  rowNumber: number;
}

const seatSchema: Schema = new Schema({
  seatNumber: { type: Number, required: true, unique: true },
  isBooked: { type: Boolean, default: false },
  rowNumber: { type: Number, required: true },
});

export default mongoose.model<ISeat>('Seat', seatSchema);
