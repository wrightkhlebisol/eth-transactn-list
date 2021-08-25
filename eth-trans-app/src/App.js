import './App.css';
import { useState } from 'react';

const server_url = "http://127.0.0.1:3020";
function App() {
  const [from, setFrom] = useState(0x0);
  const [date, setDate] = useState(Date.now());
  const [address, setAddress] = useState(0x0);
  const [responses, setResponses] = useState([]);

  // useEffect(() => {
  //   effect
  //   return () => {
  //     cleanup
  //   }
  // }, [input])

  function queryChain(e) {
    e.preventDefault();
    fetch(`${server_url}/block/${from}/transactions/${address}`)
      .then(res => res.json())
      .then(res => {
        console.log(res.body)
        setResponses(res.body.response);

      }).catch(e => console.error(e));

    console.log(from, date, address)
  }

  function handleSetFrom(e) {
    console.log(e.target.value)
    let from = e.target.value;
    setFrom(from);
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
          <input type="text" placeholder="Address" required onChange={handleSetAddress} />
          <input type="date" placeholder="date of transaction" onChange={handleSetDate} />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="resultBody">
        <table className="tableBody">
          <thead>
            <tr>
              <th>Hash</th>
              <th>To</th>
              <th>From</th>
              <th>gasLimit(wei)</th>
              <th>gasPrice(wei)</th>
              <th>Txn Fee(ether)</th>
              <th>Value(wei)</th>
              <th>Nonce</th>
              <th>Data(if any)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {
              responses.length > 0 ?
                responses.map((response, id) =>
                  <tr key={id}>
                    <td>{`${response.hash.substr(0, 12)}...`}</td>
                    <td>{`${response.to.substr(0, 12)}...`}</td>
                    <td>{`${response.from.substr(0, 12)}...`}</td>
                    <td>{parseInt(response.gasLimit.hex)}</td>
                    <td>{parseInt(response.gasPrice.hex)}</td>
                    <td>{(parseInt(response.gasLimit.hex) * parseInt(response.gasPrice.hex) / 10 ** 18).toFixed(7)}</td>
                    <td>{parseInt(response.value.hex)}</td>
                    <td>{response.nonce}</td>
                    <td>{`${response.data.substr(0, 12)}...`}</td>
                    <td>{responses.timestamp}</td>
                  </tr>
                )
                :
                <tr className="noContent">
                  <td colSpan="10">No transaction for current selection</td>
                </tr>
            }

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
