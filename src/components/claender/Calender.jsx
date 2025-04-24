import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calender.css";

function Calender() {
  const [open, setOpen] = useState(false); //خاصة بالنافذة المنبثقة
  const [editMode, setEditMode] = useState(false); //معرفة هل النافذة المنبثقة خاصة بالتعديل أم الإضافة
  const [selectedInfo, setSelectedInfo] = useState(null); //تخزين معلومات التاريخ المحدد
  const [selectedEvent, setSelectedEvent] = useState(null); //التعديل بالحدث المحدد
  const [title, setTitle] = useState(""); //تخزين عنوان الحدث
  const [type, setType] = useState(""); //تخزين نوع الحدث
  const [events, setEvents] = useState([
    //الأحداث الإفتراضية
    { title: "اجتماع - الفريق", date: "2025-04-25" },
    { title: "زيارة - تسليم", date: "2025-04-26" },
  ]);

  const eventColorsByType = {
    //تخصيص لون الحدث حسب نوع الحدث
    اجتماع: "#3b82f6",
    زيارة: "#10b981",
    موعد: "#f59e0b",
    إيميل: "#8b5cf6",
  };

  const handleDateSelect = (info) => {
    //دالة فتح النافذة المنبثقة عند الضغط على الفترة الزمنية المعينة
    setSelectedInfo(info);
    setEditMode(false);
    setOpen(true);
    setTitle("");
    setType("");
  };

  const handleEventClick = (info) => {
    //دالة فتح النافذة المنبثقة عند الضغط على حدث معين موجود
    const event = info.event;
    const [eventType, eventTitle] = event.title.split(" - ");
    setSelectedEvent(event);
    setTitle(eventTitle);
    setType(eventType);
    setEditMode(true);
    setOpen(true);
  };

  const handleSaveEvent = () => {
    if (!title || !type) return;

    if (editMode && selectedEvent) {
      //شرط لفحص هل الإجراء هو تعديل أم إضافة
      selectedEvent.setProp("title", `${type} - ${title}`);
    } else if (selectedInfo) {
      const newEvent = {
        title: `${type} - ${title}`,
        start: selectedInfo.startStr,
        end: selectedInfo.endStr,
        allDay: selectedInfo.allDay,
      };
      setEvents([...events, newEvent]); //إضافة المعلومات على الستايت
    }
    //إفراغ الحقول
    setTitle("");
    setType("");
    setSelectedInfo(null);
    setSelectedEvent(null);
    setOpen(false);
  };

  return (
    <div className="App">
      <h2>تقويم الأحداث</h2>

      <FullCalendar
        className="my-custom-calendar"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable={true} //قابل للتحديد
        editable={true} //قابل للتحرير
        select={handleDateSelect} //عند الضغط يتم اضافة حدث
        events={events} //يظهر الأحداث الموجودة
        eventClick={handleEventClick} //عند الضغط على حدث موجود
        eventResizableFromStart={true} //تغيير حجم الحدث
        eventDidMount={(info) => {
          //دالة تلوين الأحداث حسب نوعها
          //تخصيص لون الحدث حسب نوعه
          const title = info.event.title;
          const type = Object.keys(eventColorsByType).find((t) =>
            title.includes(t)
          );
          //تلوين الأحداث حسب كل نوع حدث
          const color = eventColorsByType[type] || "#6b7280";
          info.el.style.backgroundColor = color;
          info.el.style.color = "white";
          info.el.style.borderRadius = "5px";
        }}
      />

      {open && ( //النافذة المنبثقة للإضافة او تعديل الأحداث
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editMode ? "تعديل الحدث" : "إضافة حدث جديد"}</h3>
            <input
              type="text"
              placeholder="عنوان الحدث"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">اختر نوع الحدث</option>
              <option value="اجتماع">اجتماع</option>
              <option value="زيارة">زيارة</option>
              <option value="موعد">موعد</option>
              <option value="إيميل">إيميل</option>
            </select>
            <button onClick={handleSaveEvent}>
              {editMode ? "حفظ التعديلات" : "إضافة"}
            </button>
            <button onClick={() => setOpen(false)}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calender;
