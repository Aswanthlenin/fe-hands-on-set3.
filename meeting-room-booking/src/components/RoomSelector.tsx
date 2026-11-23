
import type { Room } from "../types/booking";

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoom: string;
  onRoomChange: (roomId: string) => void;
}

function RoomSelector({
  rooms,
  selectedRoom,
  onRoomChange
}: RoomSelectorProps) {
  return (
    <div className="form-group">
      <label htmlFor="room">Meeting Room</label>

      <select
        id="room"
        value={selectedRoom}
        onChange={(e) => onRoomChange(e.target.value)}
      >
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RoomSelector;
