import "date-fns";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

//Antd components
import "antd/dist/antd.css"; //works well in lightmode
import { TimePicker, DatePicker, message, Modal } from "antd";
import moment from "moment";
import "./timePickerStyles.css";

export default function TimePickerView({
  setSelectedDate,
  setSelectedStartTime,
  setSelectedEndTime,
  selectedStartTime,
  selectedDate,
  selectedEndTime,
  showModal,
  isModalVisible,
  darkMode,
  model,
}) {
  //holds values until submit
  const [tempStartTime, setTempStartTime] = useState(selectedStartTime);
  const [tempEndTime, setTempEndTime] = useState(selectedEndTime);
  const [tempDate, setTempDate] = useState(selectedDate);

  //error message func
  const error = (msg) => {
    message.error(msg);
  };

  const handleDateChange = (date) => {
    if (date === null) {
      date = new Date();
    } else {
      //convert from momentObj (antd specific) to dateObj
      date = date.toDate();
    }
    setTempDate(date);
  };

  //submit form and check invalid timepicks
  const handleOk = () => {
    //hide popup

    const now = new Date();

    //check valid timeinterval before setting
    if (
      (tempEndTime === now.getDate() && tempEndTime < now) ||
      tempEndTime < tempStartTime
    ) {
      error("Invalid time interval");
      return;
    } else {
      setSelectedEndTime(tempEndTime);
      setSelectedStartTime(tempStartTime);
      model.setSelectedStartTime(tempStartTime);
      model.setSelectedEndTime(tempEndTime);
    }

    // Cannot pick a date in the past
    if (tempDate <= new Date().setHours(0)) {
      error("Invalid date");
      return;
      //alert("inccorect date");
    } else {
      setSelectedDate(tempDate);
      model.setSelectedDate(tempDate);
    }
    showModal(false);
  };

  //switch modal, button and font theme
  if (darkMode) {
    document.documentElement.style.setProperty("--mode", "#222222");
    document.documentElement.style.setProperty("--fontTheme", "#4c65a1");
    document.documentElement.style.setProperty("--button", "#2e2e2e");
  } else {
    document.documentElement.style.setProperty("--mode", "#1f4ea3");
    document.documentElement.style.setProperty("--fontTheme", "#FFFFFF");
    document.documentElement.style.setProperty("--button", "#0565e3");
  }

  return (
    <>
      <Button
        variant="filled"
        color="primary"
        onClick={() => showModal(true)}
        startIcon={<AccessTimeIcon />}
      >
        Time range
      </Button>

      <Modal
        title="CHOOSE TIME INTERVAL"
        visible={isModalVisible}
        onCancel={() => showModal(false)}
        onOk={handleOk}
        width={328}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <h5 class="timeTitles">Date</h5>
        <p>
          <DatePicker
            style={{ width: "100%" }}
            value={moment(tempDate)}
            onSelect={handleDateChange}
          />
        </p>
        <p>
          <h5 class="timeTitles">Start Time</h5>
          <TimePicker
            format="HH:mm"
            minuteStep={30}
            style={{ width: "100%" }}
            value={moment(tempStartTime)}
            placeholder="Start time"
            onSelect={(date) => setTempStartTime(date.toDate())}
            popupClassName={{
              "& .ant-picker-footer": {
                display: "none",
              },
            }}
            showNow={false}
            disabledHours={() => [0, 1, 2, 3, 4, 5, 6]}
            hideDisabledOptions={true}
          />
        </p>
        <p>
          <h5 class="timeTitles">End Time</h5>
          <TimePicker
            format="HH:mm"
            minuteStep={30}
            style={{ width: "100%" }}
            value={moment(tempEndTime)}
            placeholder="End time"
            onSelect={(date) => setTempEndTime(date.toDate())}
            showNow={false}
            disabledHours={() => [0, 1, 2, 3, 4, 5, 6]}
            hideDisabledOptions={true}
          />
        </p>
      </Modal>
    </>
  );
}
