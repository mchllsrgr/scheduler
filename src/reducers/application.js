import { findDayByAppointment } from "../helpers/selectors";

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
export const RECALCULATE_SPOTS = "RECALCULATE_SPOTS";

export default function reducer(state, action) {
  if (action.type === SET_DAY) {
    return {...state, day: action.value};
  } else if (action.type === SET_APPLICATION_DATA) {
    return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers};
  } else if (action.type === SET_INTERVIEW) {
    const updated = {
      ...state.appointments[action.id],
      interview: action.interview
    };
    const updateAppointments = {
    ...state.appointments,
    [action.id]: updated
    };
    return {...state,
      appointments: updateAppointments};
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