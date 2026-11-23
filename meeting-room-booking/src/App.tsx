
import { useEffect, useState } from "react";

import type {
  Room,
  Booking,
  BookingFormData
} from "./types/booking";

import { bookingApi } from "./services/bookingApi";

import RoomSelector from "./components/RoomSelector";
import BookingList from "./components/BookingList";
import BookingForm from "./components/BookingForm";

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialFilters() {
  const params = new URLSearchParams(window.location.search);

  return {
    room: params.get("room") || "",
    date: params.get("date") || getToday()
  };
}

function App() {
  const initialFilters = getInitialFilters();

  const [rooms, setRooms] = useState<Room[]>([]);

  const [selectedRoom, setSelectedRoom] = useState(
    initialFilters.room
  );

  const [selectedDate, setSelectedDate] = useState(
    initialFilters.date
  );

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);

  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");

  // Fetch rooms
  useEffect(() => {
    let active = true;

    const fetchRooms = async () => {
      setLoadingRooms(true);

      try {
        const data = await bookingApi.getRooms();

        if (!active) return;

        setRooms(data);

        const validRoom = data.some(
          (room) => room.id === initialFilters.room
        );

        if (!validRoom && data.length > 0) {
          setSelectedRoom(data[0].id);
        }
      } catch {
        if (active) {
          setError("Unable to load rooms");
        }
      } finally {
        if (active) {
          setLoadingRooms(false);
        }
      }
    };

    fetchRooms();

    return () => {
      active = false;
    };
  }, []);

  // Fetch bookings when room or date changes
  useEffect(() => {
    if (!selectedRoom || !selectedDate) return;

    let active = true;

    const fetchBookings = async () => {
      setLoadingBookings(true);
      setError("");
      setBookings([]);

      try {
        const data = await bookingApi.getBookings(
          selectedRoom,
          selectedDate
        );

        if (!active) return;

        const sorted = [...data].sort((a, b) =>
          a.start.localeCompare(b.start)
        );

        setBookings(sorted);
      } catch {
        if (active) {
          setError("Unable to load bookings");
        }
      } finally {
        if (active) {
          setLoadingBookings(false);
        }
      }
    };

    fetchBookings();

    return () => {
      active = false;
    };
  }, [selectedRoom, selectedDate]);

  // Synchronize URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedRoom) {
      params.set("room", selectedRoom);
    }

    if (selectedDate) {
      params.set("date", selectedDate);
    }

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }, [selectedRoom, selectedDate]);

  // Create booking
  const handleCreateBooking = async (
    formData: BookingFormData
  ): Promise<boolean> => {
    if (!selectedRoom) return false;

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      roomId: selectedRoom,
      date: selectedDate,
      ...formData
    };

    setCreatingBooking(true);
    setError("");

    try {
      const created = await bookingApi.createBooking(newBooking);

      setBookings((prev) =>
        [...prev, created].sort((a, b) =>
          a.start.localeCompare(b.start)
        )
      );

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create booking"
      );

      return false;
    } finally {
      setCreatingBooking(false);
    }
  };

  // Cancel booking with optimistic UI
  const handleCancelBooking = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this meeting?"
    );

    if (!confirmed) return;

    const previousBookings = [...bookings];

    setBookings((prev) =>
      prev.filter((booking) => booking.id !== id)
    );

    setCancelError("");

    try {
      await bookingApi.cancelBooking(id);
    } catch {
      setBookings(previousBookings);
      setCancelError("Unable to cancel booking. Please try again.");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Meeting Room Booking</h1>
        <p>Manage your meeting room reservations</p>
      </header>

      <section className="filters">
        <RoomSelector
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomChange={setSelectedRoom}
        />

        <div className="form-group">
          <label htmlFor="date">Select Date</label>

          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </section>

      {loadingRooms && <p>Loading rooms...</p>}

      {error && (
        <p className="error">{error}</p>
      )}

      {cancelError && (
        <p className="error">{cancelError}</p>
      )}

      <BookingList
        bookings={bookings}
        loading={loadingBookings}
        onCancel={handleCancelBooking}
      />

      <BookingForm
        bookings={bookings}
        loading={creatingBooking}
        error={error}
        onSubmit={handleCreateBooking}
      />
    </div>
  );
}

export default App;
