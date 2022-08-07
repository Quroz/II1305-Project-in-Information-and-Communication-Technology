// // Firebase App (the core Firebase SDK) is always required and
// // must be listed before other Firebase SDKs
// import firebase from "firebase/app";
// // Add the Firebase services that you want to use
// import "firebase/database";

// firebase.initializeApp({
//   apiKey: "AIzaSyAFCpxpyxEgIy59XRHFL8pSljAyna6dQ7I",
//   authDomain: "bookrooms-2e6fb.firebaseapp.com",
//   databaseURL:
//     "https://bookrooms-2e6fb-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "bookrooms-2e6fb",
//   storageBucket: "bookrooms-2e6fb.appspot.com",
//   messagingSenderId: "500970026983",
//   appId: "1:500970026983:web:b9628f8c827514682a2f42",
//   measurementId: "G-XE3X1J97VX",
// });
// function persistModel(appModel) {
//   let loadingFromFirebase = false;
//   // Save to firebase
//   appModel.addObserver(function () {
//     firebase.database().ref("appModel").set({
//       // selectedDate: appModel.selectedDate,
//       // selectedStartTime: appModel.selectedStartTime,
//       // selectedEndTime: appModel.selectedEndTime,
//       darkMode: appModel.darkMode,
//       campus: appModel.campus,
//       // floor: appModel.floor,
//     });
//   });
//   // Load from firebase
//   firebase
//     .database()
//     .ref("appModel")
//     .on("value", function (data) {
//       loadingFromFirebase = true;
//       if (data.val()) {
//         // appModel.setSelectedDate(data.val().selectedDate);
//         // appModel.setSelectedStartTime(data.val().selectedStartTime);
//         // appModel.setSelectedEndTime(data.val().selectedEndTime);
//         appModel.setDarkMode(data.val().darkMode);
//         appModel.setCampus(data.val().campus);
//       }
//       loadingFromFirebase = false;
//     });
// }

// export { persistModel };
