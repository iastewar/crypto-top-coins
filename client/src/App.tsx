import "./App.scss";
import CmcChart from "./features/cmc-chart/CmcChart";

const App = () => {
  return (
    <div className="main-container">
      <h1>Top Coins Over Time ($M)</h1>
      <CmcChart />
    </div>
  );
};

export default App;
