import React from 'react';

interface Seat {
    _id: string;
    seatNumber: number;
    isBooked: boolean;
    rowNumber: number;
}

interface SeatLayoutProps {
    seats: Seat[];
}

const SeatLayout: React.FC<SeatLayoutProps> = ({ seats }) => {
    return (
        <div className="seat-layout">
            {seats.map((seat) => (
                <div
                    key={seat._id}
                    className={`seat ${seat.isBooked ? 'booked' : 'available'}`}
                >
                    {seat.seatNumber}
                </div>
            ))}
        </div>
    );
};

export default SeatLayout;
