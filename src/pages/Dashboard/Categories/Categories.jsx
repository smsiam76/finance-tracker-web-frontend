import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Utensils,
  Bus,
  ShoppingBag,
  Pill,
  Film,
  GraduationCap,
  Lightbulb,
  Home,
  Plane,
  Banknote,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Laptop,
  Building,
  TrendingUp,
  Gift,
  Briefcase,
  Coffee,
  Gamepad2,
  Smartphone,
  Wrench,
  Music,
  Dumbbell,
  Waves,
  Layers,
} from "lucide-react";

import { motion } from "framer-motion";

const AVAILABLE_ICONS = [
  { id: "money-bag", icon: Banknote },
  { id: "cash", icon: Banknote },
  { id: "shopping", icon: ShoppingBag },
  { id: "food", icon: Utensils },
  { id: "transport", icon: Bus },
  { id: "health", icon: Pill },
  { id: "film", icon: Film },
  { id: "education", icon: GraduationCap },
  { id: "utilities", icon: Lightbulb },
  { id: "rent", icon: Home },
  { id: "travel", icon: Plane },
  { id: "laptop", icon: Laptop },
  { id: "building", icon: Building },
  { id: "chart", icon: TrendingUp },
  { id: "gift", icon: Gift },
  { id: "work", icon: Briefcase },
  { id: "coffee", icon: Coffee },
  { id: "game", icon: Gamepad2 },
  { id: "phone", icon: Smartphone },
  { id: "tools", icon: Wrench },
  { id: "layers", icon: Layers },
  { id: "music", icon: Music },
  { id: "fitness", icon: Dumbbell },
  { id: "water", icon: Waves },
];

const AVAILABLE_COLORS = [
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

export const Categories = () => {
  const [activeTab, setActiveTab] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: "food",
      name: "Food & Dining",
      type: "Out",
      icon: Utensils,
      color: "#f59e0b",
    },
    {
      id: "transport",
      name: "Transport",
      type: "Out",
      icon: Bus,
      color: "#3b82f6",
    },
    {
      id: "shopping",
      name: "Shopping",
      type: "Out",
      icon: ShoppingBag,
      color: "#a855f7",
    },
    {
      id: "education",
      name: "Education",
      type: "Out",
      icon: GraduationCap,
      color: "#06b6d4",
    },
    {
      id: "travel",
      name: "Travel & Tour",
      type: "Out",
      icon: Plane,
      color: "#38bdf8",
    },
    // কিছু ডিফল্ট Income ক্যাটাগরি যোগ করা হলো
    {
      id: "salary",
      name: "Salary",
      type: "In",
      icon: Briefcase,
      color: "#22c55e",
    },
    {
      id: "freelance",
      name: "Freelance",
      type: "In",
      icon: Laptop,
      color: "#10b981",
    },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "expense",
      name: "",
      iconIndex: 1,
      color: "#22c55e",
    },
  });

  const modalType = watch("type");
  const selectedIconIndex = watch("iconIndex");
  const selectedColor = watch("color");

  // এক্টিভ ট্যাব অনুযায়ী ক্যাটাগরি ফিল্টার করা
  const filteredCategories = categories.filter((item) => {
    if (activeTab === "expense") return item.type === "Out";
    if (activeTab === "income") return item.type === "In";
    return true;
  });

  const onAddCategory = (data) => {
    const newCategory = {
      id: Date.now().toString(),
      name: data.name,
      type: data.type === "expense" ? "Out" : "In",
      icon: AVAILABLE_ICONS[data.iconIndex].icon,
      color: data.color,
    };

    setCategories((prev) => [...prev, newCategory]);
    
    // নতুন ক্যাটাগরি যোগ করার পর ট্যাব অটোমেটিক সুইচ করার জন্য (Optional)
    setActiveTab(data.type);
    
    reset();
    document.getElementById("new_category_modal").close();
  };

  // মোডাল ওপেন করার সময় বর্তমান activeTab অনুযায়ী type সেট করা
  const handleOpenModal = () => {
    setValue("type", activeTab);
    document.getElementById("new_category_modal").showModal();
  };

  return (
    <div className="pt-6 pb-12">
      {/* Top Filter Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.1 }}
        className="flex p-1.5 rounded-xl mb-6 border border-primary/20 w-1/2 mx-auto bg-white"
      >
        <button
          onClick={() => setActiveTab("expense")}
          className={`flex-1 cursor-pointer py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === "expense"
              ? "bg-red-400 text-white border border-base-100 shadow-md"
              : "text-base hover:text-red-400"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          Expense
        </button>
        <button
          onClick={() => setActiveTab("income")}
          className={`flex-1 cursor-pointer py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === "income"
              ? "bg-primary text-white border border-base-100 shadow-md"
              : "text-base hover:text-primary"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Income
        </button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.18, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.1 }}
        className="w-full pt-6 pb-12 px-10 bg-white rounded-2xl shadow-2xl"
      >
        {/* Grid Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
          {/* ফিল্টার করা ক্যাটাগরিগুলো এখানে রেন্ডার হচ্ছে */}
          {filteredCategories.map((item) => {
            const IconComponent = item.icon;
            const isSelected = selectedCategory === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-primary text-white border-emerald-500 ring-1 ring-emerald-500"
                    : "bg-base-100 border-base-100 hover:border-primary/10 hover:bg-primary hover:text-white"
                }`}
              >
                <div
                  className="p-2.5 rounded-xl shrink-0"
                  style={{
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-0.5">
                    {item.type}
                    {item.type === "Out" ? (
                      <ArrowUpRight className="w-3 h-3 text-red-400" />
                    ) : (
                      <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                    )}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Trigger Button */}
          <button
            onClick={handleOpenModal}
            className="flex items-center cursor-pointer gap-3.5 p-3.5 rounded-xl border border-dashed border-priamry/20 bg-base-100 hover:bg-primary transition-all text-left text-emerald-700 hover:text-white group"
          >
            <div className="p-2.5 rounded-xl bg-base-100 border group-hover:border-emerald-500/50">
              <Plus className="w-5 h-5 text-primary group-hover:text-primary" />
            </div>
            <span className="font-medium text-sm">Add custom</span>
          </button>
        </div>

        {/* Styled DaisyUI Modal */}
        <dialog
          id="new_category_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box bg-white border border-primary/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-5">
              <h3 className="text-lg font-bold">New Category</h3>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("new_category_modal").close()
                }
                className=" hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 " />
              </button>
            </div>

            <form onSubmit={handleSubmit(onAddCategory)} className="space-y-5">
              {/* Modal Type Selector Tabs */}
              <div className="flex bg-base-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setValue("type", "expense")}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    modalType === "expense"
                      ? "bg-red-400 text-white border border-red-900/40 shadow-sm"
                      : "text-red-400 hover:text-text-red-500"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setValue("type", "income")}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    modalType === "income"
                      ? "bg-primary text-white border border-emerald-900/40 shadow-sm"
                      : "text-primary hover:text-primary"
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Category Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Category name *"
                  {...register("name", {
                    required: "Category name is required",
                  })}
                  className={`w-full bg-base-100 border border-base-100 t px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <span className="text-xs text-red-400 mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Icon Picker Grid */}
              <div>
                <label className="block text-xs font-medium mb-3">Icon</label>
                <div className="grid grid-cols-7 gap-2.5">
                  {AVAILABLE_ICONS.map((item, index) => {
                    const IconComp = item.icon;
                    const isSelected = selectedIconIndex === index;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setValue("iconIndex", index)}
                        className={`h-10 w-10 cursor-pointer rounded-xl flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-primary border-2 border-primary/10 text-emerald-400"
                            : "bg-base-100 border border-primary/5 hover:bg-primary"
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Picker Section */}
              <div>
                <label className="block text-xs font-medium mb-3">Color</label>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_COLORS.map((color, index) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setValue("color", color)}
                        className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                          isSelected
                            ? "ring-2 ring-emerald-500 ring-offset-1 ring-offset-primary"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-semibold hover:text-primary cursor-pointer transition-colors duration-300"
                  onClick={() => {
                    reset();
                    document.getElementById("new_category_modal").close();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-emerald-700 text-white cursor-pointer font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-emerald-950/20"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>

          <form
            method="dialog"
            className="modal-backdrop cursor-pointer hover:text-black"
          >
            <button>close</button>
          </form>
        </dialog>
      </motion.div>
    </div>
  );
};