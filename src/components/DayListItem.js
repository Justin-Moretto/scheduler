import React from "react";
import classNames from "classnames";

import "components/DayListItem.scss";

export default function DayListItem(props) {
  const dayClass = classNames(
    'day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': !props.spots,
  });

  const formatSpots = (spots) => {
    if (spots === 0) return "no spots remaining";
    if (spots === 1) return "1 spot remaining";
    return `${spots} spots remaining`;
  }

  //console.log("DAYLISTITEM PROPS", props);
  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)} data-testid="day" >
      <h2>{props.name}</h2>
      <h5>{formatSpots(props.spots)}</h5>
    </li>
  );
}