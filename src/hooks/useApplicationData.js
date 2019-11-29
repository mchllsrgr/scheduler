import React, { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";


function reducer(state, action) {
  if (action.type === SET_DAY) {
    return {...state, day: action.value};
  } else if (action.type === SET_APPLICATION_DATA) {
    return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers};
  } else if (action.type === SET_INTERVIEW) {
    return {...state, appointments: action.value};
  } else {
    throw new Error(`Unsupported action type: ${action.type}`);
  }
}

export default function useApplicationData() {
  // state
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {}
  })

  // actions to change state
  function setDay(day) {
    dispatch({ type: "SET_DAY", value: day })
  };

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({type: SET_INTERVIEW, value: appointments}))
  }

  function cancelInterview(id) {
    const deleted = {
      ...state.appointments[id],
      interview: null
    }
    const appointmentsDeleted = {
      ...state.appointments,
      [id]: deleted
    }
    return axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({type: SET_INTERVIEW, value: appointmentsDeleted}))
  }

    // api calls
    useEffect(() => {
      Promise.all([
        Promise.resolve(axios.get('/api/days')),
        Promise.resolve(axios.get('/api/appointments')),
        Promise.resolve(axios.get('/api/interviewers'))
      ])
      .then((all) => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        })
      })
      .catch((error) => console.log(error))
    }, [])

  return { state, setDay, bookInterview, cancelInterview }

}