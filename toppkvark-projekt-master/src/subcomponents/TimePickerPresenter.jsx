import React from "react";
import Typography from "@material-ui/core/Typography";
import TimePickerView from "./TimePickerView";

export default function TimePickerPresenter({ model }) {
  // Ignore warnings about Date.prototype (DO NOT REMOVE; NOT A COMMENT)
  /*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/

  // sluttid är alltid 2 timmar före starttid när man öppnar sidan
  // eslint-disable-next-line
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };

  // Converts date to a string in the DD-MM-YYYY format
  // eslint-disable-next-line
  Date.prototype.toNormalString = function () {
    return (
      this.getFullYear() + "-" + this.getMonthZero() + "-" + this.getDateZero()
    );
  };

  // Gets the dates month++, adds leading zero when less than 10
  // eslint-disable-next-line
  Date.prototype.getMonthZero = function () {
    let month = this.getMonth() + 1;
    if (month < 10) month = `0${month}`;
    return month;
  };

  // Gets the dates date, adds leading zero when less than 10
  // eslint-disable-next-line
  Date.prototype.getDateZero = function () {
    let date = this.getDate();
    if (date < 10) date = `0${date}`;
    return date;
  };

  // Gets the dates hours, adds leading zero when less than 10
  // eslint-disable-next-line
  Date.prototype.getHoursZero = function () {
    let hours = this.getHours();
    if (hours < 10) hours = `0${hours}`;
    return hours;
  };

  // Gets the dates minutes, adds leading zero when less then 10
  // eslint-disable-next-line
  Date.prototype.getMinutesZero = function () {
    let minutes = this.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;
    return minutes;
  };

  // hooks för val av tider
  const [selectedDate, setSelectedDate] = React.useState(model.selectedDate);
  const [selectedStartTime, setSelectedStartTime] = React.useState(
    model.selectedStartTime
  );
  const [selectedEndTime, setSelectedEndTime] = React.useState(
    model.selectedEndTime
  );

  //dialogruta för timepicker
  const [isModalVisible, showModal] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(model.darkMode);

  React.useEffect(() => {
    function obs() {
      setSelectedDate(model.selectedDate);
      setSelectedStartTime(model.selectedStartTime);
      setSelectedEndTime(model.selectedEndTime);
      setDarkMode(model.darkMode);
    }
    model.addObserver(obs);
    return function () {
      model.removeObserver(obs);
    };
  }, [model]);

  return (
    <>
      <Typography color="textPrimary" variant="h6">
        {model.selectedDate.toNormalString()}:{" "}
        {model.selectedStartTime.getHoursZero()}:
        {model.selectedStartTime.getMinutesZero()} -{" "}
        {model.selectedEndTime.getHoursZero()}:
        {model.selectedEndTime.getMinutesZero()}
      </Typography>
      <TimePickerView
        setSelectedDate={setSelectedDate}
        setSelectedStartTime={setSelectedStartTime}
        setSelectedEndTime={setSelectedEndTime}
        isModalVisible={isModalVisible}
        showModal={showModal}
        model={model}
        selectedDate={selectedDate}
        selectedStartTime={selectedStartTime}
        selectedEndTime={selectedEndTime}
        darkMode={darkMode}
      />
    </>
  );
}
