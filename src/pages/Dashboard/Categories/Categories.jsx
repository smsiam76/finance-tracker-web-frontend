import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, ArrowUpRight, ArrowDownLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import useAuth from "../../../hooks/useAuth";
import useCategories from "../../../hooks/useCategories";
import Loader from "../../../component/Shared/Loader/Loader";
import {
  AVAILABLE_COLORS,
  AVAILABLE_ICONS,
  renderCategoryIcon,
} from "../../../utility/renderCategoryIcon";
import { Helmet } from "react-helmet-async";

export const Categories = () => {
  const { user } = useAuth();

  const {
    categories = [],
    isLoading,
    createCategory,
    isCreating,
  } = useCategories(user?.email);

  const [activeTab, setActiveTab] = useState("EXPENSE"); // EXPENSE or INCOME
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "EXPENSE",
      name: "",
      icon: "banknote",
      color: "#22c55e",
    },
  });

  // Safe Array Check & Case Insensitive Filtering
  const safeCategories = Array.isArray(categories) ? categories : [];
  const filteredCategories = safeCategories.filter(
    (item) => item?.type?.toUpperCase() === activeTab.toUpperCase(),
  );

  const onAddCategory = async (data) => {
    try {
      const categoryData = {
        userEmail: user?.email || null,
        bookId: null,
        name: data.name,
        type: data.type,
        color: data.color,
        icon: data.icon,
        isDefault: false,
      };

      const res = await createCategory(categoryData);
      if (res?.insertedId || res?.data?.insertedId) {
        toast.success("Category created successfully!");
        setActiveTab(data.type);
        reset({
          type: data.type,
          name: "",
          icon: "banknote",
          color: "#22c55e",
        });
        document.getElementById("new_category_modal").close();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create category!",
      );
      // console.error("Failed to create category:", error);
    }
  };

  const handleOpenModal = () => {
    reset({
      type: activeTab,
      name: "",
      icon: "banknote",
      color: "#22c55e",
    });
    document.getElementById("new_category_modal").showModal();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="pt-6 pb-12">
      <Helmet>
        <title>Categories | Dashboard | Finance Tracker</title>
      </Helmet>
      {/* Top Filter Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.1 }}
        className="flex p-1.5 rounded-xl mb-6 border border-primary/20 w-full sm:w-1/2 mx-auto bg-white"
      >
        <button
          type="button"
          onClick={() => setActiveTab("EXPENSE")}
          className={`flex-1 cursor-pointer py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === "EXPENSE"
              ? "bg-red-400 text-white border border-base-100 shadow-md"
              : "text-base hover:text-red-400"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          Expense
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("INCOME")}
          className={`flex-1 cursor-pointer py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === "INCOME"
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
        className="w-full pt-6 pb-12 px-6 sm:px-10 bg-white rounded-2xl shadow-2xl"
      >
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((item) => {
              const isSelected = selectedCategory === item._id;

              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedCategory(item._id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary text-white border-emerald-500 ring-1 ring-emerald-500"
                      : "bg-base-100 border-base-100 hover:border-primary/10 hover:bg-primary hover:text-white"
                  }`}
                >
                  <div
                    className="p-2.5 rounded-xl shrink-0"
                    style={{
                      backgroundColor: item.color
                        ? `${item.color}20`
                        : "#22c55e20",
                    }}
                  >
                    {renderCategoryIcon(
                      item.icon,
                      item.color || "#22c55e",
                      "w-5 h-5",
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-sm truncate">
                        {item.name}
                      </span>
                      {item.isDefault && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium shrink-0">
                          Default
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-0.5 mt-0.5">
                      {item.type}
                      {item.type?.toUpperCase() === "EXPENSE" ? (
                        <ArrowUpRight className="w-3 h-3 text-red-400" />
                      ) : (
                        <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-6 text-slate-400 text-sm">
              No categories found for {activeTab.toLowerCase()}.
            </div>
          )}

          {/* Create Button */}
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center cursor-pointer gap-3.5 p-3.5 rounded-xl border border-dashed border-primary/20 bg-base-100 hover:bg-primary transition-all text-left text-emerald-700 hover:text-white group"
          >
            <div className="p-2.5 rounded-xl bg-base-100 border group-hover:border-emerald-500/50">
              <Plus className="w-5 h-5 text-primary group-hover:text-primary" />
            </div>
            <span className="font-medium text-sm">Add custom</span>
          </button>
        </div>

        {/* Form Modal */}
        <dialog
          id="new_category_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box bg-white border border-primary/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <h3 className="text-lg font-bold">New Category</h3>
              <button
                type="button"
                onClick={() => {
                  reset();
                  document.getElementById("new_category_modal").close();
                }}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onAddCategory)} className="space-y-5">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <div className="flex bg-base-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => field.onChange("EXPENSE")}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        field.value === "EXPENSE"
                          ? "bg-red-400 text-white border border-red-900/40 shadow-sm"
                          : "text-red-400 hover:text-red-500"
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("INCOME")}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        field.value === "INCOME"
                          ? "bg-primary text-white border border-emerald-900/40 shadow-sm"
                          : "text-primary hover:text-primary"
                      }`}
                    >
                      Income
                    </button>
                  </div>
                )}
              />

              <div>
                <input
                  type="text"
                  placeholder="Category name *"
                  {...register("name", {
                    required: "Category name is required",
                  })}
                  className={`w-full bg-base-100 border border-base-100 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <span className="text-xs text-red-400 mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-3">Icon</label>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-7 gap-2.5">
                      {AVAILABLE_ICONS.map((item) => {
                        const isSelected = field.value === item.name;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => field.onChange(item.name)}
                            className={`h-10 w-10 cursor-pointer rounded-xl flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-primary border-2 border-primary/10 text-emerald-400"
                                : "bg-base-100 border border-primary/5 hover:bg-primary"
                            }`}
                          >
                            {renderCategoryIcon(
                              item.name,
                              isSelected ? "#22c55e" : "#64748b",
                              "w-5 h-5",
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-3">Color</label>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-3">
                      {AVAILABLE_COLORS.map((color) => {
                        const isSelected = field.value === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => field.onChange(color)}
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
                  )}
                />
              </div>

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
                  disabled={isCreating}
                  className="px-6 py-2.5 bg-primary hover:bg-emerald-700 disabled:opacity-50 text-white cursor-pointer font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-emerald-950/20"
                >
                  {isCreating ? "Saving..." : "Add Category"}
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
