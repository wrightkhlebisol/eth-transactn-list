import './App.css';
import { useState } from 'react';

const server_url = "http://127.0.0.1:3020";
function App() {
  const [from, setFromBlock] = useState(0x0);
  const [date, setDate] = useState(Date.now());
  const [address, setAddress] = useState(0x0);
  const [network, setNetwork] = useState('homestead');
  const [currentBalance, setCurrentBalance] = useState(0)
  const [balanceOnDate, setBalanceOnDate] = useState(0)
  const [responses, setResponses] = useState([]);
  const [statusMessage, setStatusMessage] = useState('No transaction for current selection');

  function queryChain(e) {
    e.preventDefault();
    setStatusMessage('...retrieving transactions');
    fetch(`${server_url}/block/${from}/transactions/${address}/network/${network}`)
      .then(res => res.json())
      .then(res => {
        console.log(res.body)
        setResponses(res.body.blocktransactions);
        setStatusMessage(res.message);
        setCurrentBalance(res.body.balanceInETH);
      }).catch(e => console.error(e));

  }

  function handleSetFromBlock(e) {
    let from = e.target.value;
    setFromBlock(from);
  }

  function handleSetAddress(e) {
    let address = e.target.value;
    setAddress(address);
  }

  function handleSetDate(e) {
    let date = e.target.value;
    console.log(date)
    setDate(date);
  }

  function handleSetNetwork(e) {
    let network = e.target.value;
    setNetwork(network);
  }

  return (
    <div className="App">
      <h1>Eth Transaction History</h1>

      <div>
        <form onSubmit={queryChain}>
          <input type="number" min="0" placeholder="Block Number (from)" required onChange={handleSetFromBlock} />
          <input type="text" placeholder="Address" required onChange={handleSetAddress} />
          <input type="date" placeholder="date of transaction" onChange={handleSetDate} />
          <select onChange={handleSetNetwork}>
            <option value="homestead">Homestead(mainnet)</option>
            <option value="rinkeby">Rinkeby(testnet)</option>
            <option value="ropsten">Ropsten(testnet)</option>
            <option value="kovan">Kovan(testnet)</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      </div>

      <div>
        <h5>
          Network:
            <span className="infoSection">{network === 'homestead' ? 'mainnet' : network}</span> |
          Current Balance(eth):
            <span className="infoSection">{currentBalance && currentBalance.toFixed(2)}</span> |
          Balance on ({new Date(date).toGMTString()}):
            <span className="infoSection">{balanceOnDate && balanceOnDate.toFixed(2)}</span>
        </h5>
      </div>

      <div className="resultBody">
        <table className="tableBody">
          <thead>
            <tr>
              <th>Hash</th>
              <th>From</th>
              <th>To</th>
              <th>gasLimit(wei)</th>
              <th>gasPrice(wei)</th>
              <th>Txn Fee(ether)</th>
              <th>Value(ether)</th>
              <th>Nonce</th>
              <th>Data(if any)</th>
              <th>Block Number</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {
              responses &&
                responses.length > 0 ?
                responses.map((response, id) =>
                  <tr key={id}>
                    <td>{`${response.hash.substr(0, 6)}...`}</td>
                    <td>{`${response.from.substr(0, 6)}...`}</td>
                    <td>{`${response.to.substr(0, 6)}...`}</td>
                    <td>{parseInt(response.gasLimit.hex)}</td>
                    <td>{parseInt(response.gasPrice.hex)}</td>
                    <td>{(parseInt(response.gasLimit.hex) * parseInt(response.gasPrice.hex) / 10 ** 18).toFixed(7)}</td>
                    <td>{(parseInt(response.value.hex) / 10 ** 18).toFixed(2)}</td>
                    <td>{response.nonce}</td>
                    <td>{response.data === '0x' ? response.data : `${response.data.substr(0, 8)}...`}</td>
                    <td>{response.blockNumber}</td>
                    <td>{new Date(response.timestamp * 1000).toGMTString()}</td>
                  </tr>
                )
                :
                <tr className="noContent">
                  <td colSpan="11">{statusMessage} on {network} network</td>
                </tr>
            }

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
