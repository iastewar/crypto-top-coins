import { Spinner } from "react-bootstrap";
import "./LoadingSpinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
