import { useEffect } from 'react';
import { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

import { loadContract } from './utils/load-contract';

import './App.scss';

import Web3 from 'web3';
import { useCallback } from 'react';
import Contract from '@truffle/contract/lib/contract';
import contract from '@truffle/contract';

function App() {
    // state variables
    const [Web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
    });

    const [Account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [shouldReload, setShouldReload] = useState(false);

    const reloadEffect = () => setShouldReload(!shouldReload);

    const setAccountListner = (provider) => {
        provider.on('accountChanged', (accounts) => setAccount(accounts[0]));
    };

    useEffect(() => {
        const loadProvider = async () => {
            // provider is -> Metamask
            const provider = await detectEthereumProvider();
            const contract = await loadContract('Faucet', provider);

            if (provider) {
                setAccountListner(provider);
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
    }, [Web3Api, shouldReload]);

    useEffect(() => {
        const getAccount = async () => {
            const accounts = await Web3Api.web3.eth.getAccounts();
            setAccount(accounts[0]);
        };

        Web3Api.web3 && getAccount();
    }, [Web3Api.web3]);

    const addFunds = async () => {
        const { contract, web3 } = Web3Api;
        await contract.addFunds({
            from: Account,
            value: web3.utils.toWei('0.1', 'ether') // 1eth
        });

        // window.location.reload();
        reloadEffect();
    };

    const withdrawFunds = async () => {
        const { contract, web3 } = Web3Api;
        const withdrawAmount = web3.utils.toWei('0.1', 'ether'); // 1eth
        await contract.withdraw(withdrawAmount, {
            from: Account
        });
        reloadEffect();
    };

    const enableEthHandler = async () => {
        const account = await Web3Api.provider.request({
            method: 'eth_requestAccounts'
        });
        setAccountListner(Web3Api.provider);
        console.log(account);
    };

    console.log(contract);

    return (
        <div className='faucet-wrapper'>
            <div className='faucet'>
                <div className='address'>
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
                    <div className='faucet-account'>
                        <strong>Contract addr: </strong>
                        <span>
                            {' '}
                            {Web3Api.contract
                                ? Web3Api.contract.address
                                : 'Contract provider not found'}
                        </span>
                    </div>
                </div>
                <div className='balance-view'>
                    Balance: <strong>{balance}</strong> ETH
                </div>
                <div className='btn-wrapper'>
                    <button className='button is-link ' onClick={addFunds}>
                        Donate 0.1eth
                    </button>
                    <button
                        className='button is-primary '
                        onClick={withdrawFunds}
                    >
                        Withdraw 0.1eth
                    </button>
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
