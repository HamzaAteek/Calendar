import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/Calender.css";
import PopUp from "./PopUp";

function Calender() {
  const [copiedEvent, setCopiedEvent] = useState(null);

  const [bool, setBool] = useState({
    open: false,
    viewMode: true,
    editMode: false,
    duration: 0,
    selectedInfo: null,
    selectedEvent: null,
    title: "",
    type: "",
    assignedTo: "",
    startTime: "",
    endTime: "",
    selectedDate: "",
  });
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupDirection, setPopupDirection] = useState("right");

  const [events, setEvents] = useState([]);

  const [filterType, setFilterType] = useState("all");
  const [filterAssignedTo, setFilterAssignedTo] = useState("all");

  const peopleList = ["hamza", "omar", "hasan", "abood", "mohammed"];

  const eventColorsByType = {
    visit: "#3b82f6",
    work: "#10b981",
    study: "#f59e0b",
    exam: "#8b5cf6",
    meating: "#ef4444",
  };
  const adjustPopupPosition = (x, y) => {
    const margin = 300; // هوامش الأمان
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let direction = "right";

    if (x > screenWidth - margin) {
      direction = "left";
    }
    if (y > screenHeight - margin) {
      direction = "top";
    }

    setPopupPosition({ x, y });
    setPopupDirection(direction);
  };

  const handleDateSelect = (info) => {
    const { pageX, pageY } = info.jsEvent;
    adjustPopupPosition(pageX, pageY);

    if (copiedEvent) {
      const originalStart = new Date(copiedEvent.start);
      const originalEnd = new Date(copiedEvent.end);
      const duration = originalEnd.getTime() - originalStart.getTime();

      const newStart = new Date(info.startStr);
      const newEnd = new Date(newStart.getTime() + duration);

      const newEvent = {
        title: copiedEvent.title,
        start: newStart,
        end: newEnd,
        assignedTo: copiedEvent.assignedTo,
        type: copiedEvent.type,
        allDay: false,
        id: String(new Date().getTime()),
        backgroundColor:
          copiedEvent.backgroundColor ||
          eventColorsByType[copiedEvent.type] ||
          "#000",
      };

      setEvents((prev) => [...prev, newEvent]);

      setCopiedEvent(null);
      return;
    }
    console.log("startStr:", info.startStr);
    console.log("endStr:", info.endStr);

    setBool((prev) => ({
      ...prev,
      open: true,
      selectedInfo: info,
      editMode: true,
      viewMode: false,
      title: "",
      type: "",
      assignedTo: "",
      startTime: "",
      endTime: "",
      selectedDate: info.startStr,
    }));
  };

  const handleEventClick = (info) => {
    const { pageX, pageY } = info.jsEvent;

    const event = info.event;

    const [eventType, restTitle] = event.title.split(" - ");
    const assignedName = event.extendedProps.assignedTo || "";
    adjustPopupPosition(pageX, pageY);
    const durationInMs = event.end - event.start;
    const durationInHours = durationInMs / (1000 * 60 * 60);

    setBool((prev) => ({
      ...prev,
      open: true,
      viewMode: true, // ← العرض فقط
      editMode: false, // ← لا تعديل حتى يُضغط زر التعديل
      selectedEvent: event,
      duration: durationInHours.toFixed(2),
      title: restTitle ? restTitle.replace(/\(.*\)/, "").trim() : "",
      type: eventType || "",
      assignedTo: assignedName,
      startTime: event.start
        ? event.start.getHours().toString().padStart(2, "0") +
          ":" +
          event.start.getMinutes().toString().padStart(2, "0")
        : "",
      endTime: event.end
        ? event.end.getHours().toString().padStart(2, "0") +
          ":" +
          event.end.getMinutes().toString().padStart(2, "0")
        : "",
      selectedDate: event.start ? event.start.toISOString().split("T")[0] : "",
    }));
  };

  const handleSaveEvent = () => {
    if (!bool.title || !bool.type || !bool.assignedTo) return;

    const formattedTitle = `${bool.type} - ${bool.title} (${bool.assignedTo})`;

    if (bool.editMode && bool.selectedEvent) {
      bool.selectedEvent.setProp("title", formattedTitle);
      bool.selectedEvent.setExtendedProp("assignedTo", bool.assignedTo);
      bool.selectedEvent.setExtendedProp("type", bool.type);
      bool.selectedEvent.setProp(
        "backgroundColor",
        eventColorsByType[bool.type] || "#000"
      );

      if (bool.startTime && bool.duration) {
        const [sh, sm] = bool.startTime.split(":");
        const newStart = new Date(
          bool.selectedDate || bool.selectedEvent.start
        );
        newStart.setHours(parseInt(sh), parseInt(sm));

        const durationInMs = parseFloat(bool.duration) * 60 * 60 * 1000;
        const newEnd = new Date(newStart.getTime() + durationInMs);

        bool.selectedEvent.setStart(newStart);
        bool.selectedEvent.setEnd(newEnd);
      }
    } else if (bool.selectedInfo) {
      const startDate = new Date(
        bool.selectedDate || bool.selectedInfo.startStr + "T00:00:00"
      );

      const endDate = bool.selectedInfo.endStr
        ? new Date(bool.selectedInfo.endStr)
        : new Date(bool.selectedInfo.startStr);

      if (bool.startTime) {
        const [sh, sm] = bool.startTime.split(":");
        startDate.setHours(parseInt(sh), parseInt(sm));
      }
      if (bool.endTime) {
        const [eh, em] = bool.endTime.split(":");
        endDate.setHours(parseInt(eh), parseInt(em));
      }

      const newEvent = {
        title: formattedTitle,
        start: startDate,
        end: endDate,
        allDay: bool.selectedInfo.allDay,
        assignedTo: bool.assignedTo,
        backgroundColor: eventColorsByType[bool.type] || "#000",
      };

      setEvents((prev) => [...prev, newEvent]);
    }

    setBool((prev) => ({
      ...prev,
      open: false,
      title: "",
      type: "",
      assignedTo: "",
      startTime: "",
      endTime: "",
      selectedInfo: null,
      selectedEvent: null,
    }));
  };

  const handleDeleteEvent = () => {
    if (bool.selectedEvent) {
      bool.selectedEvent.remove();
      setBool((prev) => ({
        ...prev,
        open: false,
        selectedEvent: null,
      }));
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesType =
      filterType === "all" || event.title.includes(filterType);
    const matchesAssignedTo =
      filterAssignedTo === "all" || event.assignedTo === filterAssignedTo;
    return matchesType && matchesAssignedTo;
  });

  return (
    <div className="App">
      {/* فلترة */}
      <div className="filters">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">all</option>
          <option value="exam">exam</option>
          <option value="visit">visit</option>
          <option value="study">study</option>
          <option value="work">work</option>
          <option value="meating">meating</option>
        </select>

        <select
          value={filterAssignedTo}
          onChange={(e) => setFilterAssignedTo(e.target.value)}
        >
          <option value="all">all</option>
          {peopleList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <FullCalendar
        className="my-custom-calendar"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable={true}
        editable={true}
        select={handleDateSelect}
        events={filteredEvents}
        eventClick={handleEventClick}
        eventResizableFromStart={true}
        eventContent={(arg) => {
          const start = arg.event.start;
          const end = arg.event.end;

          const formatTime = (date) => {
            if (!date) return "";
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const suffix = hours >= 12 ? "PM" : "AM";
            const hour12 = hours % 12 || 12;
            return `${hour12}:${minutes} ${suffix}`;
          };

          const timeRange =
            start && end
              ? `${formatTime(start)} - ${formatTime(end)}`
              : formatTime(start);

          return (
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8em", marginTop: "2px" }}>
                {timeRange}
              </div>
              <b>{arg.event.title}</b>
            </div>
          );
        }}
      />

      {bool.open && (
        <PopUp
          bool={bool}
          setBool={setBool}
          handleSaveEvent={handleSaveEvent}
          handleDeleteEvent={handleDeleteEvent}
          peopleList={peopleList}
          popupPosition={popupPosition}
          popupDirection={popupDirection}
          eventColorsByType={eventColorsByType}
          setCopiedEvent={setCopiedEvent}
        />
      )}
    </div>
  );
}

export default Calender;
