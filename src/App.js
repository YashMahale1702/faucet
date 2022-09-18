import { useEffect } from 'react';
import { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

import { loadContract } from './utils/load-contract';

import './App.scss';

import Web3 from 'web3';

function App() {
    const [Web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
    });

    const [Account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const loadProvider = async () => {
            // provider is -> Metamask
            const provider = await detectEthereumProvider();
            const contract = await loadContract('Faucet', provider);

            if (provider) {
                setWeb3Api({
                    provider,
                    contract,
                    web3: new Web3(provider)
                });
            } else {
                console.error('Please install Metamask');
            }
        };

        loadProvider();
    }, []);

    useEffect(() => {
        const loadBalance = async () => {
            const { contract, web3 } = Web3Api;
            const balance = await web3.eth.getBalance(contract.address);
            const balanceInEth = web3.utils.fromWei(balance, 'ether');

            setBalance(balanceInEth);
        };

        Web3Api.contract && loadBalance();
    }, [Web3Api]);

    useEffect(() => {
        const getAccount = async () => {
            const accounts = await Web3Api.web3.eth.getAccounts();
            setAccount(accounts[0]);
        };

        Web3Api.web3 && getAccount();
    }, [Web3Api.web3]);

    const enableEthHandler = async () => {
        const account = await Web3Api.provider.request({
            method: 'eth_requestAccounts'
        });

        console.log(account);
    };

    return (
        <div className='faucet-wrapper'>
            <div className='faucet'>
                <div className='account'>
                    <strong>Account: </strong>
                    <span>
                        {' '}
                        {Account ? (
                            Account
                        ) : (
                            <button
                                className='button is-white'
                                onClick={enableEthHandler}
                            >
                                Connect metamask
                            </button>
                        )}
                    </span>
                </div>
                <div className='balance-view'>
                    Current Balance: <strong>{balance}</strong> ETH
                </div>
                <div className='btn-wrapper'>
                    <button className='button is-link '>Donate</button>
                    <button className='button is-primary '>Withdraw</button>
                </div>
            </div>
        </div>
    );
}

export default App;

// * Old LoadProvider useEffect
// let provider = null;
// if (window.ethereum) {
//     provider = window.ethereum;
//     try {
//         await provider.request({ method: 'eth_requestAccounts' });
//     } catch {
//         console.log('User denied accounts access');
//     }
// } else if (window.Web3) {
//     provider = window.web3.currentProvider;
// } else if (!process.env.production) {
//     provider = new Web3.providers.HttpProvider(
//         'http://localhost:7545'
//     );
// }

// setWeb3Api({
//     provider,
//     web3: new Web3(provider)
// });
