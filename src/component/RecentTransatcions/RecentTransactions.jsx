import { FaReceipt } from 'react-icons/fa';
import { renderIcon } from '../../utility/renderIcon';

// UI Styling Configs based on Transaction Types
const TRANSACTION_CONFIG = {
  CASH_IN: {
    sign: '+',
    amountClass: 'text-emerald-600 font-bold',
  },
  CASH_OUT: {
    sign: '-',
    amountClass: 'text-rose-600 font-bold',
  },
  TRANSFER: {
    sign: '-',
    amountClass: 'text-rose-600 font-bold',
  },
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate);
};

const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

const RecentTransactions = ({ transactions = [] }) => {

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 font-medium">
        No recent transactions found.
      </div>
    );
  }

  return (
    <section className="w-full overflow-hidden">
      <div className="divide-y divide-gray-200">
        {transactions.map((item) => {
          const config = TRANSACTION_CONFIG[item.type] || TRANSACTION_CONFIG.CASH_OUT;

          // Book data prioritization logic
          const bookIcon = item.bookIcon || item.bookDetails?.icon || item.icon;
          const bookColor = item.bookColor || item.bookDetails?.themeColor || item.bookDetails?.color || '#006A4E';
          const bookName = item.bookName || item.bookDetails?.bookName || item.bookDetails?.title;

          const displayCategory = item.type === 'TRANSFER' 
            ? 'Transfer' 
            : item.category || item.categoryName || 'General';

          return (
            <div 
              key={item._id || Math.random()} 
              className="flex items-center justify-between px-4 md:px-8 py-3.5 hover:bg-gray-50/80 transition-all duration-200 group cursor-pointer"
            >
              {/* Left Column: Dynamic Book Icon & Metadata */}
              <div className="flex items-center space-x-3.5 min-w-0">
                <div 
                  className="w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: bookColor ? `${bookColor}20` : '#F3F4F6', // 20 opacity for light background
                  }}
                >
                  {/* renderIcon utility call */}
                  {renderIcon(bookIcon, bookColor, "text-lg md:text-xl")}
                </div>

                <div className="truncate">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {item.title || item.note || 'Untitled Transaction'}
                    </h3>
                    {item.receiptUrl && (
                      <span title="Receipt Attached" className="shrink-0">
                        <FaReceipt className="text-xs text-gray-400 hover:text-gray-600 transition-colors" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-500 mt-0.5 flex items-center gap-1.5 truncate">
                    {bookName && (
                      <>
                        <span className="font-semibold text-gray-700">{bookName}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{displayCategory}</span>
                    <span>•</span>
                    <span>{formatDate(item.date)}</span>
                  </p>
                </div>
              </div>

              {/* Right Column: Amount */}
              <div className="text-right shrink-0 pl-3">
                <span className={`text-sm md:text-base tracking-tight ${config.amountClass}`}>
                  {config.sign}৳{formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentTransactions;