"use client";
import { useEffect, useState } from "react";
import { AiFillFileText } from "react-icons/ai";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaGamepad,
  FaStopwatch,
} from "react-icons/fa";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoIosPeople } from "react-icons/io";
import {
  RiCoupon3Fill,
  RiDashboardFill,
  RiShoppingBag3Fill,
} from "react-icons/ri";
import Link from "next/link";
import { IconType } from "react-icons";
import "../../app/globals.css";
import { Button } from "../ui/button";

const AdminSidebar = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [phoneActive, setPhoneActive] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth < 1100
  );
  const [currentPath, setCurrentPath] = useState<string>("");

  const resizeHandler = () => {
    setPhoneActive(window.innerWidth < 1100);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
      window.addEventListener("resize", resizeHandler);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", resizeHandler);
      }
    };
  }, []);

  return (
    <>
      {phoneActive && (
        <Button
          className="absolute top-12 z-10 left-2"
          onClick={() => setShowModal(true)}
        >
          <HiMenuAlt4 className="h-5 w-5" />
        </Button>
      )}

      <aside
        style={
          phoneActive
            ? {
                width: "20rem",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: showModal ? "0" : "-20rem",
                transition: "all 0.5s",
              }
            : {}
        }
      >
        <h2>Logo.</h2>
        <DivOne currentPath={currentPath} />
        <DivTwo currentPath={currentPath} />
        <DivThree currentPath={currentPath} />

        {phoneActive && (
          <button id="close-sidebar" onClick={() => setShowModal(false)}>
            Close
          </button>
        )}
      </aside>
    </>
  );
};

const DivOne = ({ currentPath }: { currentPath: string }) => (
  <div>
    <h5>Dashboard</h5>
    <ul>
      <Li
        url="/admin/dashboard"
        text="Dashboard"
        Icon={RiDashboardFill}
        currentPath={currentPath}
      />
      <Li
        url="/admin/product"
        text="Product"
        Icon={RiShoppingBag3Fill}
        currentPath={currentPath}
      />
      <Li
        url="/admin/customer"
        text="Customer"
        Icon={IoIosPeople}
        currentPath={currentPath}
      />
      <Li
        url="/admin/transaction"
        text="Transaction"
        Icon={AiFillFileText}
        currentPath={currentPath}
      />
    </ul>
  </div>
);

const DivTwo = ({ currentPath }: { currentPath: string }) => (
  <div>
    <h5>Charts</h5>
    <ul>
      <Li
        url="/admin/chart/bar"
        text="Bar"
        Icon={FaChartBar}
        currentPath={currentPath}
      />
      <Li
        url="/admin/chart/pie"
        text="Pie"
        Icon={FaChartPie}
        currentPath={currentPath}
      />
      <Li
        url="/admin/chart/line"
        text="Line"
        Icon={FaChartLine}
        currentPath={currentPath}
      />
    </ul>
  </div>
);

const DivThree = ({ currentPath }: { currentPath: string }) => (
  <div>
    <h5>Apps</h5>
    <ul>
      <Li
        url="/admin/app/stopwatch"
        text="Stopwatch"
        Icon={FaStopwatch}
        currentPath={currentPath}
      />
      <Li
        url="/admin/app/coupon"
        text="Coupon"
        Icon={RiCoupon3Fill}
        currentPath={currentPath}
      />
      <Li
        url="/admin/app/toss"
        text="Toss"
        Icon={FaGamepad}
        currentPath={currentPath}
      />
    </ul>
  </div>
);

interface LiProps {
  url: string;
  text: string;
  currentPath: string;
  Icon: IconType;
}
const Li = ({ url, text, currentPath, Icon }: LiProps) => (
  <li
    style={{
      backgroundColor: currentPath.includes(url)
        ? "rgba(0,115,255,0.1)"
        : "white",
    }}
  >
    <Link
      href={url}
      style={{
        color: currentPath.includes(url) ? "rgb(0,115,255)" : "black",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Icon />
      <span style={{ marginLeft: "0.5rem" }}>{text}</span>
    </Link>
  </li>
);

export default AdminSidebar;
