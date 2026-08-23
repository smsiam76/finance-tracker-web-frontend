import { X, Plus, Minus, Percent, Delete } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

// Calculator Modal Component
export const CalculatorModal = ({ isOpen, onClose, onApply }) => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");

  if (!isOpen) return null;

  const handleNumber = (num) => {
    setDisplay((prev) => (prev === "0" ? num : prev + num));
  };

  const handleOperator = (op) => {
    setEquation(display + " " + op + " ");
    setDisplay("0");
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
  };

  const handleDelete = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const handleCalculate = () => {
    try {
      const fullExpr = equation + display;
      // Basic safe calculation
      const sanitizedExpr = fullExpr.replace(/×/g, "*").replace(/÷/g, "/");
      const result = eval(sanitizedExpr);
      const formattedResult = parseFloat(result.toFixed(2)).toString();
      setDisplay(formattedResult);
      setEquation("");
    } catch {
      setDisplay("Error");
    }
  };

  const handleUseValue = () => {
    onApply(parseFloat(display).toFixed(2));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="bg-base-100 border border-primary/20 rounded-2xl w-full max-w-xs p-4 shadow-2xl text-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm text-primary">Calculator</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-black cursor-pointer hover:text-base-100 hover:bg-primary transition-all duration-300 ease-in-out"
          >
            <X size={18} />
          </button>
        </div>

        {/* Screen Display */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 text-right h-20 flex flex-col justify-end">
          <span className="text-xs h-4">{equation}</span>
          <span className="text-3xl font-semibold tracking-wide text-primary overflow-x-auto">
            {display}
          </span>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2 text-base font-medium">
          <button
            onClick={handleClear}
            className="py-3 rounded-xl bg-red-500 text-base-100 hover:bg-red-900/50 transition border border-red-900/30 active:scale-95"
          >
            C
          </button>
          <button
            onClick={handleDelete}
            className="py-3 rounded-xl bg-primary text-base-100 hover:bg-slate-800 flex items-center justify-center transition active:scale-95"
          >
            <Delete size={18} />
          </button>
          <button
            onClick={() => handleOperator("%")}
            className="py-3 rounded-xl bg-primary text-blue-400 hover:bg-slate-800 flex items-center justify-center transition active:scale-95"
          >
            <Percent size={18} />
          </button>
          <button
            onClick={() => handleOperator("÷")}
            className="py-3 rounded-xl bg-primary text-blue-400 hover:bg-slate-800 transition active:scale-95"
          >
            ÷
          </button>

          {["7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="py-3 rounded-xl bg-primary text-base-100 hover:bg-slate-800 transition active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperator("×")}
            className="py-3 rounded-xl bg-primary text-blue-400 hover:bg-slate-800 transition active:scale-95"
          >
            ×
          </button>

          {["4", "5", "6"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="py-3 rounded-xl bg-primary text-base-100 hover:bg-slate-800 transition active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperator("-")}
            className="py-3 rounded-xl bg-primary text-blue-400 hover:bg-slate-800 flex items-center justify-center transition active:scale-95"
          >
            <Minus size={18} />
          </button>

          {["1", "2", "3"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="py-3 rounded-xl bg-primary text-base-100 hover:bg-slate-800 transition active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperator("+")}
            className="py-3 rounded-xl bg-primary text-blue-400 hover:bg-slate-800 flex items-center justify-center transition active:scale-95"
          >
            <Plus size={18} />
          </button>

          <button
            onClick={() => handleNumber("0")}
            className="py-3 rounded-xl bg-primary text-base-100 hover:bg-slate-800 transition active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => handleNumber(".")}
            className="py-3 rounded-xl bg-primary text-base-100 hover:bg-slate-800 transition active:scale-95"
          >
            .
          </button>

          <button
            onClick={handleCalculate}
            className="py-3 rounded-xl bg-emerald-500 text-slate-800 font-bold hover:bg-emerald-400 transition active:scale-95 flex items-center justify-center"
          >
            =
          </button>

          <button
            onClick={handleUseValue}
            className="py-3 rounded-xl bg-emerald-900/40 text-primary border border-emerald-700/50 hover:bg-emerald-800/40 font-medium transition active:scale-95"
          >
            Use
          </button>
        </div>
      </motion.div>
    </div>
  );
};
