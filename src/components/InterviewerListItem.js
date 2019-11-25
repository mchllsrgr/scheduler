import React from "react";
import "components/InterviewerListItem.scss";

export default function InterviewerListItem({ id, name, avatar, selected, setInterviewer }) {
  return (
    <li className="interviewers__item" id={id} selected={selected} onClick={setInterviewer}>
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
      {name}
    </li>
  )
}