# Loadout

## Local Installation

-  Run these commands after cloning the project:
   -  In the project folder:
      -  `npm i cors`
      -  `npm install jsonwebtoken`
      -  ...
   -  In \client:
      -  `npm i date-fns` (or can this be installed in root?)
      -  `npm i jwt-decode`
      -  ...
-  Install .env file

## Running the App Locally

-  Both of these command are done from the project folder:
   -  `npm run server` runs the server
   -  `npm run client` runs the client

## Delpoyment

### Push latest git commit to Heroku

`git push heroku master`

## Sharing A Loadout

-  The creator of a loadout is given full permissions to the loadouts they create.
-  Anyone a loadout is shared with can remove themselves from the loadout, unless they are an admin (this is to ensure there is always at least one admin to every loadout).
-  Anyone assigned “can pack” permissions can
   -  pack and
   -  pack items in the loadout.
-  Anyone assigned “can edit” permissions can
   -  add,
   -  delete and
   -  rename items within the loadout and
   -  rename the loadout itself.
-  Anyone assigned “is admin” permissions can
   -  share the loadout with others,
   -  assign or remove permissions to others,
   -  and delete the loadout.
   -  Admin cannot remove admin permissions from themselves, but can assign admin permissions to another user who can them remove the admin permission from the original user.
   -  Admin cannot remove themselves from the loadout unless they give ownership of the loadout to someone else via the method indicated above. (There must always be at least one admin for a loadout.)
