import React, { useState } from "react";
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import parseISO from 'date-fns/parseISO';
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dataBirth } from '../../actions';

const ModificationBirthDatePicker = ({ userInformation }) => {
  const { birthDate } = userInformation
  const date = birthDate;
  let newDate = null;
  if (date.length !== 0 || date !== undefined || date !== null || date !== "Информация отсутствует") {
    const dateTime = new Date(date).getTime();
    const dateTimeZone = new Date(date).getTimezoneOffset() * 60 * 1000;
    const dateNewTimeZone = new Date(dateTime + dateTimeZone).toISOString();
    const dateBirth = parseISO(dateNewTimeZone);
    newDate = dateBirth
  }

  const [startDate, setStartDate] = useState(newDate);

  registerLocale("ru", ru);

  const futureDays = date => {
    return date <= new Date();
  };
  return (
    <DatePicker dateFormat="dd.MM.yyyy"
      filterDate={futureDays}
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        if (date != null) {
          dataBirth(new Date(date.getTime() -
            date.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]);
        }
      }}
      placeholderText="Укажите вашу дату рождения"
      isClearable
      locale={ru}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    userInformation: state.userInformation,
  }
}

export default connect(mapStateToProps)(ModificationBirthDatePicker);