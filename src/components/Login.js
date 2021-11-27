import React from "react";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  createButton,
} from "react-social-login-buttons";
import {
  socialEmailButtonConfig,
  facebookLoginEnabled,
} from "../library/constants";

const EmailSocialButton = createButton(socialEmailButtonConfig);

const Login = (props) => {
  const { facebookLogin, googleLogin, emailLogin } = props;

  return (
    <div className="panel">
      <div className="panel-body">
        <p> Please login / register to comment:</p>
        <div style={{ display: "flex", width: "50%" }}>
          {" "}
          {facebookLoginEnabled ? (
            <FacebookLoginButton text="Facebook" onClick={facebookLogin} />
          ) : null}
          <GoogleLoginButton text="Google" onClick={googleLogin} />
          <EmailSocialButton onClick={emailLogin} />
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {};

export default Login;
