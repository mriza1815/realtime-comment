import React from "react";
import { Spinner } from "@chakra-ui/react";

const LoadingContainer = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner size="lg" />
      </div>
    );
  } else {
    return children;
  }
};

export default LoadingContainer;
