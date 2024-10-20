import React, { useState } from 'react';

interface BookingFormProps {
  onBooking: (numSeats: number) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBooking }) => {
  const [numSeats, setNumSeats] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBooking(numSeats);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="numSeats">Number of seats: </label>
      <input
        type="number"
        id="numSeats"
        min="1"
        max="7"
        value={numSeats}
        onChange={(e) => setNumSeats(parseInt(e.target.value))}
      />
      <button type="submit">Book Seats</button>
    </form>
  );
};

export default BookingForm;
