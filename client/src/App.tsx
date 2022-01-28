import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.scss";
import { Button } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom";
import CmcChart from "./features/cmc-chart/CmcChart";

const App = () => {
  return (
    <div className="main-container">
      <CmcChart />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
};

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
