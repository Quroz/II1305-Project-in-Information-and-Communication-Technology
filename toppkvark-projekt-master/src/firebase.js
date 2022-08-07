import firebase from "firebase/app";
import "firebase/firestore";
import Cookies from "js-cookie";

// Ignore warnings about Date.prototype (DO NOT REMOVE; NOT A COMMENT)
/*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/

// sluttid är alltid 2 timmar före starttid när man öppnar sidan
// eslint-disable-next-line
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

// Gets the dates hours, adds leading zero when less than 10
// eslint-disable-next-line
Date.prototype.getNormalDate = function () {
  let day = this.getDate();
  if (day < 10) day = `0${day}`;
  let month = this.getMonth() + 1;
  if (month < 10) month = `0${month}`;
  let year = this.getFullYear();
  return parseInt(`${day}${month}${year}`, 10);
};

const firebaseConfig = {
  apiKey: "AIzaSyD_CWt_lFEXXt1UjrTLXTbEbjmucEkEXCk",
  authDomain: "toppkvark-b34b5.firebaseapp.com",
  projectId: "toppkvark-b34b5",
  storageBucket: "toppkvark-b34b5.appspot.com",
  messagingSenderId: "196854829729",
  appId: "1:196854829729:web:69ad2b65181c1f0be116e0",
  measurementId: "G-CK1TZP716Z",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

// Get booked rooms in time intevall
export async function getBookings(campusName, startTime, endTime, date) {
  let bookedRooms = [];
  await db
    .collection(campusName)
    .where("date", "==", date.getNormalDate())
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let end = firebase.firestore.Timestamp.fromDate(endTime);
        let start = firebase.firestore.Timestamp.fromDate(startTime);

        if (doc.data().endTime > end && doc.data().startTime >= end) {
        } else if (
          doc.data().endTime <= start &&
          doc.data().startTime < start
        ) {
        } else
          bookedRooms.push({
            startTime: doc.data().startTime.toDate(),
            endTime: doc.data().endTime.toDate(),
            userName: doc.data().userName,
            roomId: doc.data().roomId,
          });
      });
    });
  return bookedRooms;
}

// Checks if room is booked within time intervall
// Returns true if room is booked
export async function isBooked(campusName, roomId, startTime, endTime, date) {
  let isTaken = false;
  await db
    .collection(campusName)
    .where("date", "==", date.getNormalDate())
    .where("roomId", "==", roomId)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        let end = firebase.firestore.Timestamp.fromDate(endTime);
        let start = firebase.firestore.Timestamp.fromDate(startTime);

        if (doc.data().endTime > end && doc.data().startTime >= end) {
        } else if (
          doc.data().endTime <= start &&
          doc.data().startTime < start
        ) {
        } else {
          isTaken = true;
        }
      });
    });
  return isTaken;
}

// Returns all taken times as an array for a given room an day
export async function getRoomsBookings(campusName, roomId, date) {
  let takenTimes = [];
  await db
    .collection(campusName)
    .where("date", "==", date.getNormalDate())
    .where("roomId", "==", roomId)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        takenTimes.push({
          startTime: doc.data().startTime.toDate(),
          endTime: doc.data().endTime.toDate(),
        });
      });
    });
  return takenTimes;
}

export async function createBooking(
  campusName,
  roomId,
  userName,
  startTime,
  endTime,
  date
) {
  // Add new doc
  let id;
  await db
    .collection(campusName)
    .add({
      userName: userName,
      date: date.getNormalDate(),
      startTime: firebase.firestore.Timestamp.fromDate(startTime),
      endTime: firebase.firestore.Timestamp.fromDate(endTime),
      roomId: roomId,
    })
    .then((querySnapshot) => {
      id = querySnapshot.id;
    });

  Cookies.set(
    "bookingData",
    `${campusName} ${roomId} ${startTime.getHoursZero()}:${startTime.getMinutesZero()} - ${endTime.getHoursZero()}:${endTime.getMinutesZero()}`,
    { expires: endTime }
  );
  Cookies.set("bookingId", id, { expires: endTime });
}

export async function removeBooking() {
  let bookingId = Cookies.get("bookingId");
  let campusName = Cookies.get("bookingData");
  if (campusName) {
    campusName = campusName.split(" ")[0];

    await db.collection(campusName).doc(bookingId).delete();
    Cookies.remove("bookingId");
    Cookies.remove("bookingData");
    Cookies.remove("haveBooked");
  }
}
