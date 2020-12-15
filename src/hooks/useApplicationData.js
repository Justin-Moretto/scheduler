import { useState, useEffect } from "react";
const axios = require('axios');

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //axios.get('/api/debug/reset') //for reseting db

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    console.log('GETTING STATES FROM API SERVER...')
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data })
        );
      });
  }, []);


  const getSpotsForDay = () => {
    if (state.days) {
      const dayFound = state.days.find(obj => obj.name === state.day);
      const dayIndex = dayFound.id - 1;
      const initialSpots = dayFound.spots;
      return { dayIndex, initialSpots };
    }
  }
  console.log()

  function bookInterview(id, interview, edit = false) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    console.log('is this an edit?', edit)
    if (!edit) {
      const { dayIndex, initialSpots } = getSpotsForDay();
      const newSpots = initialSpots - 1;
      const daySpotsUpdate = {
        ...state.days[dayIndex],
        spots: newSpots
      }
      const updatedDays = [...state.days]
      updatedDays[dayIndex] = daySpotsUpdate;

      setState(prev => ({...prev, days: updatedDays}))
    }

    return new Promise((resolve, reject) => {
      axios.put(`/api/appointments/${id}`, {interview})
        .then(function (res){
          setState({...state, appointments})
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
    
    const { dayIndex, initialSpots } = getSpotsForDay();
    const newSpots = initialSpots + 1;
    console.log('state.days:', state.days)
    console.log('days spots', state.days[dayIndex].spots)
    console.log(`initial spots spots for ${dayIndex}: ${initialSpots}..remaining after deleting:`, newSpots)
    const daySpotsUpdate = {
      ...state.days[dayIndex],
      spots: newSpots
    }
    const updatedDays = [...state.days]
    updatedDays[dayIndex] = daySpotsUpdate;

    setState(prev => ({...prev, days: updatedDays}))

    return new Promise((resolve, reject) => {
      axios.delete(`/api/appointments/${id}`)
        .then(function (res){
          setState({...state, appointments})
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