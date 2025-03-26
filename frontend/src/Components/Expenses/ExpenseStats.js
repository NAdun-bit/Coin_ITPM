"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

function ExpenseStats({ expenses }) {
  const stats = useMemo(() => {
    if (!expenses.length) {
      return {
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        averageAmount: 0,
        expensesByCategory: {},
        expensesByMonth: {},
        participantStats: {}
      };
    }

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const paidExpenses = expenses.filter(expense => expense.status === 'Paid');
    const paidAmount = paidExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const pendingAmount = totalAmount - paidAmount;
    const averageAmount = totalAmount / expenses.length;

    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.description.split(' ')[0].toLowerCase();
      if (!acc[category]) acc[category] = 0;
      acc[category] += expense.amount;
      return acc;
    }, {});

    const expensesByMonth = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!acc[monthYear]) acc[monthYear] = 0;
      acc[monthYear] += expense.amount;
      return acc;
    }, {});

    const participantStats = {};
    expenses.forEach(expense => {
      expense.participants.forEach(participant => {
        const name = participant.name;
        if (!participantStats[name]) {
          participantStats[name] = {
            totalOwed: 0,
            totalPaid: 0,
            expenseCount: 0
          };
        }

        const share = expense.splitType === 'equal'
          ? expense.amount / expense.participants.length
          : participant.share;

        participantStats[name].expenseCount += 1;

        if (participant.hasPaid) {
          participantStats[name].totalPaid += share;
        } else {
          participantStats[name].totalOwed += share;
        }
      });
    });

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      averageAmount,
      expensesByCategory,
      expensesByMonth,
      participantStats
    };
  }, [expenses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {expenses.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No expense data</h3>
          <p className="mt-1 text-sm text-gray-500">Add some expenses to see statistics.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={itemVariants}
          >
            {[
              { label: "Total Expenses", value: stats.totalAmount, color: "blue" },
              { label: "Paid", value: stats.paidAmount, color: "green" },
              { label: "Pending", value: stats.pendingAmount, color: "yellow" },
              { label: "Average Expense", value: stats.averageAmount, color: "purple" }
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 bg-${color}-500 rounded-md p-3`}>
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v10m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
                        <dd className="text-lg font-semibold text-gray-900">${value.toFixed(2)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Participant Stats */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Participant Summary</h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {Object.entries(stats.participantStats).map(([name, data]) => (
                  <li key={name}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-700 font-medium">{name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{name}</div>
                            <div className="text-sm text-gray-500">
                              {data.expenseCount} expense{data.expenseCount !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-900">Paid</div>
                            <div className="text-sm font-medium text-green-600">${data.totalPaid.toFixed(2)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-900">Owes</div>
                            <div className="text-sm font-medium text-red-600">${data.totalOwed.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Expense Categories</h3>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {Object.entries(stats.expensesByCategory).map(([category, amount]) => {
                    const percentage = (amount / stats.totalAmount) * 100;
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                          <div className="capitalize">{category}</div>
                          <div>${amount.toFixed(2)} ({percentage.toFixed(1)}%)</div>
                        </div>
                        <div className="mt-1 relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${percentage}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default ExpenseStats;
