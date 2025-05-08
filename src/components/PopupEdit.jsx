import React from "react";
import "../styles/Calender.css";
import { RiDeleteBinLine } from "react-icons/ri";

const PopupEdit = ({
  bool,
  setBool,
  handleSaveEvent,
  handleDeleteEvent,
  peopleList,
  popupColor,
}) => {
  return (
    <div className="edit-popup">
      <div>
        <input
          style={{
            backgroundColor: popupColor,
          }}
          type="text"
          placeholder="title"
          value={bool.title}
          onChange={(e) => setBool({ ...bool, title: e.target.value })}
          className="modal-input title"
        />
      </div>
      <div className="text-black">
        <div className="border-b-2 border-gray-300 mb-2 flex items-center gap-2">
          <p>Student</p>
          <select
            value={bool.assignedTo}
            onChange={(e) => setBool({ ...bool, assignedTo: e.target.value })}
            className="modal-select"
          >
            <option value=""></option>
            {peopleList?.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="border-b-2 border-gray-300 mb-2 flex items-center gap-2">
          <p>Agenda</p>{" "}
          <select
            value={bool.type}
            onChange={(e) => setBool({ ...bool, type: e.target.value })}
            className="modal-select"
          >
            <option value=""></option>
            <option value="meating">meating</option>
            <option value="visit">visit</option>
            <option value="work">work</option>
            <option value="study">study</option>
          </select>
        </div>
      </div>

      <div className="time-info">
        <div>
          <p>Time</p>
          <input
            className="mt-2"
            type="time"
            value={bool.startTime}
            onChange={(e) => setBool({ ...bool, startTime: e.target.value })}
          />
        </div>
        <div>
          <p>Length</p>
          <input
            className="w-20 mt-2"
            type="number"
            min="0.25"
            step="0.25"
            placeholder="المدة بالساعات"
            value={bool.duration}
            onChange={(e) => setBool({ ...bool, duration: e.target.value })}
          />
        </div>
        <div>
          <p>Date</p>

          <input
            className="w-20 mt-2"
            type="date"
            value={bool.selectedDate}
            onChange={(e) =>
              setBool((prev) => ({ ...prev, selectedDate: e.target.value }))
            }
          />
        </div>
      </div>
      <div>
        <input
          type="text"
          name=""
          id=""
          placeholder="Notes"
          className="txt-input"
        />
      </div>
      <div>
        <input
          type="text"
          name=""
          id=""
          placeholder="pickup Locatioon"
          className="pic-input"
        />
      </div>
      <div className="flex py-1">
        <button className="modal-save" onClick={handleSaveEvent}>
          Save{" "}
        </button>

        <button
          className="modal-exit"
          onClick={() => setBool({ ...bool, open: false })}
        >
          Cancel
        </button>
        <button className="modal-delete" onClick={handleDeleteEvent}>
          <RiDeleteBinLine />
        </button>
      </div>
    </div>
  );
};

export default PopupEdit;
