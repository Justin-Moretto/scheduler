import React from 'react'

//components
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

//hooks
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  //if (props.interview) console.log('apt index interview:', props)
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  const save = (name, interviewer, edit) => {
    transition(SAVING, true);
    const interview = {
      student: name,
      interviewer
    }
    props.bookInterview(props.id, interview, edit)
    .then(() => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true))
  };

  const onDelete = (id) => {
    transition(CONFIRM);
  };

  const deleteInterview = (id) => {
    console.log('index del interview id:', props.id)
    transition(DELETING, true);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true));
  };

  // const edit = () => {
  //   transition(EDIT);
  //   console.log('edit mode. passing:', props.interview.student, props.interview.interviewer)
  // }

  return (
    <article className="appointment">
      {<Header time={props.time}/>}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          id={props.id}
          onDelete={onDelete}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
          edit={false}
        />
      )}
      {mode === SAVING && (<Status message="Saving" /> )}
      {mode === DELETING && (<Status message="Deleting" />)}
      {mode === CONFIRM && (
        <Confirm
          onCancel={() => back()}
          onConfirm={() => deleteInterview()}
          message={"Are you sure you would like to delete?"}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          edit={true}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error 
          message="Error saving entry" 
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error 
          message="Error deleting entry" 
          onClose={() => back()}
        />
      )}
    </article>
)};