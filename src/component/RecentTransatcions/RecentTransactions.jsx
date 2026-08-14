

import * as FontAwesomeIcons from 'react-icons/fa';
import { transactionsData } from '../../../public/transactions';



// Dynamic Icon Component: Resolves string name from JSON to actual React Icon
const DynamicIcon = ({ iconName, className }) => {
  const IconComponent = FontAwesomeIcons[iconName] || FontAwesomeIcons.FaQuestionCircle;
  return <IconComponent className={className} />;
};

// UI Styling Configs based on Transaction Types
const TRANSACTION_CONFIG = {
  CASH_IN: {
    sign: '+',
    amountClass: 'text-emerald-800',
  },
  CASH_OUT: {
    sign: '-',
    amountClass: 'text-rose-800',
  },
  TRANSFER: {
    sign: '-',
    amountClass: 'text-rose-800',
  },
};

// Native Formatting Helpers
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
  }).format(amount);
};

const RecentTransactions = ({ transactions = transactionsData }) => {
  return (
    <section className="w-full overflow-hidden">

      {/* Transaction List */}
      <div className="divide-y divide-gray-300">
        {transactions.map((item) => {
          const config = TRANSACTION_CONFIG[item.type] || TRANSACTION_CONFIG.CASH_OUT;

          // Subtitle Label Logic (TRANSFER uses Service/Transfer tag)
          const displayCategory = item.type === 'TRANSFER' 
            ? 'Service' 
            : item.categoryName || 'General';

          return (
            <div 
              key={item._id} 
              className="flex items-center justify-between px-4 md:px-10 py-4 hover:bg-primary/5 transition-all duration-300 group cursor-pointer"
            >
              {/* Left Column: Dynamic Icon & Metadata */}
              <div className="flex items-center space-x-4 min-w-0">
                <div 
                  className={`p-2 md:p-0 md:w-12 md:h-12 rounded-2xl ${item.iconBg || 'bg-gray-100'} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                >
                  {/* Icon name is pulled dynamically from JSON */}
                  <DynamicIcon 
                    iconName={item.icon} 
                    className={`md:text-xl ${item.iconColor || 'text-gray-600'}`} 
                  />
                </div>

                <div className="truncate">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-semibold text-gray-900 md:text-base truncate">
                      {item.title}
                    </h3>
                    {item.receiptUrl && (
                      <span title="Receipt Attached">
                        <FontAwesomeIcons.FaReceipt className="text-xs text-gray-300 hover:text-gray-500 transition-colors" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">
                    {displayCategory} &#9679; {formatDate(item.date)}
                  </p>
                </div>
              </div>

              {/* Right Column: Amount */}
              <div className="text-right shrink-0 pl-3">
                <span className={`text-base font-bold tracking-tight ${config.amountClass}`}>
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