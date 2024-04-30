import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, count: action.count };
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_MY_COUNT':
      return { ...state, myCount: action.myCount };
    case 'INCREMENT_MY_COUNT':
      return { ...state, myCount: state.myCount + 1 };
    case 'DECREMENT_MY_COUNT':
      return { ...state, myCount: state.myCount - 1 };
    default:
      return state;
  }
};

const Counter = ({ endpoint, title }) => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get(endpoint);
      dispatch({ type: 'SET', count: response.data.count });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, endpoint]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post(`${endpoint}/increment`);
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, endpoint]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post(`${endpoint}/decrement`);
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, endpoint]);

  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {state.count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const MyCounter = ({ endpoint, title }) => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchMyCounter = useCallback(async () => {
    try {
      const response = await axios.get(endpoint);
      dispatch({ type: 'SET_MY_COUNT', myCount: response.data.myCount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, endpoint]);

  useEffect(() => {
    fetchMyCounter();
  }, [fetchMyCounter]);

  const incrementMyCounter = useCallback(async () => {
    try {
      await axios.post(`${endpoint}/increment`);
      dispatch({ type: 'INCREMENT_MY_COUNT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, endpoint]);

  const decrementMyCounter = useCallback(async () => {
    try {
      await axios.post(`${endpoint}/decrement`);
      dispatch({ type: 'DECREMENT_MY_COUNT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, endpoint]);

  return (
    <div>
      <h2>{title}</h2>
      <p>My Count: {state.myCount}</p>
      <button onClick={incrementMyCounter}>Increment</button>
      <button onClick={decrementMyCounter}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <h1>My Counter Value: {state.myCount}</h1>
      <Link to="/counter">Counter</Link>
      <Link to="/myCounter">My Counter</Link>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, myCount: 0 });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/myCounter">MyCounter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/counter"
              element={<Counter endpoint="https://counterapp-snfc.onrender.com/api/counter" title="Counter" />}
            />
            <Route
              path="/myCounter"
              element={<MyCounter endpoint="https://counterapp-snfc.onrender.com/api/myCounter" title="MyCounter" />}
            />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
