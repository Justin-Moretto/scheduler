import React from "react";

import DayListItem from "components/DayListItem";

export default function DayList(props){
  //console.log("DAYLIST", props)
  const days = props.days;

  const handleDayList = days.map(day => <DayListItem 
    key={day.id}
    name={day.name}
    spots={day.spots} 
    selected={day.name === props.day}
    setDay={props.setDay}
    />);
  return <ul>
    { handleDayList }
  </ul>
}