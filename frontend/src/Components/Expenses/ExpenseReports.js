"use client"

import { useState } from "react"
import { motion } from "framer-motion"

function ExpenseReports({ expenses }) {
  const [reportType, setReportType] = useState("summary")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    return expenseDate >= startDate && expenseDate <= endDate
  })

  const generateCSV = () => {
    if (filteredExpenses.length === 0) return

    let csvContent = ""

    if (reportType === "summary") {
      // Summary report headers
      csvContent = "Description,Date,Amount,Status,Participants,Split Type\n"

      // Add data rows
      filteredExpenses.forEach((expense) => {
        const row = [
          `"${expense.description}"`,
          new Date(expense.date).toLocaleDateString(),
          expense.amount.toFixed(2),
          expense.status,
          expense.participants.map((p) => p.name).join("; "),
          expense.splitType || "equal",
        ]
        csvContent += row.join(",") + "\n"
      })
    } else if (reportType === "detailed") {
      // Detailed report headers
      csvContent = "Description,Date,Amount,Status,Participant,Share,Paid\n"

      // Add data rows
      filteredExpenses.forEach((expense) => {
        expense.participants.forEach((participant) => {
          const share = expense.splitType === "equal" ? expense.amount / expense.participants.length : participant.share

          const row = [
            `"${expense.description}"`,
            new Date(expense.date).toLocaleDateString(),
            expense.amount.toFixed(2),
            expense.status,
            participant.name,
            share.toFixed(2),
            participant.hasPaid ? "Yes" : "No",
          ]
          csvContent += row.join(",") + "\n"
        })
      })
    } else if (reportType === "balance") {
      // Balance report
      const balances = {}

      // Calculate balances
      filteredExpenses.forEach((expense) => {
        expense.participants.forEach((participant) => {
          const name = participant.name
          if (!balances[name]) {
            balances[name] = { paid: 0, owed: 0 }
          }

          const share = expense.splitType === "equal" ? expense.amount / expense.participants.length : participant.share

          if (participant.hasPaid) {
            balances[name].paid += share
          } else {
            balances[name].owed += share
          }
        })
      })

      // Balance report headers
      csvContent = "Participant,Total Paid,Total Owed,Balance\n"

      // Add data rows
      Object.entries(balances).forEach(([name, data]) => {
        const balance = data.paid - data.owed
        const row = [name, data.paid.toFixed(2), data.owed.toFixed(2), balance.toFixed(2)]
        csvContent += row.join(",") + "\n"
      })
    }

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `expense-report-${reportType}-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generatePDF = () => {
    alert(
      "PDF generation would be implemented here with a library like jsPDF or by sending the data to a server endpoint that generates PDFs.",
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6" variants={itemVariants}>
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Generate Reports</h3>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="report-type" className="block text-sm font-medium text-gray-700">
                Report Type
              </label>
              <select
                id="report-type"
                name="report-type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="balance">Balance Report</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="start-date"
                id="start-date"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="end-date"
                id="end-date"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={generateCSV}
              disabled={filteredExpenses.length === 0}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download CSV
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={generatePDF}
              disabled={filteredExpenses.length === 0}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Report Preview</h3>

        {filteredExpenses.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
              <p className="mt-1 text-sm text-gray-500">Adjust your date range to include expenses.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {reportType === "summary"
                    ? "Summary Report"
                    : reportType === "detailed"
                      ? "Detailed Report"
                      : "Balance Report"}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {dateRange.startDate} to {dateRange.endDate}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                {reportType === "summary" && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Participants
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses.map((expense) => (
                        <tr key={expense._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {expense.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${expense.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                expense.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {expense.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {expense.participants.map((p) => p.name).join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === "detailed" && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Participant
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Share
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses.flatMap((expense) =>
                        expense.participants.map((participant, pIndex) => {
                          const share =
                            expense.splitType === "equal"
                              ? expense.amount / expense.participants.length
                              : participant.share

                          return (
                            <tr key={`${expense._id}-${pIndex}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {expense.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(expense.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${share.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    participant.hasPaid
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {participant.hasPaid ? "Paid" : "Pending"}
                                </span>
                              </td>
                            </tr>
                          )
                        }),
                      )}
                    </tbody>
                  </table>
                )}

                {reportType === "balance" && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Participant
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total Paid
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total Owed
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const balances = {}

                        // Calculate balances
                        filteredExpenses.forEach((expense) => {
                          expense.participants.forEach((participant) => {
                            const name = participant.name
                            if (!balances[name]) {
                              balances[name] = { paid: 0, owed: 0 }
                            }

                            const share =
                              expense.splitType === "equal"
                                ? expense.amount / expense.participants.length
                                : participant.share

                            if (participant.hasPaid) {
                              balances[name].paid += share
                            } else {
                              balances[name].owed += share
                            }
                          })
                        })

                        return Object.entries(balances).map(([name, data]) => {
                          const balance = data.paid - data.owed
                          return (
                            <tr key={name}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${data.paid.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${data.owed.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <span className={balance >= 0 ? "text-green-600" : "text-red-600"}>
                                  ${balance.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          )
                        })
                      })()}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default ExpenseReports

