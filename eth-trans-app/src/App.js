import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Eth Transaction History</h1>

      <div>
        {/* Limit at 1,920,000 to faactor in the DAO fork */}
        <input type="number" min="1920000" placeholder="Block Number (from)" required />
        <input type="number" min="1920000" placeholder="Block Number (to)" />
        <input type="date" placeholder="date of transaction" />
        <input type="text" placeholder="Address" required />
        <button>Search</button>
      </div>

      <div>
        <table>
          <thead>
            <th>Tx Hash</th>
            <th>Tx To</th>
            <th>Tx From</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </thead>
          <tbody>
            <tr>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
