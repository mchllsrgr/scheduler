import React from "react";
import "components/DayListItem.scss";
import classNames from 'classnames/bind';

export default function DayListItem(props) {
  let dayClass = 'day-list__item';
  if (props.selected) dayClass += '--selected';
  else if (props.spots === 0) dayClass += '--full';

  return (
    <li className={dayClass} onClick={props.setDay}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{props.spots}</h3>
    </li>
  );
}