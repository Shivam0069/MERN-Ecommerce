"use client";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Stopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    setIsRunning(true);
    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 10);
    }, 10);
    setIntervalId(id);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
    }
    setElapsedTime(0);
  };

  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const milliseconds = elapsedTime % 1000;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="flex flex-col items-center justify-center  gap-8 h-[calc(100vh-73px)]">
        <div className=" text-lg sm:text-xl md:text-3xl lg:text-6xl xl:text-8xl font-bold xl:w-[680px]">
          {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}.
          {milliseconds.toString().padStart(3, "0")}
        </div>
        <div className="flex gap-4">
          <Button onClick={isRunning ? handleStop : handleStart}>
            {isRunning ? "Stop" : "Start"}
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;
