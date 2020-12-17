import React, { useState } from 'react'
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {
  // console.log('form props', props.name, props.interviewer)
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");
  
  //if (interviewer) setInterviewer(interviewer);

  const reset = () => {
    setName("");
    setInterviewer(null);
  }

  function cancel() {
    reset()
    props.onCancel()
  }

  // const save = () => {
  //   props.onSave(name, interviewer, props.edit)
  // }

  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    
    setError("");
    props.onSave(name, interviewer, props.edit);
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
            onChange={(event) => setName(event.target.value)}
            value={name}
            data-testid= "student-name-input"
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>Cancel</Button>
          <Button onClick={validate} confirm>Save</Button>
        </section>
      </section>
    </main>
  );
}



