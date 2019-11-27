export default function getAppointmentsForDay(state, day) {
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