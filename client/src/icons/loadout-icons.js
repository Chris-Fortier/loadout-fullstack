import React from "react";

// these are my own icons

// const transform = "scale(-1, -1) translate(-24, -24)"; // pack to right
const transform = ""; // pack to left

export function PackedIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            transform={transform}
            className="parent-item"
            d="M 16.535156,1.0996094 12.585938,5.0507812 H 0 V 19.050781 H 12.585938 L 16.535156,23 17.949219,21.585938 13.414062,17.050781 H 2 V 7.0507812 H 13.414062 L 17.949219,2.515625 Z"
         />
         <rect
            transform={transform}
            className="this-item"
            width="8"
            height="8"
            x="3"
            y="8"
         />
      </svg>
   );
}

export function PackedIcon2() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            className="parent-item"
            d="M 0,5 V 19 H 13.667969 L 16.220703,12.839844 14.373047,12.074219 12.332031,17 H 2 V 7 h 10.332031 l 2.041016,4.925781 1.847656,-0.765625 L 13.667969,5 Z"
         />
         <rect className="this-item" width="8" height="8" x="3" y="8" />
      </svg>
   );
}

export function ReadyToPackIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            transform={transform}
            className="parent-item"
            d="M 16.535156,1.0996094 12.585938,5.0507812 H 0 V 19.050781 H 12.585938 L 16.535156,23 17.949219,21.585938 13.414062,17.050781 H 2 V 7.0507812 H 13.414062 L 17.949219,2.515625 Z"
         />
         <rect
            transform={transform}
            className="this-item"
            width="8"
            height="8"
            x="16"
            y="8"
         />
      </svg>
   );
}

export function NotReadyToPackIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            transform={transform}
            className="parent-item"
            d="M 17.535156,1.0996094 13.585938,5.0507812 H 1 V 19.050781 H 13.585938 L 17.535156,23 18.949219,21.585938 14.414062,17.050781 H 3 V 7.0507812 H 14.414062 L 18.949219,2.515625 Z"
         />
      </svg>
   );
}

export function ChildrenUnpackedIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            transform={transform}
            className="this-item"
            d="M 16.535156,1.0996094 12.585938,5.0507812 H 0 V 19.050781 H 12.585938 L 16.535156,23 17.949219,21.585938 13.414062,17.050781 H 2 V 7.0507812 H 13.414062 L 17.949219,2.515625 Z"
         />
         <rect
            transform={transform}
            className="child-item"
            width="4"
            height="4"
            x="20"
            y="10"
         />
         <rect
            transform={transform}
            className="child-item"
            width="4"
            height="4"
            x="13"
            y="10"
         />
         <rect
            transform={transform}
            className="child-item"
            width="4"
            height="4"
            x="6"
            y="10"
         />
      </svg>
   );
}

export function ChildrenPackedIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            transform={transform}
            className="this-item"
            d="m 0.04882812,5.2578125 c 0,4.5774738 0,9.1549475 0,13.7324215 H 14.03125 V 5.2578125 Z m 1.99999998,2 H 12.03125 V 16.990234 H 2.0488281 Z"
         />
         <rect
            transform={transform}
            className="child-item"
            width="4"
            height="4"
            x="7"
            y="10"
         />
         <rect
            transform={transform}
            className="child-item"
            width="4"
            height="4"
            x="5"
            y="8"
         />
         <rect
            transform={transform}
            className="child-item"
            width="4"
            height="4"
            x="3"
            y="12"
         />
      </svg>
   );
}

export function ChildrenPackedIcon2() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            transform={transform}
            className="this-item"
            d="M 0,4.9999998 V 19 H 13.667969 L 16.220702,12.839844 14.373047,12.074219 12.332031,17 H 2 V 6.9999998 h 10.332031 l 2.041016,4.9257812 1.847655,-0.765625 -2.552733,-6.1601562 z"
         />
         <path
            transform={transform}
            className="child-item"
            d="M 3,12 H 5 V 8 h 4 v 2 h 2 v 4 H 7 v 2 H 3 Z"
         />
      </svg>
   );
}
