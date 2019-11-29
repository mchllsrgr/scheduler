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
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

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
      .catch(() => transition(ERROR_SAVE, true))
  }

  function deleteInt(id) {
    transition(DELETING);
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
  }

  function confirmDelete() {
    transition(CONFIRM);
  }
  
  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
        student={interview.student}
        interviewer={interview.interviewer}
        onEdit={() => transition(EDIT)}
        onDelete={() => confirmDelete()}
        />
      )}
      {mode === CREATE && (
      <Form
      interviewers={interviewers}
      onSave={save}
      onCancel={() => back()}
      />
      )}
      {mode === EDIT && (
      <Form
      name={interview.student}
      interviewer={interview.interviewer.id}
      interviewers={interviewers}
      onSave={save}
      onCancel={() => back()}
      />
      )}
      {mode === SAVING && (
        <Status message="Saving" />
      )}
      {mode === CONFIRM && (
        <Confirm message="Are you sure you would like to delete?" onConfirm={() => deleteInt(id)} onCancel={() => back()} />
      )}
      {mode === DELETING && (
        <Status message="Deleting" />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not save appointment" onClose={() => back()} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not delete appointment" onClose={() => back()} />
      )}
    </article>
  )
}