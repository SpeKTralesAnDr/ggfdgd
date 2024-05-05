import './App.css';
import Route from './Route';

function App() {
  const appStyle = {
    height: '100%',
    width: '100%',
  };

  return (
    <div className="App" style={appStyle}>
      <Route></Route>
    </div>
  );
}

export default App;
