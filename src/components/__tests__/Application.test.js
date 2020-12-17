import React from "react";
import axios from "axios";

import { render,
  cleanup, waitForElement, fireEvent,
  getByText, getAllByTestId, getByAltText,
  getByPlaceholderText, queryByText, prettyDOM,
  queryByAltText
  } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
    
    fireEvent.click(getByText("Tuesday"));
    
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
  
    fireEvent.click(getByAltText(appointment, "Add"));
  
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
  
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument()

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //target booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Edit" button on the booked appointment
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Check that the input is displaying the student name
    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveValue("Archie Cohen");

    // 5. Check that the interviewer is preselected
    expect(getByAltText(appointment, "Tori Malcolm")).toBeInTheDocument();

    // 6. Enter new student name - "Lydia Miller-Jones"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 7. Click "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    // 8. Check that the element with the text "Saving..." is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 9. Wait until the element with the text "Lydia Miller-Jones" is displayed
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    //target Monday in the navbar
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    // 10. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining"
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    //mocks the error mode
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //target appointments in the DOM nodes
    const appointments = getAllByTestId(container, "appointment");

    //target first appointment = empty
    const appointment = appointments[0];

    // 3. Click the "Add" button on the first empty appointment
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click the first interviewer in the list
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait until the element with the text "Error" is displayed
    await waitForElement(() => getByText(appointment, "Error"));

    // 9. Click on "Close" button
    fireEvent.click(getByAltText(appointment, "Close"));

    // 10. Check that the EMPTY view is displaying again
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //target booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Edit" button on the booked appointment
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the CONFIRM mode shows up - "Are you sure you would like to delete?"
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click "Confirm" button
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the text "Error" is displayed
    await waitForElement(() => getByText(appointment, "Error"));
    
    // 8. Click on "Close" button
    fireEvent.click(getByAltText(appointment, "Close"));
    
    // 9. Expect the appointment to still be displayed on the page
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();

  });


})

