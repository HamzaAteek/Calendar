import React from "react";
import "../styles/Calender.css";
import PopupView from "./PopupView";
import PopupEdit from "./PopupEdit";

const PopUp = ({
  bool,
  setBool,
  handleSaveEvent,
  handleDeleteEvent,
  peopleList,
  popupPosition,
  popupDirection,
  eventColorsByType,
  setCopiedEvent,
}) => {
  const popupColor = eventColorsByType[bool.type] || "#aaa";

  return (
    <div
      className="modal-backdrop"
      onClick={() => setBool({ ...bool, open: false })}
    >
      <div
        className={`modal-popup ${popupDirection}`}
        style={{
          position: "fixed",
          top: popupPosition.y,
          left: popupPosition.x,
          transform:
            popupDirection === "right"
              ? "translate(10px, -50%)"
              : popupDirection === "left"
              ? "translate(-100%, -50%)"
              : popupDirection === "top"
              ? "translate(-50%, -100%)"
              : "translate(10px, 10px)",
          zIndex: 10000,
        }}
        onClick={(e) => e.stopPropagation()} // مهم عشان الكليك داخل النافذة ما يغلقها
      >
        <div className={`popup-arrow ${popupDirection}`} />
        {bool.editMode ? (
          <div className="popup-view-info">
            <PopupEdit
              bool={bool}
              setBool={setBool}
              handleSaveEvent={handleSaveEvent}
              handleDeleteEvent={handleDeleteEvent}
              peopleList={peopleList}
              popupColor={popupColor}
            />
          </div>
        ) : (
          <div>
            <PopupView
              bool={bool}
              setCopiedEvent={setCopiedEvent}
              setBool={setBool}
              setToEditMode={() =>
                setBool((prev) => ({ ...prev, editMode: true }))
              }
              popupColor={popupColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PopUp;
