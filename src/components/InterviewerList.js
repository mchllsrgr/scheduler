import React, { useState } from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerListItem.scss";


export default function InterviewerList({interviewers, interviewer, setInterviewer}) {
  
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(interviewer => 
        <InterviewerListItem 
        src={interviewer.avatar}
        />)}
      </ul>
    </section>
  )
}