import { Container } from "react-bootstrap";
import "./App.scss";
import CmcChartContainer from "./features/cmc-chart-container/CmcChartContainer";

const App = () => {
  return (
    <Container className="main-container">
      <h3>Top Coins Over Time</h3>
      <h6>Market Cap ($M)</h6>
      <CmcChartContainer />
    </Container>
  );
};

export default App;
