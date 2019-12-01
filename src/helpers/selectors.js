export function getAppointmentsForDay(state, day) {
  const result = [];
  for (let i = 0; i < state.days.length; i++) {
    if (state.days[i].name === day) {
      state.days[i].appointments.forEach(function(e) {
        result.push(e = state.appointments[e])
      })
    }
  }
  return result;
}
 

export function getInterview(state, interview) {
  let result = {};
  if (interview) {
    for (let int in state.interviewers) {
      if (interview.interviewer === state.interviewers[int].id) {
        result.student = interview.student;
        result.interviewer = state.interviewers[int];
        return result;
      }
    }
  }
  return null;
}

export function getInterviewersForDay(state, day) {
  const result = [];
  for (let i = 0; i < state.days.length; i++) {
    if (state.days[i].name === day) {
      state.days[i].interviewers.forEach(function(e) {
        result.push(e = state.interviewers[e])
      })
    }
  }
  return result;
}

export function findDayByAppointment(id, state) {
  for (let i = 0; i < state.days.length; i++) {
    for(let a of state.days[i].appointments) {
      if (id === a) {
        return i;
      }
    }
  }
}