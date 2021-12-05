import React, { useState } from "react";
import { connect } from "react-redux";
import { makeLogin, makeLogout } from "../redux/auth/action";
import FirebaseLibrary from "../library/firebase";
import FormModal from "./Modal";
import Login from "./Login";
import Logout from "./Logout";
import {
  loginErrorMsg,
  prepareUserData,
  loginSuccessMsg,
  prepareUserDataWithEmail,
  registerSuccessMsg,
  blockedMsg,
} from "../library/constants";
import { useToasts } from "react-toast-notifications";

const Auth = ({ user, makeLogin }) => {
  const [modal, setModal] = useState(false);

  const {
    googlePr,
    facebookPr,
    makeSocialLogin,
    saveUser,
    checkUserIsBlock,
    makeEmailLogin,
  } = FirebaseLibrary();

  const { addToast } = useToasts();

  const showBlockUserWarn = () => {
    addToast(blockedMsg, { appearance: "error" });
  };

  const socialAuth = (provider) => {
    makeSocialLogin(provider)
      .then((result) => {
        checkUserIsBlock(result.user.uid)
          .then(() => {
            const mapUserData = prepareUserData(result);
            makeLogin(mapUserData);
            saveUser(mapUserData);
            addToast(loginSuccessMsg, { appearance: "success" });
          })
          .catch(showBlockUserWarn);
      })
      .catch((e) => {
        console.log("socialAuth error", e);
        addToast(e.code || e.message || loginErrorMsg, { appearance: "error" });
      });
  };

  const emailAuth = (alreadyMember, name, email, password) => {
    setModal(false);
    makeEmailLogin(alreadyMember, email, password, name)
      .then((res) => {
        checkUserIsBlock(res.uid)
          .then(() => {
            const mapUserData = prepareUserDataWithEmail(res, name);
            makeLogin(mapUserData);
            saveUser(mapUserData);
            addToast(alreadyMember ? loginErrorMsg : registerSuccessMsg, {
              appearance: "success",
            });
          })
          .catch(showBlockUserWarn);
      })
      .catch((e) => {
        console.log("catch", e.message);
        addToast(e.message || loginErrorMsg, { appearance: "error" });
      });
  };

  return (
    <>
      <FormModal
        show={modal}
        onSave={emailAuth}
        handleClose={() => setModal(false)}
      />
      {!user ? (
        <>
          <Login
            googleLogin={() => socialAuth(googlePr)}
            userData={{}}
            facebookLogin={() => socialAuth(facebookPr)}
            emailLogin={() => setModal(true)}
          />
        </>
      ) : (
        <Logout />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  isAdmin: state.auth.user?.isAdmin || false,
});

const mapDispatchToProps = {
  makeLogin,
  makeLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
