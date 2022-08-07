import data from "./availableRooms.json";

const RoomsAPI = {
  // book a room, returns [{id:name, isAvailable: boolean},{id:ka-302, isAvailable: true},...]
  getAvailableRooms(times) {
    return data.rooms.map((room) => {
      let available = true;
      for (const [key, value] of Object.entries(room.times)) {
        if (
          times.startTime <= parseInt(key) &&
          parseInt(key) <= times.endTime &&
          value !== true
        ) {
          available = false;
          break;
        }
      }
      return { id: room.roomName, isAvailable: available };
    });
  },
  setBookedRoom(bookTimes, roomID) {
    data.rooms.forEach((room) => {
      if (room.roomName === roomID) {
        console.log(roomID, room.roomName);
        for (const [key, value] of Object.entries(room.times)) {
          if (
            bookTimes.startTime <= parseInt(key) &&
            parseInt(key) <= bookTimes.endTime
          ) {
            if (value !== true) {
              alert(
                "you is wrong!! attempting to book a already booked room!! grrrrrrr"
              );
              break;
            }
            room.times[key] = false;
          }
          if (parseInt(key) === bookTimes.endTime) {
            alert("you have booked room!! wiiiiii");
          }
        }
      }
    });
  },
};
export default RoomsAPI;
