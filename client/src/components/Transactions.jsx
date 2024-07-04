import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './TransactionsTable';


const API_URL = 'http://localhost:4000/transactions';


function Transactions() {

    
  const [month, setMonth] = useState('03'); // Default to March
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const fetchTransactions = async (month, search, page) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          month,
          search,
          page,
          perPage: 10
        }
      });
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions(month, search, page);
  }, [month, search, page]);


  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    console.log(search);
    setSearch(event.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };



  return (
    <div>
        <h1>Transactions</h1>
      <div>
        <label htmlFor="month-select">Select Month: </label>
        <select id="month-select" value={month} onChange={handleMonthChange}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      <div>
        <label htmlFor="search-box">Search Transactions: </label>
        <input
          id="search-box"
          type="text"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <TransactionsTable transactions={transactions} />
      <div>
        <span>Page No. {page}</span>
        <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
        <span>Total Pages {totalPages}</span>
      </div>
    </div>
  )
}

export default Transactions