import React from 'react';

interface AvailableSeatsProps {
  count: number;
}

const AvailableSeats: React.FC<AvailableSeatsProps> = ({ count }) => {
  return (
    <div className="available-seats">
      <h2>Available Seats: {count}</h2>
    </div>
  );
};

export default AvailableSeats;
