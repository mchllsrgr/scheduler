import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form({ name:initialName, interviewer:initialInt, interviewers, onSave, onCancel }) {
  const [name, setName] = useState(initialName || "");
  const [interviewer, setFormInterviewer] = useState(initialInt || null);
  const [error, setError] = useState("");

  function cancel() {
    onCancel();
    reset();
  }

  function reset() {
    setName("");
    setFormInterviewer(null);
  }

  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={event => setName(event.target.value)}
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList interviewers={interviewers} value={interviewer} onChange={intId => setFormInterviewer(intId)} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={() => validate()}>Save</Button>
        </section>
      </section>
    </main>
  )
}