import React from "react";
import "../styles/Calender.css";
import { MdEdit } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { MdOutlineAssignment } from "react-icons/md";

const formatTime12Hour = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // تحويل 0 إلى 12 للـ 12AM
  return `${hour}:${minute} ${ampm}`;
};
const PopupView = ({
  bool,
  setBool,
  setToEditMode,
  popupColor,
  setCopiedEvent,
}) => {
  return (
    <div>
      <div className="title">
        <div>
          <div
            style={{
              backgroundColor: popupColor,
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "20px",
            }}
          >
            <h3>{bool.title}</h3>
            <p>
              {formatTime12Hour(bool.startTime)} -{" "}
              {formatTime12Hour(bool.endTime)}
            </p>
          </div>
          <div className="p-4 ">
            <div>
              <p>Student </p>
              <p className="font-medium">{bool.assignedTo}</p>
            </div>
            <div className="my-2 border-y-2 border-gray-300">
              <p>Agenda</p>
              <p className="font-medium">{bool.type}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="modal-buttons">
          <button className="modal-edit" onClick={setToEditMode}>
            <MdEdit className="icon" />
            Edit appointment
          </button>

          <button
            className="modal-copy"
            onClick={() => {
              const event = bool.selectedEvent;

              if (event) {
                const eventToCopy = {
                  title: event.title,
                  start: event.start,
                  end: event.end,
                  assignedTo: event.extendedProps.assignedTo,
                  type: event.extendedProps.type,
                  backgroundColor: event.backgroundColor,
                };
                setCopiedEvent(eventToCopy);
              }
              setBool({ ...bool, open: false });
            }}
          >
            Copy
          </button>
        </div>
        <div className="modal-buttons">
          <button
            className="modal-cancel"
            onClick={() => setBool({ ...bool, open: false })}
          >
            <MdOutlineCancel className="icon" />
            Cancel appointment
          </button>

          <button
            className="modal-Leskaart"
            onClick={() => setBool({ ...bool, open: false })}
          >
            <MdOutlineAssignment className="icon" />
            Leskaart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupView;
