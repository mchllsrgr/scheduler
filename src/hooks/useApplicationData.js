import React, { useReducer, useEffect } from "react";
import axios from "axios";
import { findDayByAppointment } from "../helpers/selectors";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const RECALCULATE_SPOTS = "RECALCULATE_SPOTS";

function reducer(state, action) {
  if (action.type === SET_DAY) {
    return {...state, day: action.value};
  } else if (action.type === SET_APPLICATION_DATA) {
    return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers};
  } else if (action.type === SET_INTERVIEW && action.method === 'book') {
    const added = {
      ...state.appointments[action.id],
      interview: action.interview
    };
    const updateAdded = {
    ...state.appointments,
    [action.id]: added
    };
    return {...state,
      appointments: updateAdded};
  } else if (action.type === SET_INTERVIEW && action.method === 'cancel') {
    const deleted = {
      ...state.appointments[action.id],
      interview: action.interview
    };
    const updateDeleted = {
    ...state.appointments,
    [action.id]: deleted
    };
    return {...state,
      appointments: updateDeleted}
  } else if (action.type === RECALCULATE_SPOTS) {
    const dayIndex = findDayByAppointment(action.id, state);
    const appointmentIds = state.days[dayIndex].appointments;
      let newSpots = 0;
        for (let i = 0; i < appointmentIds.length; i++) {
          if (state.appointments[appointmentIds[i]].interview === null) {
            newSpots += 1;
          }
        }
      return {...state, 
      days: state.days.map((item, index) => {
        if (index !== dayIndex) {
          return item
        } else {
          return {
            ...item,
            spots: newSpots
          }
        }
      })}

  } else {
    throw new Error(`Unsupported action type: ${action.type}`);
  }
}

export default function useApplicationData() {
  // state
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

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
      .then(() => {
        const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
        webSocket.onopen = function(e) {
          console.log('CONNECTED');
        }
        webSocket.onmessage = function(e) {
          let received = JSON.parse(e.data)
          if (received.type === "SET_INTERVIEW") {
            let method = '';
            if (received.interview === null) {
              method = 'cancel';
            } else {
              method = 'book';
            }
            dispatch({ type: SET_INTERVIEW, id: received.id, interview: received.interview, method: method });
            dispatch({ type: RECALCULATE_SPOTS, id: received.id });
          }
        }
      })
      .catch((error) => console.log(error));
        
  
    }, [])



  // actions to change state

  function setDay(day) {
    dispatch({ type: "SET_DAY", value: day })
  };

  function bookInterview(bookId, interview) {
    return axios.put(`/api/appointments/${bookId}`, { interview })
    .then(() => dispatch({ type: SET_INTERVIEW, interview: interview, id: bookId, method: 'book' }))
    .then(() => dispatch({ type: RECALCULATE_SPOTS, id: bookId }))

  }

  function cancelInterview(cancelId, state) {
    return axios.delete(`/api/appointments/${cancelId}`)
      .then(() => dispatch({ type: SET_INTERVIEW, interview: null, id: cancelId, method: 'cancel' }))
      .then(() => dispatch({ type: RECALCULATE_SPOTS, id: cancelId }))
  }


  return { state, setDay, bookInterview, cancelInterview }

}