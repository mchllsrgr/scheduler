import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";
import Form from "components/Appointment/Form";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

export default function Appointment({id, time, interview, interviewers, bookInterview, cancelInterview}) {
  const { mode, transition, back } = useVisualMode( interview ? SHOW : EMPTY );
  
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    bookInterview(id, interview)
      .then(() => transition(SHOW))
  }

  function deleteInt(id) {
    cancelInterview(id)
  }
  
  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
        student={interview.student}
        interviewer={interview.interviewer}
        onDelete={deleteInt}
        />
      )}
      {mode === CREATE && (
      <Form
      interviewer={2}
      interviewers={interviewers}
      onSave={save}
      onCancel={() => back()}
      />
      )}
      {mode === SAVING && (
        <Status message="Saving" />
      )}
    </article>
  )
}