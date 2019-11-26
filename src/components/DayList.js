import React from "react";
import "components/DayListItem.scss";
import DayListItem from "components/DayListItem";

export default function DayList({days, day, setDay}) {

  return (
    <ul>
      {days.map(dayItem => 
      <DayListItem
      key={dayItem.id}
      name={dayItem.name}
      spots={dayItem.spots}
      selected={dayItem.name === day}
      setDay={setDay}
      />)}
    </ul>
  )
}