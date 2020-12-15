import React, { useState, useEffect } from "react";

import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../../src/helpers/selectors.js";
import useApplicationData from "../hooks/useApplicationData";

import "components/Application.scss";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  console.log('State.days:', state.days)
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day)

  const selectedSchedule = dailyAppointments.map(appointment => {
    const fullInterview = getInterview(state, appointment.interview);
    //if (fullInterview) console.log('PASSING TO APT INDEX', fullInterview)
    return (
      <Appointment
      key={appointment.id}
      {...appointment} 
      interview={fullInterview}
      interviewers={dailyInterviewers}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
      />
    );
  });


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
        { selectedSchedule }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}