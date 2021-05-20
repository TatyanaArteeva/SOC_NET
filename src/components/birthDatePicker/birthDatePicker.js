import React, { useState } from "react";
import {connect} from 'react-redux';
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {dataBirth} from '../../actions';

const BirthDatePicker = ({dataBirth}) => {
    const [startDate, setStartDate] = useState();

    registerLocale("ru", ru);
    
    const futureDays = date => {
        return date <= new Date();
      };
    return (
      <DatePicker dateFormat="dd.MM.yyyy" 
                  filterDate={futureDays}
                  selected={startDate} 
                  onChange={(date) =>{
                  setStartDate(date);
                    if (date != null) {
                     dataBirth(new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]);

                    //  new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]

                    }
                  }} 
                  placeholderText="Укажите вашу дату рождения" 
                  isClearable
                  locale={ru}
      />
    );
  };

  const mapStateToProps=(state)=>{
    return {}
  }

  const mapDispatchToProps={
    dataBirth
  }

export default connect(mapStateToProps, mapDispatchToProps)(BirthDatePicker);
