import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import classnames from "classnames";
import {
   // IconEdit,
   // IconCog,
   // IconAddCircle,
   // IconArrowThickUpCircle,
   // IconArrowThickDownCircle,
   // IconArchive,
   IconArrowThinLeftCircle,
   // IconArrowThinRightCircle,
   // IconTrash,
   // IconChevronDown,
   // IconChevronUp,
   // IconUserCouple,
} from "../../icons/icons.js";

export default function StyleTester() {
   return (
      <>
         <div className="container">
            <div className="row">
               <div className="col">
                  <h1>h1 Title</h1>
                  <div className="card mb-3">
                     <div className="card-body">
                        <h5>h5 Faceplate Title</h5>
                        <form className="mb-0 needs-validation" noValidate>
                           <div className="form-group">
                              <input
                                 id="existing-username-input"
                                 placeholder="Enter Your Username"
                                 required
                                 className={classnames({
                                    "form-control": true,
                                    "is-invalid": false,
                                 })}
                              />
                           </div>
                           <div className="form-group">
                              <input
                                 type="password"
                                 id="existing-password-input"
                                 placeholder="Enter Your Password"
                                 required
                                 className={classnames({
                                    "form-control": true,
                                    "is-invalid": true,
                                 })}
                              />

                              <div className="text-danger" id="password-error">
                                 error message
                              </div>
                           </div>
                           <button
                              className="btn btn-primary btn-block my-3"
                              type="button"
                              onClick={() => this.validateLogInAttempt()}
                           >
                              Log In
                           </button>
                           <div class="btn-group d-flex" role="group">
                              <button
                                 type="button"
                                 className="btn btn-secondary btn-sm"
                                 onClick={() => this.setNewAccountMode()}
                              >
                                 Make a new account
                              </button>
                              <button
                                 type="button"
                                 className="btn btn-secondary btn-sm tab-separator"
                                 onClick={() => this.bypassLogIn()}
                              >
                                 Bypass
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
                  <div>
                     <span
                        className={classnames({
                           "up-level navigation-link": true,
                        })}
                        onClick={(e) => {
                           this.movePageToDifferentItem(
                              this.props.currentLoadout.itemIndexPath.slice(
                                 0,
                                 -1
                              )
                           ); // move to current path with the last part removed to go up a level
                        }}
                     >
                        <div className="icon-dark left">
                           <IconArrowThinLeftCircle />
                        </div>
                        Back to Page
                     </span>
                  </div>
                  <div className="navigation-link">.navigation-link</div>
                  <div className="rollout-button">.rollout-button</div>
                  <div className="primary-action-button">
                     .primary-action-button
                  </div>
                  <div className="form-label">.form-label</div>
               </div>
            </div>
         </div>
      </>
   );
}
