
import type { Room, Booking } from "../types/booking";

const rooms: Room[] = [
  { id: "room-1", name: "Meeting Room A" },
  { id: "room-2", name: "Meeting Room B" },
  { id: "room-3", name: "Meeting Room C" }
];

let bookings: Booking[] = [
  {
    id: "1",
    roomId: "room-1",
    date: "2026-11-23",
    title: "Daily Standup",
    start: "10:00",
    end: "11:00",
    attendees: ["john@gmail.com"]
  },
  {
    id: "2",
    roomId: "room-1",
    date: "2026-11-23",
    title: "Sprint Planning",
    start: "13:00",
    end: "14:00",
    attendees: ["alex@gmail.com"]
  }
];

const delay = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 300 + Math.random() * 500);
  });

export const bookingApi = {
  async getRooms(): Promise<Room[]> {
    await delay();
    return [...rooms];
  },

  async getBookings(
    roomId: string,
    date: string
  ): Promise<Booking[]> {
    await delay();

    return bookings
      .filter(
        (booking) =>
          booking.roomId === roomId &&
          booking.date === date
      )
      .map((booking) => ({ ...booking }));
  },

  async createBooking(
    booking: Booking
  ): Promise<Booking> {
    await delay();

    if (Math.random() < 0.1) {
      throw new Error("Booking failed. Please try again.");
    }

    const conflict = bookings.some(
      (existing) =>
        existing.roomId === booking.roomId &&
        existing.date === booking.date &&
        booking.start < existing.end &&
        booking.end > existing.start
    );

    if (conflict) {
      throw new Error("This time slot is already booked.");
    }

    bookings = [...bookings, booking];

    return { ...booking };
  },

  async cancelBooking(id: string): Promise<void> {
    await delay();

    bookings = bookings.filter(
      (booking) => booking.id !== id
    );
  }
};
