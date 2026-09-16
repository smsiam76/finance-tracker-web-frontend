// src/utils/renderIcon.jsx
import { Utensils } from "lucide-react";
import {

  IoBusOutline,
  IoBagHandleOutline,
  IoMedkitOutline,
  IoFilmOutline,
  IoSchoolOutline,
  IoBulbOutline,
  IoHomeOutline,
  IoAirplaneOutline,
  IoCashOutline,
  IoLaptopOutline,
  IoBusinessOutline,
  IoTrendingUpOutline,
  IoGiftOutline,
  IoBriefcaseOutline,
  IoCafeOutline,
  IoGameControllerOutline,
  IoPhonePortraitOutline,
  IoConstructOutline,
  IoMusicalNotesOutline,
  IoFitnessOutline,
  IoPieChartOutline,
} from "react-icons/io5";

// Icons List mapping for Category Modal Select Grid
export const AVAILABLE_ICONS = [
  { name: "banknote" },
  { name: "shopping-bag" },
  { name: "utensils" },
  { name: "bus" },
  { name: "pill" },
  { name: "film" },
  { name: "graduation-cap" },
  { name: "lightbulb" },
  { name: "home" },
  { name: "plane" },
  { name: "laptop" },
  { name: "building" },
  { name: "trending-up" },
  { name: "gift" },
  { name: "briefcase" },
  { name: "coffee" },
  { name: "gamepad" },
  { name: "smartphone" },
  { name: "wrench" },
  { name: "music" },
  { name: "dumbbell" },
];

export const AVAILABLE_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#64748b",
  "#f97316",
  "#10b981",
  "#8b5cf6",
];

export const renderCategoryIcon = (
  iconName,
  color = "#22c55e",
  className = "w-5 h-5"
) => {
  const iconStyle = { color };

  switch (iconName?.toLowerCase()) {
    case "utensils":
      return <Utensils className={className} style={iconStyle} />;
    case "bus":
      return <IoBusOutline className={className} style={iconStyle} />;
    case "shopping-bag":
    case "bag":
      return <IoBagHandleOutline className={className} style={iconStyle} />;
    case "pill":
      return <IoMedkitOutline className={className} style={iconStyle} />;
    case "film":
      return <IoFilmOutline className={className} style={iconStyle} />;
    case "graduation-cap":
      return <IoSchoolOutline className={className} style={iconStyle} />;
    case "lightbulb":
      return <IoBulbOutline className={className} style={iconStyle} />;
    case "home":
      return <IoHomeOutline className={className} style={iconStyle} />;
    case "plane":
      return <IoAirplaneOutline className={className} style={iconStyle} />;
    case "banknote":
    case "cash":
      return <IoCashOutline className={className} style={iconStyle} />;
    case "laptop":
      return <IoLaptopOutline className={className} style={iconStyle} />;
    case "building":
      return <IoBusinessOutline className={className} style={iconStyle} />;
    case "trending-up":
      return <IoTrendingUpOutline className={className} style={iconStyle} />;
    case "gift":
      return <IoGiftOutline className={className} style={iconStyle} />;
    case "briefcase":
      return <IoBriefcaseOutline className={className} style={iconStyle} />;
    case "coffee":
      return <IoCafeOutline className={className} style={iconStyle} />;
    case "gamepad":
    case "gamepad-2":
      return <IoGameControllerOutline className={className} style={iconStyle} />;
    case "smartphone":
      return <IoPhonePortraitOutline className={className} style={iconStyle} />;
    case "wrench":
      return <IoConstructOutline className={className} style={iconStyle} />;
    case "music":
      return <IoMusicalNotesOutline className={className} style={iconStyle} />;
    case "dumbbell":
      return <IoFitnessOutline className={className} style={iconStyle} />;
    default:
      return <IoPieChartOutline className={className} style={iconStyle} />;
  }
};