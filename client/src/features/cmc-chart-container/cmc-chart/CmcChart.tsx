import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { CmcData } from "../cmcChartContainerApi";
import {
  ANIMATION_DURATION,
  getCurrentDate,
  getDates,
  getOption,
} from "./cmcChartUtils";

const CmcChart = ({
  cmcData,
  eChartStyle,
}: {
  cmcData: CmcData[];
  eChartStyle: React.CSSProperties;
}) => {
  const [dateIndex, setDateIndex] = useState(0);
  const [playInterval, setPlayInterval] = useState(undefined as NodeJS.Timeout);

  useEffect(() => {
    handlePlayPauseClick();

    return () => {
      if (playInterval) {
        clearInterval(playInterval);
      }
    };
  }, []);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateIndex(parseInt(e.target.value));
  };

  const handlePlayPauseClick = (play = true) => {
    if (playInterval) {
      clearInterval(playInterval);
      setPlayInterval(undefined);
    }

    if (!play) {
      return;
    }

    const run = () => {
      setDateIndex((i) => i + 1);
    };

    setTimeout(() => {
      run();
    }, 0);

    // change date every ANIMATION_DURATION
    const interval = setInterval(() => {
      run();
    }, ANIMATION_DURATION);

    setPlayInterval(interval);
  };

  return (
    <>
      <ReactECharts
        option={getOption(cmcData, dateIndex)}
        style={eChartStyle}
      ></ReactECharts>

      <Form.Label>{getCurrentDate(cmcData, dateIndex)}</Form.Label>
      <Form.Range
        value={dateIndex}
        onChange={handleRangeChange}
        min="0"
        max={getDates(cmcData).length - 1}
        step="1"
      />
      <Button
        variant="light"
        onClick={() => handlePlayPauseClick(!playInterval)}
      >
        {playInterval ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </Button>
    </>
  );
};

export default CmcChart;
