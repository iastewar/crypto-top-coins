import { useEffect, useState } from "react";
import { CmcData, getCmcData } from "./cmcChartContainerApi";
import "./CmcChartContainer.scss";
import CmcChart from "./cmc-chart/CmcChart";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

const CmcChartContainer = () => {
  const [cmcData, setCmcdata] = useState([] as CmcData[]);

  useEffect(() => {
    getCmcData().then((data) => setCmcdata(data));
  }, []);

  return (
    <div className="cmc-chart-container">
      {cmcData.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <CmcChart
          cmcData={cmcData}
          eChartStyle={{ height: "70vh", minHeight: "400px" }}
        />
      )}
    </div>
  );
};

export default CmcChartContainer;
