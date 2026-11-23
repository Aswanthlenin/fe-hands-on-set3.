
import type { Booking } from "../types/booking";

interface BookingItemProps {
  booking: Booking;
  onCancel: (id: string) => void;
}

function BookingItem({
  booking,
  onCancel
}: BookingItemProps) {
  return (
    <div className="booking-item">
      <div>
        <h3>{booking.title}</h3>

        <p>
          {booking.start} - {booking.end}
        </p>

        <p>
          Attendees:{" "}
          {booking.attendees.length
            ? booking.attendees.join(", ")
            : "No attendees"}
        </p>
      </div>

      <button
        type="button"
        className="remove-btn"
        onClick={() => onCancel(booking.id)}
      >
        Cancel
      </button>
    </div>
  );
}

export default BookingItem;
