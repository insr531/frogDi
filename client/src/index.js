import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import mainTickerReducer from './redux/updateTickerFilter';
import compareLastYearReducer from './redux/compareLastYear';
import updateStockChartRecuer from './redux/updateStockChart';

const store = configureStore({
  reducer: {
    mainTicker: mainTickerReducer,
    comparePrice: compareLastYearReducer,
    stockChart: updateStockChartRecuer
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);