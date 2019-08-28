import React from 'react';

import Header from './components/Header';
import TimeTracker from './components/TimeTracker';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <TimeTracker />
      </div>
    );
  }
}

export default App;
