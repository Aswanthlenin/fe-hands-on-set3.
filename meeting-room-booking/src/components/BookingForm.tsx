
import { useState } from "react";

import type {
  Booking,
  BookingFormData,
  BookingErrors
} from "../types/booking";

import { validateBooking } from "../utils/bookingValidation";

interface BookingFormProps {
  bookings: Booking[];
  loading: boolean;
  error: string;
  onSubmit: (data: BookingFormData) => Promise<boolean>;
}

function BookingForm({
  bookings,
  loading,
  error,
  onSubmit
}: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>({
    title: "",
    start: "09:00",
    end: "10:00",
    attendees: []
  });

  const [errors, setErrors] = useState<BookingErrors>({});

  // Update form fields
  const updateField = (
    field: keyof BookingFormData,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Add attendee
  const addAttendee = () => {
    setForm((prev) => ({
      ...prev,
      attendees: [...prev.attendees, ""]
    }));
  };

  // Update attendee email
  const updateAttendee = (
    index: number,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      attendees: prev.attendees.map((email, i) =>
        i === index ? value : email
      )
    }));
  };

  // Remove attendee
  const removeAttendee = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attendees: prev.attendees.filter(
        (_, i) => i !== index
      )
    }));
  };

  // Submit booking
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const cleanedForm: BookingFormData = {
      ...form,
      attendees: form.attendees.map((email) =>
        email.trim()
      )
    };

    // Validate before API call
    const validationErrors = validateBooking(
      cleanedForm,
      bookings
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Call parent API handler
    const success = await onSubmit(cleanedForm);

    // Reset form only after successful booking
    if (success) {
      setForm({
        title: "",
        start: "09:00",
        end: "10:00",
        attendees: []
      });

      setErrors({});
    }
  };

  return (
    <form
      className="booking-form"
      onSubmit={handleSubmit}
    >
      <h2>Book a Meeting Room</h2>

      {error && (
        <p className="error">{error}</p>
      )}

      {/* Meeting title */}
      <div className="form-group">
        <label htmlFor="title">Meeting Title</label>

        <input
          id="title"
          type="text"
          placeholder="Enter meeting title"
          value={form.title}
          onChange={(e) =>
            updateField("title", e.target.value)
          }
        />

        {errors.title && (
          <p className="error">{errors.title}</p>
        )}
      </div>

      {/* Start and end time */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="start">Start Time</label>

          <input
            id="start"
            type="time"
            step={900}
            value={form.start}
            onChange={(e) =>
              updateField("start", e.target.value)
            }
          />

          {errors.start && (
            <p className="error">{errors.start}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="end">End Time</label>

          <input
            id="end"
            type="time"
            step={900}
            value={form.end}
            onChange={(e) =>
              updateField("end", e.target.value)
            }
          />

          {errors.end && (
            <p className="error">{errors.end}</p>
          )}
        </div>
      </div>

      {/* Attendees */}
      <div className="form-group">
        <label>Attendees</label>

        {form.attendees.map((email, index) => (
          <div className="attendee-row" key={index}>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) =>
                updateAttendee(index, e.target.value)
              }
            />

            <button
              type="button"
              className="remove-btn"
              onClick={() => removeAttendee(index)}
            >
              Remove
            </button>
          </div>
        ))}

        {errors.attendees && (
          <p className="error">
            {errors.attendees}
          </p>
        )}

        <button
          type="button"
          className="secondary-btn"
          onClick={addAttendee}
        >
          + Add Attendee
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="primary-btn"
        disabled={loading}
      >
        {loading ? "Booking..." : "Book Meeting"}
      </button>
    </form>
  );
}

export default BookingForm;
