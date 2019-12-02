import React from "react";
import PropTypes from "prop-types";
import InterviewerListItem from "components/InterviewerListItem";
import  "components/InterviewerList.scss";
import "components/InterviewerListItem.scss";

InterviewerList.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default function InterviewerList({interviewers, value, onChange}) {
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(interviewerItem => 
        <InterviewerListItem 
        key={interviewerItem.id}
        name={interviewerItem.name}
        avatar={interviewerItem.avatar}
        selected={interviewerItem.id === value}
        setInterviewer={() => onChange(interviewerItem.id)}
        />)}
      </ul>
    </section>
  )
}