import React, { useState, useEffect } from "react";
import axios from "axios";


import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import getAppointmentsForDay from "../helpers/selectors";



export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })
  const setDay = day => setState(prev => ({...prev, day}));
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments'))
    ])
    .then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data
      }));
      console.log(all[0].data)
      
    })
    .catch((error) => console.log(error))
  }, [])

  useEffect(() => {
    setAppointments(getAppointmentsForDay(state, state.day))
  }, [state])

  return (
    <main className="layout">
      <section className="sidebar">
          <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
           />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments.map(appointment =>
          <Appointment 
          key={appointment.id}
          {...appointment}
          />
        )}
        <Appointment id="last" time="7pm" />
      </section>
    </main>
  );
}
