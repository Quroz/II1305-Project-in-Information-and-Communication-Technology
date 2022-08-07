import React, { useState } from "react";
import RoomsAPI from "../data/RoomsAPI";

import data from "./data.json";

import Kista2 from "../assets/SVG/Kista2.svg";
import Kista3 from "../assets/SVG/Kista3.svg";
import Flemingsberg4 from "../assets/SVG/Flemingsberg4.svg";
import Flemingsberg5 from "../assets/SVG/Flemingsberg5.svg";
import Flemingsberg6 from "../assets/SVG/Flemingsberg6.svg";
import Flemingsberg8 from "../assets/SVG/Flemingsberg8.svg";
import Sodertalje2 from "../assets/SVG/Sodertalje2.svg";
import Sodertalje3 from "../assets/SVG/Sodertalje3.svg";
import Sodertalje4 from "../assets/SVG/Sodertalje4.svg";
import BuildingView from "./BuildingView";

export default function BuildingPresenter({
  campusName,
  drawerOpen,
  handleDrawerOpen,
  model,
  darkMode,
}) {
  // Get correct data from data.json
  const getBuildingFloors = () => {
    for (let index = 0; index < data.campus.length; index++) {
      if (data.campus[index].name === campusName) {
        return data.campus[index].buildings[0].floors;
      }
    }
  };
  // Gets initial value for hooks
  let floors = getBuildingFloors();

  // hook för rätt index i array med svg filer
  // ger rätt våning med andra ord
  const [floorIndex, setFloorIndex] = useState(floors[0].index);

  // hook för rätt floor som visas i booking dialog
  const [floor, setFloor] = useState(floors[0].floor);

  // hook för roomId/namn, visas i dialog
  const [roomId, setRoomId] = useState(" ");

  // hook för att öppna booking dialo
  const [openDialog, setOpenDialog] = useState(false);

  const [apiData, setApiData] = useState(
    RoomsAPI.getAvailableRooms(model.selectedTimes)
  );
  const [force, setForce] = useState(false); //FOOK

  React.useEffect(() => {
    function obs() {
      setApiData(RoomsAPI.getAvailableRooms(model.selectedTimes));
      setForce(true);
    }
    model.addObserver(obs);
    return function () {
      model.removeObserver(obs);
    };
  }, [model]);

  return (
    <BuildingView
      force={force} //FOOK
      availableRooms={apiData}
      drawerOpen={drawerOpen}
      handleDrawerOpen={handleDrawerOpen}
      campusName={campusName}
      svgArray={
        // Array containing svg files
        [
          Kista3,
          Kista2,
          Flemingsberg8,
          Flemingsberg6,
          Flemingsberg5,
          Flemingsberg4,
          Sodertalje4,
          Sodertalje3,
          Sodertalje2,
        ]
      }
      floor={floor}
      handleFloorChange={(value) => {
        // Changes the floor by updating 2 hooks
        setFloorIndex(value.index);
        setFloor(value.floor);
      }}
      floors={floors}
      floorIndex={floorIndex}
      setRoomId={setRoomId}
      setOpenDialog={setOpenDialog}
      handleOpenDialog={() => setOpenDialog(true)} // handler för att öppna dialog rutan när man klickar på grupprum
      openDialog={openDialog}
      roomId={roomId}
      model={model}
      darkMode={darkMode}
    />
  );
}
