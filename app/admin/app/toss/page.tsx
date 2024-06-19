"use client";
import { useState } from "react";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import headsImg from "@/assets/images/heads.png";
import tailsImg from "@/assets/images/tails.png";

const Toss = () => {
  const [angle, setAngle] = useState<number>(0);
  const [isHeads, setIsHeads] = useState<boolean>(true);

  const flipCoin = () => {
    const newIsHeads = Math.random() > 0.5;
    setIsHeads(newIsHeads);
    if (newIsHeads) {
      setAngle((prev) => prev + 720);
    } else {
      setAngle((prev) => prev + 180 + 360);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Toss</h1>
        <section>
          <img
            src={`${isHeads ? headsImg.src : tailsImg.src}`}
            className="cursor-pointer transform-none transition-all duration-500 w-60 h-60"
            onClick={flipCoin}
            style={{
              transform: `rotateY(${angle}deg)`,
            }}
          ></img>
        </section>
      </main>
    </div>
  );
};

export default Toss;
