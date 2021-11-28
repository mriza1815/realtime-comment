import React from "react";
import { makeLogout } from "../redux/auth/action";
import { connect } from "react-redux";

const Logout = ({ makeLogout, user }) => {
  return (
    <div className="logout-btn mb-1">
      <div className="display-name mr-05">
        <span>{`Hello ${user.displayName}`}</span>
      </div>
      <a
        className="btn btn-sm btn-default btn-hover-success"
        onClick={makeLogout}
      >
        <i className="fa fa-sign-out" />
        <span className="ml-05">Logout</span>
      </a>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  makeLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
