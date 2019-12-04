import React, { useReducer, useEffect } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  RECALCULATE_SPOTS
} from "reducers/application";

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
    dispatch({ type: SET_DAY, value: day })
  };

  function bookInterview(bookId, interview) {
    return axios.put(`/api/appointments/${bookId}`, { interview })
    .then(() => dispatch({ type: SET_INTERVIEW, interview: interview, id: bookId, method: 'book' }))
    .then(() => dispatch({ type: RECALCULATE_SPOTS, id: bookId }))

  }

  function cancelInterview(cancelId) {
    return axios.delete(`/api/appointments/${cancelId}`)
      .then(() => dispatch({ type: SET_INTERVIEW, interview: null, id: cancelId, method: 'cancel' }))
      .then(() => dispatch({ type: RECALCULATE_SPOTS, id: cancelId }))
  }


  return { state, setDay, bookInterview, cancelInterview }

}