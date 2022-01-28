import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import ReactECharts from "echarts-for-react";
import { Button } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom";

const getTest = async () => {
  const res = await fetch("/test");
  return await res.text();
};

function App() {
  useEffect(() => {
    getTest().then((text) => console.log(text));
  }, []);

  const option = {
    xAxis: {
      data: ["2017-10-24", "2017-10-25", "2017-10-26", "2017-10-27"],
    },
    yAxis: {},
    series: [
      {
        type: "candlestick",
        data: [
          [20, 34, 10, 38],
          [40, 35, 30, 50],
          [31, 38, 33, 44],
          [38, 15, 5, 42],
        ],
      },
    ],
  };

  return (
    <div className="main-container">
      <ReactECharts
        option={option}
        style={{ height: "500px", width: "500px" }}
      ></ReactECharts>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}

const Home = () => {
  return (
    <>
      <div>Home</div>
      <Button as={Link as any} to="/about">
        Go to About
      </Button>
    </>
  );
};

const About = () => {
  return (
    <>
      <div>About</div>
      <Button as={Link as any} to="/">
        Go to Home
      </Button>
    </>
  );
};

export default App;
