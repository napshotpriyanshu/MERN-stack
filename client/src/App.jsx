import './App.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Transactions from './components/Transactions';
import Statistics from './components/Statistics';
import Bar_Chart from './components/BarChart';


function App() {

   return (
    <>

<div className="App">
      <Transactions />
      <Statistics />
      <Bar_Chart />
    </div>
     
    </>
  )
}

export default App
