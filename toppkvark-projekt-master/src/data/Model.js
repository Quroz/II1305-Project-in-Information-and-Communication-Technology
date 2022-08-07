import RoomAPI from "./RoomsAPI";

// class Model is used to store and update user specific data for keeping consistency in the application.
class Model {
  constructor() {
    this.observers = [];
    this.selectedDate = new Date();
    this.selectedStartTime = new Date();
    this.selectedEndTime = new Date().addHours(2);
    this.selectedTimes = {};
    this.darkMode = false;
    this.campus = "Kista";
    this.floor = null;
    this.haveBookedRoom = false;
  }
  // bookRoom books the time slot for the interval given by start and end. roomID is the room the user wishes to book.
  bookRoom(start, end, roomID) {
    RoomAPI.setBookedRoom({ startTime: start, endTime: end }, roomID);
    this.notifyObservers();
  }

  // Gets start time
  getStartTime() {
    return this.selectedStartTime;
  }

  getEndTime() {
    return this.selectedEndTime;
  }

  getDate() {
    return this.selectedDate;
  }

  getCampus() {
    return this.campus;
  }

  // onOff sets dark mode
  setDarkMode(onOff) {
    if (onOff === true) {
      this.darkMode = true;
    } else {
      this.darkMode = false;
    }
    this.notifyObservers();
  }
  // onOff sets dark mode
  setHaveBookedRoom(haveBooked) {
    if (haveBooked === true) {
      this.haveBookedRoom = true;
    } else {
      this.haveBookedRoom = false;
    }
    this.notifyObservers();
  }

  // Sets date and call observers
  setSelectedDate(date) {
    this.selectedDate = date;
    this.notifyObservers();
  }
  // Sets start time and call observers
  setSelectedStartTime(date) {
    //clamps time to 00 or 30
    if (0 < date.getMinutes() && date.getMinutes() <= 30) {
      date.setMinutes(30);
    } else if (0 !== date.getMinutes()) {
      date.setMinutes(0);
      date.setHours(date.getHours() + 1);
    }
    // Sets end time and call observers
    date.setSeconds(0);

    this.selectedStartTime = date;
    this.setSelectedTimes();
    this.notifyObservers();
  }
  setSelectedEndTime(date) {
    //clamps time to 00 or 30
    if (0 < date.getMinutes() && date.getMinutes() <= 30) {
      date.setMinutes(30);
    } else if (0 !== date.getMinutes()) {
      date.setMinutes(0);
      date.setHours(date.getHours() + 1);
    }
    // Sets end time and call observers
    date.setSeconds(0);
    this.selectedEndTime = date;
    this.setSelectedTimes();
    this.notifyObservers();
  }
  setSelectedTimes() {
    const start = parseInt(
      "" +
        this.selectedStartTime.getHours() +
        (this.selectedStartTime.getMinutes() < 10 ? "0" : "") +
        this.selectedStartTime.getMinutes()
    );
    const end = parseInt(
      "" +
        this.selectedEndTime.getHours() +
        (this.selectedEndTime.getMinutes() < 10 ? "0" : "") +
        this.selectedEndTime.getMinutes()
    );
    this.selectedTimes = { startTime: start, endTime: end };
    this.notifyObservers();
  }
  // Sets campus to campus if it is found in the array of valid ones.
  setCampus(campus) {
    this.campus = campus;
    //this.notifyObservers();
    // if not, implement error handling
  }
  changeFloor(floor) {
    // if (campus.floors.find(flr => flr === floor)) this.floor = floor; Sets the floor if its valid
    // Else throw error
  }

  // <--------------------Observers---------------------
  //
  // add- and removeObservers is exclusively used by the controllers/presenters
  addObserver(callback) {
    this.observers = [...this.observers, callback]; // [..., ] is called "spread syntax"
  }
  removeObserver(callback) {
    this.observers = this.observers.filter((item) => item !== callback);
  }
  // this function is exclusively used by the model in the end of its function calls.
  notifyObservers() {
    // For every observer in the observers array, we fire them. This will update the state with the setter function in the observer created in the useEffect in the controller.
    this.observers.forEach((cb) => cb());
  }
  // ---------------------------------------------------->
}

// Ignore warnings about Date.prototype (DO NOT REMOVE; NOT A COMMENT)
/*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/

// sluttid är alltid 2 timmar före starttid när man öppnar sidan
// eslint-disable-next-line
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

export default Model;
