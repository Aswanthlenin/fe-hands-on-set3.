
export interface Room {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  roomId: string;
  date: string;
  title: string;
  start: string;
  end: string;
  attendees: string[];
}

export interface BookingFormData {
  title: string;
  start: string;
  end: string;
  attendees: string[];
}

export interface BookingErrors {
  title?: string;
  start?: string;
  end?: string;
  attendees?: string;
}
