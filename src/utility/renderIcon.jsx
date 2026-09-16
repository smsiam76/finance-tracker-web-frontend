// src/utils/renderIcon.jsx
import {
  IoWalletOutline,
  IoCardOutline,
  IoAirplaneOutline,
  IoHomeOutline,
  IoBagHandleOutline,
} from "react-icons/io5";
import { FaPiggyBank } from "react-icons/fa";
import { FiPieChart } from "react-icons/fi";

export const renderIcon = (iconName, color = "#006A4E", className = "w-6 h-6") => {
  const iconStyle = { color: color };

  switch (iconName?.toLowerCase()) {
    case "wallet":
      return <IoWalletOutline className={className} style={iconStyle} />;
    case "card":
      return <IoCardOutline className={className} style={iconStyle} />;
    case "piggy":
      return <FaPiggyBank className={className} style={iconStyle} />;
    case "plane":
      return <IoAirplaneOutline className={className} style={iconStyle} />;
    case "home":
      return <IoHomeOutline className={className} style={iconStyle} />;
    case "bag":
      return <IoBagHandleOutline className={className} style={iconStyle} />;
    default:
      return <FiPieChart className={className} style={iconStyle} />;
  }
};