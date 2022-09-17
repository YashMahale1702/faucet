import { useEffect } from 'react';
import './App.scss';

function App() {
    useEffect(() => {
        const loadProvider = async () => {
            // These are already available, directly injected by the Metamask
            console.log(window.ethereum);
            console.log(window.web3);
        };

        loadProvider();
    }, []);

    const enableEthHandler = async () => {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        console.log(accounts);
    };

    return (
        <div className='faucet-wrapper'>
            <div className='faucet'>
                <div className='balance-view'>
                    Current Balance: <strong>10</strong> ETH
                </div>
                <button className='btn' onClick={enableEthHandler}>
                    Enable Ethereum
                </button>
                <button className='btn'>Donate</button>
                <button className='btn'>Withdraw</button>
            </div>
        </div>
    );
}

export default App;
