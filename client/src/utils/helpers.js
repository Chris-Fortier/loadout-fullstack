// file of small application-wide helpers

export const safelyParseJSON = (str) => {
   // this will prevent JSON parse from getting a syntax error and crashing your program
   try {
      JSON.parse(str);
   } catch (e) {
      return str;
   }
   return JSON.parse(str);
};

export const isObject = (value) => {
   // this will check wheter or not this value is an object
   // returns true if the value is an object and is not null and is not an array
   return (
      typeof value === "object" &&
      value !== null &&
      Array.isArray(value) === false
   );
};

export const convertDataType = (str) => {
   // takes a string and interprets it into a different data type

   if (str === "undefined") return undefined;
   return safelyParseJSON(str);

   // one-lining these makes it easier to read in this case
   // if (str === "null") return null;
   // if (str === "undefined") return undefined;
   // if (str.toLowerCase() === "true") return true;
   // if (str.toLowerCase() === "false") return false;
   // // eslint-disable-next-line
   // if (str == Number(str)) return Number(str);
   // const parsedJSON = safelyParseJSON(str);
   // if (Array.isArray(parsedJSON)) return parsedJSON;
   // if (isObject(parsedJSON)) return parsedJSON; // I think isObject(str) needs to be isObject(safelyParseJSON(str))
   // return str;
};

export const toKebabCase = (str) => {
   // converts a string to kebab-case
   console.log("str", str);
   const lowerCase = str.toLowerCase();
   console.log("lowerCase", lowerCase);
   const splitArray = lowerCase.split(" ");
   console.log("splitArray", splitArray);
   return splitArray.join("-");
};

export function checkIsOver(num, limit) {
   return num > limit;
}

// eslint-disable-next-line
export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// app master preferences
export const LEVEL_COLORS = 7; // the amount of level colors there are
export const MAX_ITEM_NAME_LENGTH = 30; // the maximum length of characters for an item name
export const MOVE_UPDOWN = false; // whether or not to have up and down buttons in edit mode
export const SUBITEM_DISPLAY_MODE = "numUnpackedChildren"; // subItemDisplayMode can be "packedChildrenOutOfTotalChildren" or "numUnpackedDescendants" or "numUnpackedChildren"
export const UI_APPEARANCE = "colors"; // ui appearance mode, "light", "dark", "colors"
