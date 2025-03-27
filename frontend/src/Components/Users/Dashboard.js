import React from "react";
import TransactionChart from "../Transactions/TransactionChart";
import TransactionList from "../Transactions/TransactionList";

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <TransactionChart />
      <TransactionList />
    </div>
  );
};

export default Dashboard;
