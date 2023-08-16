import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import RunMosaic from "./components/RunMosaic/RunMosaic";
import RouteSelection from "./components/RouteSelection/RouteSelection";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const App: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          <Route path="/route" element={<RunMosaic />} />
          <Route path="/" element={<RouteSelection />} />
        </Routes>
      </Router>
    </PersistGate>
  </Provider>
);

export default App;
