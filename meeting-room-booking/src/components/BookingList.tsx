
import type { Booking } from "../types/booking";
import BookingItem from "./BookingItem";

interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  onCancel: (id: string) => void;
}

function BookingList({
  bookings,
  loading,
  onCancel
}: BookingListProps) {
  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (bookings.length === 0) {
    return (
      <div className="empty-state">
        No meetings booked for this day.
      </div>
    );
  }

  return (
    <div className="booking-list">
      <h2>Daily Schedule</h2>

      {bookings.map((booking) => (
        <BookingItem
          key={booking.id}
          booking={booking}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}

export default BookingList;
