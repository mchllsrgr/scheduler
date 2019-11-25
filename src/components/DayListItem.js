import React from "react";
import "components/DayListItem.scss";
import classNames from 'classnames/bind';

export default function DayListItem({name, spots, selected, setDay}) {
  let dayClass = classNames('day-list__item',
  {'day-list__item--selected' : selected},
  {'day-list__item--full' : spots === 0});

  function formatSpots(spots) {
    if (spots === 0) {
      return 'no spots';
    } else if (spots === 1) {
      return `${spots} spot`;
    } else if (spots > 1) {
      return `${spots} spots`;
    }
  }

  return (
    <li className={dayClass} onClick={() => setDay(name)}>
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{formatSpots(spots)} remaining</h3>
    </li>
  );
}