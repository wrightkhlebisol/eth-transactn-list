import './App.css';
import { useState } from 'react';

function App() {
  const [from, setFrom] = useState(0x0);
  const [to, setTo] = useState(0x0);
  const [date, setDate] = useState(Date.now());
  const [address, setAddress] = useState(0x0);
  const [responses,] = useState([]);

  function queryChain(e) {
    e.preventDefault();
    console.log(from, to, date, address)
  }

  function handleSetFrom(e) {
    console.log(e.target.value)
    let from = e.target.value;
    setFrom(from);
  }

  function handleSetTo(e) {
    console.log(e.target.value)
    let to = e.target.value;
    setTo(to);
  }

  function handleSetAddress(e) {
    console.log(e.target.value)
    let address = e.target.value;
    setAddress(address);
  }

  function handleSetDate(e) {
    console.log(e.target.value)
    let date = e.target.value;
    setDate(date);
  }

  return (
    <div className="App">
      <h1>Eth Transaction History</h1>

      <div>
        <form onSubmit={queryChain}>
          <input type="number" min="0" placeholder="Block Number (from)" required onChange={handleSetFrom} />
          <input type="number" min="0" placeholder="Block Number (to)" onChange={handleSetTo} />
          <input type="text" placeholder="Address" required onChange={handleSetAddress} />
          <input type="date" placeholder="date of transaction" onChange={handleSetDate} />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="resultBody">
        <table className="tableBody">
          <thead>
            <tr>
              <th>TX Hash</th>
              <th>TX To</th>
              <th>TX From</th>
              <th>TX Value(wei)</th>
              <th>TX Nonce</th>
              <th>TX Data(if any)</th>
              <th>TX Date</th>
            </tr>
          </thead>
          <tbody>
            {
              responses.length > 0 ?
                responses.map((response, id) =>
                  <tr key={id}>
                    <td>{response.hash}</td>
                    <td>{response.to}</td>
                    <td>{response.from}</td>
                    <td>{response.value}</td>
                    <td>{response.nonce}</td>
                    <td>{response.data}</td>
                    <td>{response.date}</td>
                  </tr>
                )
                :
                <tr>
                  <td colSpan="7">No transaction for current selection</td>
                </tr>
            }

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
