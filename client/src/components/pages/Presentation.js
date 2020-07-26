import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking

export default function StyleTester() {
   return (
      <div className="container-fluid">
         <div className="row my-8">
            <div className="col-12 offset-md-2 col-md-8">
               <h2>Setup</h2>
               <ul>
                  <li>Do this before the presentation</li>
                  <li>Run the MySQL query to reset to the demo state.</li>
                  <li>Open a full screen browser on main monitor.</li>
                  {/* <li>https://loadoutapp.herokuapp.com/</li> */}
                  <li>Run the server and client locally from VSCode.</li>
                  <li>
                     On the landing page, Toggle the sign up page so that
                     background image is loaded.
                  </li>
                  <li>
                     Log in and view the account settings page so the background
                     image is loaded View the console so that we don’t have blue
                     overlays randomly appearing
                  </li>
                  <li>Log out to the landing page.</li>
                  <li>
                     Inpsect, change to console, undock it and move it to second
                     monitor. Make sure this window is visible.
                  </li>
                  <li>
                     Set the view mode to iPhone 6/7/8 layout and make it
                     vertical
                  </li>
               </ul>
               <h2>Presentation Notes</h2>
               <ul>
                  <li>
                     <span className="presentation-action">
                        Share camera and audio. Then talk to the camera.
                     </span>
                  </li>
                  <div className="offset-2 col-8">
                     <li>I’m Chris Fortier.</li>
                     <li>
                        My background includes working on video games as an
                        artist making character models and textures.
                        <br />I have also done ad layouts, photography and video
                        editing.
                     </li>
                     <li>
                        In my spare time I enjoy writing programs to do specific
                        tasks.
                     </li>
                     <li>
                        I have spent the last four months learning fullstack web
                        development at PunchCode and on my own time.
                     </li>
                     <li>
                        What I found interesting was that most of the tools,
                        software and libraries required to make a fullstack
                        application are totally free.
                     </li>
                  </div>
                  <li>
                     <span className="presentation-action">
                        Stop looking at camera. Share desktop with the Landing
                        Page visible.
                     </span>
                  </li>
                  <ul>
                     <li>My capstone project is an app called Loadout.</li>
                     <li>
                        One thing that I always find frustrating is packing for
                        a trip. I have never found a good solution for using a
                        packing list. Say I want to go on a camping trip. I
                        often print out several pages and check things off as I
                        pack, but this tends to be cumbersome because my packing
                        lists tend to be long and very nested, containing lists
                        inside of lists.
                     </li>
                     <li>
                        So here is Loadout, where you can create, share and
                        reuse packing lists.
                     </li>
                     <li>
                        From here, you can log in or sign up to make a new
                        account{" "}
                        <span className="presentation-action">
                           show the sign up page, then go back to log in
                        </span>
                     </li>
                  </ul>
                  <li>
                     <span className="presentation-action">
                        Log on using chris.
                     </span>
                  </li>
                  <ul>
                     <li>
                        When you log in you will a see a list of all your
                        loadouts, as well as loadouts that other users have
                        shared with you.{" "}
                        <span className="presentation-action">
                           Scroll the list on My Loadouts.
                        </span>
                     </li>
                  </ul>
                  <li>
                     <span className="presentation-action">
                        Click One-Night Camping Trip.
                     </span>
                  </li>
                  <ul>
                     <li>
                        Here is my loadout for a one-night camping trip.{" "}
                        <span className="presentation-action">
                           Scroll the loadout.
                        </span>
                     </li>
                     <li>
                        This app is responsive. When you turn your phone
                        sideways, you will see two columns of items&nbsp;
                        <span className="presentation-action">demonstrate</span>
                        .
                     </li>
                     <li>
                        You can also use your computer.{" "}
                        <span className="presentation-action">
                           Change to computer mode.
                        </span>
                     </li>
                     <li>
                        <span className="presentation-action">
                           Move the cursor over the items.
                        </span>{" "}
                        These cards are React components, each one representing
                        an item in this loadout.
                     </li>
                     <li>
                        To pack an item, click its icon to toggle it.{" "}
                        <span className="presentation-action">
                           Pack everything you can on this page.
                        </span>
                     </li>
                     <li>
                        This is a full stack application. Any changes you make
                        will send API calls to Express routes on the server,
                        which then send data to a Sequel database hosted by
                        Amazon RDS. If my friend was looking at this loadout,
                        they would see me packing these items.
                     </li>
                     <li>
                        You will notice that some items cannot be packed{" "}
                        <span className="presentation-action">
                           hover over the Day Pack and Camera Bag pack icons
                        </span>
                        . This is because they contain sub items that need to be
                        packed first.{" "}
                        <span className="presentation-action">
                           Hover over the subitem indicators.
                        </span>{" "}
                        You cannot pack an item until you have packed everything
                        inside of it.
                     </li>
                  </ul>
                  <li>
                     <span className="presentation-action">
                        Open the Day Pack.
                     </span>
                  </li>
                  <ul>
                     <li>
                        When you open the Day Pack you can see the four items
                        that need to be packed.{" "}
                        <span className="presentation-action">
                           Pack the three that you can, then hover over the
                           First Aid kit packed indicator.
                        </span>
                     </li>
                     <li>
                        You cannot pack the first aid kit because it also
                        contains unpacked subitems.
                     </li>
                     <li>
                        <span className="presentation-action">
                           Open the First Aid Kit.
                        </span>
                     </li>
                     <ul>
                        <li>
                           You can create a loadout that is several levels deep.
                        </li>
                        <li>
                           <span className="presentation-action">
                              Pack the two items, then go back to Day Pack.
                           </span>
                        </li>
                     </ul>
                     <li>
                        Now the first aid kit is ready to be packed{" "}
                        <span className="presentation-action">pack it</span>.
                     </li>
                  </ul>
                  <li>
                     <span className="presentation-action">
                        Go up to One-Night Camping Trip.
                     </span>
                  </li>
                  <ul>
                     <li>
                        Now you can finally pack the Day Pack{" "}
                        <span className="presentation-action">pack it</span>.
                     </li>
                     <li>
                        Lets say you want to go on another camping trip. You can
                        reset the loadout, unpacking every item and subitem, by
                        clicking here.{" "}
                        <span className="presentation-action">
                           Reveal the unpack all button but do not click it.
                        </span>
                     </li>
                  </ul>
                  <li>
                     If you click here you will enter Edit Mode{" "}
                     <span className="presentation-action">do it</span>.
                  </li>
                  <ul>
                     <li>
                        In Edit Mode, you can add items and subitems{" "}
                        <span className="presentation-action">
                           click to add an item.
                        </span>
                        ,
                     </li>
                     <li>
                        name or rename them{" "}
                        <span className="presentation-action">
                           name it “snacks for the road”
                        </span>
                        ,
                     </li>
                     <li>
                        and delete items{" "}
                        <span className="presentation-action">
                           delete the item you just made
                        </span>
                        .
                     </li>
                     <li>
                        If you try to delete something that contains subitems{" "}
                        <span className="presentation-action">
                           click the X next to Cooler
                        </span>
                        , it will give you a warning saying how many subitems
                        would also get deleted{" "}
                        <span className="presentation-action">
                           click Cancel
                        </span>
                        .
                     </li>
                  </ul>
                  <li>
                     <span className="presentation-action">
                        Click Loadout Settings.
                     </span>
                  </li>
                  <ul>
                     <li>
                        On this page you can share your loadout with other
                        users.
                     </li>
                     <li>
                        Once you enter an existing username{" "}
                        <span className="presentation-action">add "sean"</span>,
                        you can assign them different permissions, depending on
                        what you want them to be able to do, such as being able
                        to pack and unpack; edit the loadout; or have admin
                        permissions. You can also remove a user.&nbsp;
                        <span className="presentation-action">
                           Uncheck the first two, save changes, then click the
                           remove button to remove the new user.
                        </span>
                     </li>
                  </ul>
                  <li>
                     <span className="presentation-action">
                        Click the upper right menu and go to Account Settings.
                     </span>
                  </li>
                  <ul>
                     <li>
                        In account settings, you can change your username,
                        password or delete your account.{" "}
                        <span className="presentation-action">
                           Click to show each of the submenus.
                        </span>
                     </li>
                  </ul>
                  <li>
                     <span className="presentation-action">
                        Click to log out
                     </span>
                  </li>
                  <ul>
                     <div className="offset-2 col-8">
                        <li>And that is Loadout</li>
                        <li>
                           Some of the features I plan to add are the ability to
                           rearrange and move items via drag and drop, copy
                           parts of a loadout to another loadout, and add a dark
                           mode.
                        </li>
                        <li>
                           I think what I enjoyed most with this project was
                           learning how to send data through the server to the
                           database. It was very difficult to do a simple query
                           at first as it requires many parts that have to work
                           together. But once I got that figured out it was fun
                           repeating that process in different ways and start to
                           see all the functionality of my app come together.
                        </li>
                        <li>
                           <span className="presentation-action">
                              Optional: Stop sharing screen
                           </span>
                        </li>
                        <li>
                           I’m going to continue working on Loadout and other
                           projects, and am also seeking full-stack developer
                           opportunities. My information will be posted in the
                           Zoom chat.
                        </li>
                     </div>
                     {/* <li>Thank you for your time.</li> */}
                     <li className="presentation-action">
                        Stop sharing VIDEO and AUDIO.
                     </li>
                  </ul>
               </ul>
            </div>
         </div>
      </div>
   );
}
