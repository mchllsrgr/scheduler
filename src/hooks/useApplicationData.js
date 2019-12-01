import React, { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const UPDATE_INTERVIEW = "UPDATE_INTERVIEW";

function reducer(state, action) {
  if (action.type === SET_DAY) {
    return {...state, day: action.value};
  } else if (action.type === SET_APPLICATION_DATA) {
    return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers};
  } else if (action.type === SET_INTERVIEW && action.method === 'book') {
    const oldSpots = state.days[action.index].spots;
    return {...state,
      appointments: action.appointments,
      days: state.days.map((item, index) => {
        if (index !== action.index) {
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
    const oldSpots = state.days[action.index].spots;
    return {...state,
      appointments: action.appointments,
      days: state.days.map((item, index) => {
        if (index !== action.index) {
          return item
        } else {
          return {
            ...item,
            spots: oldSpots + 1
          }
        }
      })
    }
  } else if (action.type === UPDATE_INTERVIEW) {
    // const oldSpots = state.days[action.index].spots;
      const updateAppointments = {
    ...state.appointments,
    [action.id]: action.appointment
    }
    return {...state,
      appointments: updateAppointments
      // days: state.days.map((item, index) => {
      //   if (index !== action.index) {
      //     return item
      //   } else {
      //     return {
      //       ...item,
      //       spots: oldSpots + 1
      //     }
      //   }
      // })
    }
  }
  else {
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
            const updated = {
              ...state.appointments[received.id],
              interview: received.interview
            };
            // const updateAppointments = {
            //   ...state.appointments,
            //   [received.id]: updated
            // }
            dispatch({type: "UPDATE_INTERVIEW", id: received.id, appointment: updated})
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
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({type: SET_INTERVIEW, appointments: appointments, method: 'book', index: findDayByAppointment(id, state)}))

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
      .then(() => dispatch({type: SET_INTERVIEW, appointments: appointmentsDeleted, method: 'cancel', index: findDayByAppointment(id, state)}))
  }


  function findDayByAppointment(id, state) {
    for (let i = 0; i < state.days.length; i++) {
      for(let a of state.days[i].appointments) {
        if (id === a) {
          return i;
        }
      }
    }
  }



  return { state, setDay, bookInterview, cancelInterview }

}