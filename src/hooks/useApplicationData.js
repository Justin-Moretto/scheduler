import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    console.log('GETTING STATES FROM API SERVER...')
    Promise.all([
      axios.get('/api/days',
      { headers: { 'Access-Control-Allow-Origin': '*' }),
      axios.get('/api/appointments',
      { headers: { 'Access-Control-Allow-Origin': '*' }),
      axios.get('/api/interviewers',
      { headers: { 'Access-Control-Allow-Origin': '*' })
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data })
        );
      });
  }, []);


  const getSpotsForDay = (state) => {
    const dayFound = {...state.days.find(obj => obj.name === state.day)};
    let spots = 0;
    for (const appointmentId of dayFound.appointments) {
      if (state.appointments[appointmentId].interview === null ) {
        spots++;
      }
    }
    const dayIndex = dayFound.id - 1;
    return { spots, dayIndex };
    
  }

  function bookInterview(id, interview, edit = false) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newStateTemp = { ...state, appointments }

    const {spots, dayIndex} = getSpotsForDay(newStateTemp);
    
    const daySpotsUpdate = { ...state.days[dayIndex], spots }

    const updatedDays = [...state.days]
    updatedDays[dayIndex] = daySpotsUpdate;

    return new Promise((resolve, reject) => {
      axios.put(`/api/appointments/${id}`, {interview})
        .then(function (res) {
          setState({...state, appointments, days: updatedDays})
          resolve();
        })
        .catch(function (error) {
          console.log(error);
          reject();
        })
    })
  }

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    const newStateTemp = { ...state, appointments }
    const {spots, dayIndex} = getSpotsForDay(newStateTemp);
    
    const daySpotsUpdate = { ...state.days[dayIndex], spots }

    const updatedDays = [...state.days]
    updatedDays[dayIndex] = daySpotsUpdate;

    return new Promise((resolve, reject) => {
      axios.delete(`/api/appointments/${id}`)
        .then(function (res){
          setState({...state, appointments, days: updatedDays})
          resolve();
        })
        .catch(function (error) {
          console.log(error);
          reject();
        })
    })
  }

  return { state, setDay, bookInterview, cancelInterview }
}