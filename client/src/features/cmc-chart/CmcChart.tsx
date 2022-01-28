import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { CmcData, getCmcData } from "./cmcChartApi";
import "./CmcChart.scss";
import { Button, Form, Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import accounting from "accounting-js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

const ANIMATION_DURATION = 1000;

const toMillions = (n: number) => {
  return n / 10 ** 6;
};

const CmcChart = () => {
  const [cmcData, setCmcdata] = useState([] as CmcData[]);
  const [dateIndex, setDateIndex] = useState(0);
  const [playInterval, setPlayInterval] = useState(undefined as NodeJS.Timeout);

  const getFilteredCmcData = () => {
    const dates = getDates();

    let data: CmcData[] = [];

    if (dates.length === 0) {
      return data;
    }

    let index = dateIndex;
    if (dateIndex >= dates.length) {
      index = dates.length - 1;
    }

    data = cmcData.filter(
      (e) =>
        e.year === dates[index].year && e.month === dates[index].month && e.day === dates[index].day
    );

    return data;
  }

  const getDates = () => {
    let dates = cmcData.map((e) => ({ year: e.year, month: e.month, day: e.day }));
    const dateSet = new Set(dates.map((e) => `${e.year}-${e.month}-${e.day}`));
    dates = Array.from(dateSet).map((e) => ({
      year: parseInt(e.split("-")[0]),
      month: parseInt(e.split("-")[1]),
      day: parseInt(e.split("-")[2])
    }));

    return dates;
  }

  const getCurrentDate = () => {
    const dates = getDates();
  
    if (dates.length === 0) {
      return "";
    }

    let index = dateIndex;
    if (dateIndex >= dates.length) {
      index = dates.length - 1;
    }

    const currentDate = dates[index];
    return dayjs()
      .year(currentDate.year)
      .month(currentDate.month - 1)
      .format("MMMM YYYY");
  };

  // cmc data
  useEffect(() => {
    getCmcData()
      .then((data) => setCmcdata(data))
      .then(() => handlePlayPauseClick());

    return () => {
      if (playInterval) {
        clearInterval(playInterval);
      }
    };
  }, []);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateIndex(parseInt(e.target.value));
  }

  const handlePlayPauseClick = (play = true) => {
    if (playInterval) {
      clearInterval(playInterval);
      setPlayInterval(undefined);
    }

    if (!play) {
      return;
    }

    const run = () => {
      setDateIndex(i => i + 1);
    };

    setTimeout(() => {
      run();
    }, 0);

    // change date every ANIMATION_DURATION
    const interval = setInterval(() => {
      run();
    }, ANIMATION_DURATION);

    setPlayInterval(interval);
  }

  const getOption = () => {
    const filteredCmcData = getFilteredCmcData();

    return {
      xAxis: {
        max: "dataMax",
        type: "log",
        axisLabel: {
          formatter: (d: any) => accounting.formatMoney(toMillions(d)),
        },
      },
      yAxis: {
        type: "category",
        data: filteredCmcData.map((e) => `${e.name} (${e.symbol})`),
        inverse: true,
        animationDuration: ANIMATION_DURATION / 10,
        animationDurationUpdate: ANIMATION_DURATION / 10,
      },
      grid: {
        left: 0,
        containLabel: true
      },
      series: [
        {
          realtimeSort: true,
          name: "Market Cap ($M)",
          type: "bar",
          data: filteredCmcData.map((e) => ({
            value: e.marketCap,
            itemStyle: { color: "#009FFF" }, // TODO: have a different color for every coin
          })),
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
            formatter: (d: any) => accounting.formatMoney(toMillions(d.value)),
          },
        },
      ],
      legend: {
        show: false,
      },
      animationDuration: 0,
      animationDurationUpdate: ANIMATION_DURATION,
      animationEasing: "linear",
      animationEasingUpdate: "linear",
    };
  };

  if (cmcData.length === 0) {
    return (
      <div className="loading-spinner-container">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <ReactECharts
        option={getOption()}
        style={{ height: "600px" }}
      ></ReactECharts>

      <Form.Label>{getCurrentDate()}</Form.Label>
      <Form.Range value={dateIndex} onChange={handleRangeChange} min="0" max={getDates().length - 1} step="1" />
      <Button variant="dark" onClick={() => handlePlayPauseClick(!playInterval)}>{playInterval ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</Button>
    </>
  );
};

export default CmcChart;
