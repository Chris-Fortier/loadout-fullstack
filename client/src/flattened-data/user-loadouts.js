// this bridge table links users to loadouts (many-to-many relationship so users can share the same loadouts)
const userLoadouts = [
   {
      id: "5482d8fc-6e63-4d1d-a6ee-b82344507b52",
      userId: "84fbbb78-b2a2-11ea-b3de-0242ac130004", // Chris
      loadoutId: "42655170-7e10-4431-8d98-c2774f6414a4", // one-night camping trip
      canEdit: true,
      canPack: true,
      isAdmin: true,
   },
   {
      id: "31a80063-0693-4ce2-8a14-e35cfdf91a55",
      userId: "a7f1132e-5f08-48ef-b792-30e27b7b5215", // Tina
      loadoutId: "42655170-7e10-4431-8d98-c2774f6414a4", // one-night camping trip
      canEdit: true,
      canPack: true,
      isAdmin: false,
   },
   {
      id: "b219ee94-c18f-43f8-99c2-05c50ddeabb7",
      userId: "186774df-6dd0-425f-9b86-a1c95cbbdb10", // Mike
      loadoutId: "42655170-7e10-4431-8d98-c2774f6414a4", // one-night camping trip
      canEdit: false,
      canPack: false,
      isAdmin: false,
   },
   {
      id: "691f4b4f-6842-4faf-a8ab-ba60d571f6df",
      userId: "84fbbb78-b2a2-11ea-b3de-0242ac130004", // Chris
      loadoutId: "e0364b00-f7fc-469c-ab82-8de3487bcc0b", // day at punchcode
      canEdit: true,
      canPack: true,
      isAdmin: true,
   },
   {
      id: "6d0834c4-ea69-4142-802d-52bb70351769",
      userId: "186774df-6dd0-425f-9b86-a1c95cbbdb10", // Mike
      loadoutId: "e0364b00-f7fc-469c-ab82-8de3487bcc0b", // day at punchcode
      canEdit: false,
      canPack: false,
      isAdmin: false,
   },
];
