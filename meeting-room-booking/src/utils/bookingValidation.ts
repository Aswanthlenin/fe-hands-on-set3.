
import type {
  Booking,
  BookingFormData,
  BookingErrors
} from "../types/booking";

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export function validateBooking(
  form: BookingFormData,
  bookings: Booking[]
): BookingErrors {
  const errors: BookingErrors = {};

  if (!form.title.trim()) {
    errors.title = "Meeting title is required";
  }

  if (!form.start) {
    errors.start = "Start time is required";
  }

  if (!form.end) {
    errors.end = "End time is required";
  }

  if (!form.start || !form.end) {
    return errors;
  }

  const start = toMinutes(form.start);
  const end = toMinutes(form.end);

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !Number.isInteger(start) ||
    !Number.isInteger(end)
  ) {
    errors.start = "Invalid start time";
    return errors;
  }

  if (start < 540 || start >= 1080) {
    errors.start = "Start must be between 09:00 and 18:00";
  }

  if (end <= 540 || end > 1080) {
    errors.end = "End must be between 09:00 and 18:00";
  }

  if (start >= end) {
    errors.end = "End time must be after start time";
  }

  if (
    start % 15 !== 0 ||
    end % 15 !== 0
  ) {
    errors.start = "Times must use 15-minute intervals";
  }

  if (end - start > 240) {
    errors.end = "Meeting cannot exceed 4 hours";
  }

  const validEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emails = form.attendees.map((email) =>
    email.trim().toLowerCase()
  );

  if (
    emails.some(
      (email) => !email || !validEmail.test(email)
    )
  ) {
    errors.attendees = "Please enter valid email addresses";
  }

  if (new Set(emails).size !== emails.length) {
    errors.attendees = "Duplicate email addresses are not allowed";
  }

  const hasOverlap = bookings.some((booking) => {
    const existingStart = toMinutes(booking.start);
    const existingEnd = toMinutes(booking.end);

    return start < existingEnd && end > existingStart;
  });

  if (
    start < end &&
    !errors.start &&
    !errors.end &&
    hasOverlap
  ) {
    errors.start = "This time overlaps with an existing booking";
  }

  return errors;
}
