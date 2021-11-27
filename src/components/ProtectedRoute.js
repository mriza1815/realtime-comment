import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import Home from "../pages/Home";

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  return <Route {...rest} element={<Component />} />;
};

ProtectedRoute.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (store) => ({
  isAdmin: store.auth.user.isAdmin || false,
});

export default connect(mapStateToProps)(ProtectedRoute);
