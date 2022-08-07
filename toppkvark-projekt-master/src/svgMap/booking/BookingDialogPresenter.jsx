import React from "react";
import BookingDialogView from "./BookingDialogView";

export default function BookingDialogPresenter({
  openDialog,
  campusName,
  setOpenDialog,
  roomId,
  floor,
  model,
  changeSVG,
}) {
  const [haveBooked, setHaveBooked] = React.useState(model.haveBookedRoom);

  React.useEffect(() => {
    function obs() {
      setHaveBooked(model.haveBookedRoom);
    }
    model.addObserver(obs);
    return function () {
      model.removeObserver(obs);
    };
  }, [model]);

  return (
    <BookingDialogView
      // book={(start, end, roomID) => model.bookRoom(start, end, roomID)}
      floor={floor}
      onClose={() => setOpenDialog(false)}
      open={openDialog}
      roomId={roomId}
      campusName={campusName}
      model={model}
      changeSVG={changeSVG}
      haveBooked={haveBooked}
    />
  );
}
