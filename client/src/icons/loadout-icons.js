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

export function ChildrenAddIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            className="this-item"
            d="M 16.535156,1.0996094 12.585938,5.0507812 H 0 V 19.050781 H 12.585938 L 16.535156,23 17.949219,21.585938 13.414062,17.050781 H 2 V 7.0507812 H 13.414062 L 17.949219,2.515625 Z"
         />
         <path
            className="child-item"
            d="M 17.5 7 L 17.5 10.5 L 14 10.5 L 14 13.5 L 17.5 13.5 L 17.5 17 L 20.5 17 L 20.5 13.5 L 24 13.5 L 24 10.5 L 20.5 10.5 L 20.5 7 L 17.5 7 z "
         />
      </svg>
   );
}

export function DeleteItemIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            className="child-item"
            d="M 16.535156,1.0996094 12.585938,5.0507812 H 0 V 19.050781 H 12.585938 L 16.535156,23 17.949219,21.585938 13.414062,17.050781 H 2 V 7.0507812 H 13.414062 L 17.949219,2.515625 Z"
         />
         <path
            className="this-item"
            d="M 14.403806,9.5251263 16.87868,12 l -2.474874,2.474874 2.12132,2.12132 L 19,14.12132 l 2.474874,2.474874 2.12132,-2.12132 L 21.12132,12 23.596194,9.5251263 21.474874,7.4038059 19,9.8786797 16.525126,7.4038059 Z"
         />
      </svg>
   );
}

export function AddIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            className="primary this-item"
            d="M 10 1 L 10 10 L 1 10 L 1 14 L 10 14 L 10 23 L 14 23 L 14 14 L 23 14 L 23 10 L 14 10 L 14 1 L 10 1 z "
         />
      </svg>
   );
}

export function DeleteIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            className="primary this-item"
            d="M 2.8076118,5.636039 9.1715729,12 2.8076118,18.363961 5.636039,21.192388 12,14.828427 18.363961,21.192388 21.192388,18.363961 14.828427,12 21.192388,5.636039 18.363961,2.8076118 12,9.1715729 5.636039,2.8076118 Z"
         />
      </svg>
   );
}

export function DisabledIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            className="primary"
            d="m 12,2.0078125 c -5.5008548,0 -9.9921875,4.4913327 -9.9921875,9.9921875 0,5.500855 4.4913327,9.992188 9.9921875,9.992188 5.500855,0 9.992188,-4.491333 9.992188,-9.992188 0,-5.5008548 -4.491333,-9.9921875 -9.992188,-9.9921875 z m 0,3 c 3.879534,0 6.992188,3.112653 6.992188,6.9921875 0,3.879534 -3.112654,6.992188 -6.992188,6.992188 C 8.1204655,18.992188 5.0078125,15.879534 5.0078125,12 5.0078125,8.1204655 8.1204655,5.0078125 12,5.0078125 Z"
         />
         <path
            className="primary"
            d="M 16.939453,4.9394531 4.9394531,16.939453 7.0605469,19.060547 19.060547,7.0605469 Z"
         />
      </svg>
   );
}

export function CheckedIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            className="primary"
            d="M 20.585938,0.5859375 8,13.171875 3.4140625,8.5859375 0.5859375,11.414062 8,18.828125 23.414062,3.4140625 Z"
         />
      </svg>
   );
}

export function PickUpItem() {
   return (
      <svg viewBox="0 0 24 24">
         <rect className="this-item" width="8" height="8" x="3" y="13" />
         <path
            className="move-color"
            d="m 13,3 v 2 c 1.5,0 3.057292,0 4.585938,0 L 13.292969,9.2929688 14.707031,10.707031 19,6.4140625 C 19,7.9427083 19,9.4713542 19,11 h 2 c 0,-2.6666667 0,-5.3333333 0,-8 -2.666667,0 -5.333333,0 -8,0 z"
         />
      </svg>
   );
}

export function PutDownItem() {
   return (
      <svg viewBox="0 0 24 24">
         <rect className="this-item" width="8" height="8" x="13" y="3" />
         <path
            className="move-color"
            d="M 11,21 V 19 C 9.471354,19 7.942708,19 6.414062,19 L 10.707031,14.707031 9.292969,13.292969 5,17.585937 C 5,16.057292 5,14.528646 5,13 H 3 c 0,2.666667 0,5.333333 0,8 2.666667,0 5.333333,0 8,0 z"
         />
      </svg>
   );
}

export function CancelMoveIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <rect className="this-item" width="8" height="8" x="3" y="13" />
         <path
            className="move-color"
            d="M 15.750001,1.5 C 12.03402,1.5 9,4.5340195 9,8.2500003 9,11.965981 12.03402,15 15.750001,15 19.46598,15 22.5,11.965979 22.5,8.2500003 22.5,4.5340195 19.46598,1.5 15.750001,1.5 Z m 0,2.0265834 c 2.620732,0 4.723415,2.1026831 4.723415,4.7234169 0,2.6207317 -2.102683,4.7234167 -4.723415,4.7234167 -2.620734,0 -4.723418,-2.102685 -4.723418,-4.7234167 0,-2.6207338 2.102684,-4.7234169 4.723418,-4.7234169 z"
         />
         <path
            className="move-color"
            d="M 19.073029,3.5 11,11.57303 12.426971,13 20.5,4.926971 Z"
         />
      </svg>
   );
}

export function UnpackAllIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <path
            className="this-item"
            d="M 16.535156,1.0996094 12.585938,5.0507812 H 0 V 19.050781 H 12.585938 L 16.535156,23 17.949219,21.585938 13.414062,17.050781 H 2 V 7.0507812 H 13.414062 L 17.949219,2.515625 Z"
         />
         <path
            className="child-item"
            d="M 19.828125 2.84375 L 17 5.671875 L 19.828125 8.5 L 22.65625 5.671875 L 19.828125 2.84375 z M 20 10 L 20 14 L 24 14 L 24 10 L 20 10 z M 19.828125 15.5 L 17 18.328125 L 19.828125 21.15625 L 22.65625 18.328125 L 19.828125 15.5 z "
         />
      </svg>
   );
}

export function DeleteItemIcon2() {
   return (
      <svg viewBox="0 0 24 24">
         <rect className="this-item" width="8" height="8" x="3" y="13" />
         {/* <path
            className="delete-color"
            d="M 19.035534,2.8431458 15.5,6.3786797 11.964466,2.8431458 9.8431458,4.9644661 13.37868,8.5 9.8431458,12.035534 11.964466,14.156854 15.5,10.62132 l 3.535534,3.535534 2.12132,-2.12132 L 17.62132,8.5 21.156854,4.9644661 Z"
         /> */}
         <path
            className="delete-color"
            d="M 18.242641,2.9289322 14,7.1715729 9.7573593,2.9289322 6.9289322,5.7573593 11.171573,10 6.9289322,14.242641 9.7573593,17.071068 14,12.828427 18.242641,17.071068 21.071068,14.242641 16.828427,10 21.071068,5.7573593 Z"
         />
      </svg>
   );
}

export function AddItemIcon() {
   return (
      <svg viewBox="0 0 24 24">
         <rect className="this-item" width="8" height="8" x="3" y="13" />
         {/* <path
            className="add-color"
            d="M 14 2 L 14 7 L 9 7 L 9 10 L 14 10 L 14 15 L 17 15 L 17 10 L 22 10 L 22 7 L 17 7 L 17 2 L 14 2 z "
         /> */}
         <path
            className="add-color"
            d="M 12,2 V 8 H 6 v 4 h 6 v 6 h 4 v -6 h 6 V 8 H 16 V 2 Z"
         />
      </svg>
   );
}

export function DeleteCompartmentIcon() {
   return (
      <svg viewBox="0 0 24 24">
         {/* <path
            className="this-item"
            d="m 2,12 c 0,3.333333 0,6.666667 0,10 H 12 V 12 Z m 2,2 h 6 v 6 H 4 Z"
         /> */}
         <path
            className="parent-item"
            d="m 2,9 c 0,4.333333 0,8.666667 0,13 H 15 V 9 Z m 2,2 h 9 v 9 H 4 Z"
         />
         <path
            className="delete-color"
            d="M 18.242641,2.9289322 14,7.1715729 9.7573593,2.9289322 6.9289322,5.7573593 11.171573,10 6.9289322,14.242641 9.7573593,17.071068 14,12.828427 18.242641,17.071068 21.071068,14.242641 16.828427,10 21.071068,5.7573593 Z"
         />
      </svg>
   );
}

export function AddCompartmentIcon() {
   return (
      <svg viewBox="0 0 24 24">
         {/* <path
            className="this-item"
            d="m 2,12 c 0,3.333333 0,6.666667 0,10 H 12 V 12 Z m 2,2 h 6 v 6 H 4 Z"
         /> */}
         <path
            className="parent-item"
            d="m 2,9 c 0,4.333333 0,8.666667 0,13 H 15 V 9 Z m 2,2 h 9 v 9 H 4 Z"
         />
         <path
            className="add-color"
            d="M 12,2 V 8 H 6 v 4 h 6 v 6 h 4 v -6 h 6 V 8 H 16 V 2 Z"
         />
      </svg>
   );
}
