import { useState, useEffect } from 'react';
import axios from 'axios';
import SeatLayout from './components/SeatLayout';
import BookingForm from './components/BookingForm';
import AvailableSeats from './components/AvailableSeats';
import './App.css';

const API_URL = 'https://trainseatbookingsystem.onrender.com/api';

interface Seat {
  _id: string;
  seatNumber: number;
  isBooked: boolean;
  rowNumber: number;
}

function App() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [message, setMessage] = useState('');
  const [availableSeats, setAvailableSeats] = useState(0);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await axios.get(`${API_URL}/seats`);
      if (response.data.length === 0) {
        // If no seats exist, initialize them
        await axios.post(`${API_URL}/seats/init`);
        const initializedSeats = await axios.get(`${API_URL}/seats`);
        setSeats(initializedSeats.data);
      } else {
        setSeats(response.data);
      }
      const available = response.data.filter((seat: Seat) => !seat.isBooked).length;
      setAvailableSeats(available);
    } catch (error) {
      console.error('Error fetching seats:', error);
      setMessage('Error fetching seats. Please try again.');
    }
  };

  const handleBooking = async (numSeats: number) => {
    try {
      const response = await axios.post(`${API_URL}/seats/book`, { numSeats });
      setMessage(`Booked seats: ${response.data.bookedSeats.join(', ')}`);
      fetchSeats();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Error booking seats');
      } else {
        setMessage('An unexpected error occurred');
      }
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(`${API_URL}/seats/reset`);
      setMessage('All seats have been reset to unbooked');
      fetchSeats();
    } catch (error) {
      console.error('Error resetting seats:', error);
      setMessage('Error resetting seats. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Train Seat Booking</h1>
      <AvailableSeats count={availableSeats} />
      <BookingForm onBooking={handleBooking} />
      <button onClick={handleReset} className="reset-button">Reset All Seats</button>
      {message && <p className="message">{message}</p>}
      <SeatLayout seats={seats} />
    </div>
  );
}

export default App;
