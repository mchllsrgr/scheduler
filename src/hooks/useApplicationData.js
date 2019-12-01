import React, { useReducer, useEffect } from "react";
import axios from "axios";
import { findDayByAppointment } from "../helpers/selectors";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
webSocket.onopen = function(e) {
  console.log('CONNECTED');
}

function reducer(state, action) {
  if (action.type === SET_DAY) {
    return {...state, day: action.value};
  } else if (action.type === SET_APPLICATION_DATA) {
    return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers};
  } else if (action.type === SET_INTERVIEW && action.method === 'book') {
    const dayIndex = findDayByAppointment(action.id, state);
    const oldSpots = state.days[dayIndex].spots;
    const updateAppointments = {
      ...state.appointments,
      [action.id]: action.appointment
      }
    return {...state,
      appointments: updateAppointments,
      days: state.days.map((item, index) => {
        if (index !== dayIndex) {
          return item
        } else {
          return {
            ...item,
            spots: oldSpots - 1
          }
        }
      })
    };
  } else if (action.type === SET_INTERVIEW && action.method === 'cancel') {
    const dayIndex = findDayByAppointment(action.id, state);
    const oldSpots = state.days[dayIndex].spots;
    const updateAppointments = {
      ...state.appointments,
      [action.id]: action.appointment
      }
    return {...state,
      appointments: updateAppointments,
      days: state.days.map((item, index) => {
        if (index !== dayIndex) {
          return item
        } else {
          return {
            ...item,
            spots: oldSpots + 1
          }
        }
      })
    }
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
        webSocket.onmessage = function(e) {
          let received = JSON.parse(e.data)
          if (received.type === "SET_INTERVIEW") {
            const updated = {
              interview: received.interview
            };

            let method = '';
            if (received.interview === null) {
              method = 'cancel';
            } else {
              method = 'book';
            }
            dispatch({type: "SET_INTERVIEW", id: received.id, appointment: updated, method: method})
          }
        }
      })
      .catch((error) => console.log(error));
        
  
    }, [])



  // actions to change state
  function setDay(day) {
    dispatch({ type: "SET_DAY", value: day })
  };

  function bookInterview(id, interview) {
    const added = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => webSocket.send(JSON.stringify({type: SET_INTERVIEW, appointment: added, id: id, method: 'book'})))

  }

  function cancelInterview(id) {
    const deleted = {
      ...state.appointments[id],
      interview: null
    }

    return axios.delete(`/api/appointments/${id}`)
      .then(() => webSocket.send(JSON.stringify({type: SET_INTERVIEW, appointment: deleted, id: id, method: 'cancel'})))
  }



  return { state, setDay, bookInterview, cancelInterview }

}