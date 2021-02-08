
export function getAppointmentsForDay(state, day) {
  const selectedDay = state.days.find(x => x.name === day);
  let appointmentsForDay = [];
  if (selectedDay){
    appointmentsForDay = selectedDay.appointments.map(id => state.appointments[id])
  }
  return appointmentsForDay;
}


export function getInterview(state, interview) {
  let fullInterview = interview || null;
  if (fullInterview) {
    fullInterview = {...fullInterview, interviewer: state.interviewers[interview.interviewer]}
  }
  return fullInterview;
}


export function getInterviewersForDay(state, day) {
  const selectedDay = state.days.find(x => x.name === day);
  const interviewersForDay = [];

  if (selectedDay) {
    for (const interviewer of selectedDay.interviewers) {
      if (state.interviewers[interviewer]) {
        interviewersForDay.push(state.interviewers[interviewer])
      }
    }
  }
return interviewersForDay;
}