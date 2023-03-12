/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Head from "next/head"
import Web3 from "web3"
import Web3Modal from "web3modal"
import { ethers, providers } from "ethers"
import { providerOptions } from "../utils"
import { CHAIN_ID, NETWORK, SITE_ERROR, Contract_ABI, Contract_Address } from "../../config"
import { errorAlertCenter, successAlert } from "../components/toastGroup";

let web3Modal = undefined;
let contract = undefined;

export default function Home() {
    const [connected, setConnected] = useState(false);
    const [signerAddress, setSignerAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const connectWallet = async () => {
        if (await checkNetwork()) {
            setLoading(true)
            web3Modal = new Web3Modal({
                network: NETWORK, // optional
                cacheProvider: true,
                providerOptions, // required
            })
            try {
                const provider = await web3Modal.connect();
                const web3Provider = new providers.Web3Provider(provider);
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress();

                setConnected(true);
                setSignerAddress(address);

                contract = new ethers.Contract(
                    Contract_Address,
                    Contract_ABI,
                    signer
                );

                // Subscribe to accounts change
                provider.on("accountsChanged", (accounts) => {
                    console.log(accounts[0], '--------------');
                });
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleMint = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            const tokenContract = new web3.eth.Contract(Contract_ABI, Contract_Address);
            const defaultCost = await tokenContract.methods.price().call({ from: signerAddress });
            await tokenContract.methods.mint(1).send({ from: signerAddress, value: defaultCost });
        } catch (error) {
            console.log(error)
        }
    }
    const checkNetwork = async () => {
        const web3 = new Web3(Web3.givenProvider)
        const chainId = await web3.eth.getChainId()
        if (chainId === CHAIN_ID) {
            return true
        } else {
            errorAlertCenter(SITE_ERROR[0])
            return false
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (typeof window.ethereum !== 'undefined') {
                if (await checkNetwork()) {
                    await connectWallet();
                    ethereum.on('accountsChanged', function (accounts) {
                        window.location.reload();
                    });
                    if (ethereum.selectedAddress !== null) {
                        setSignerAddress(ethereum.selectedAddress);
                        setConnected(true);
                    }
                    ethereum.on('chainChanged', (chainId) => {
                        checkNetwork();
                    })
                }
            } else {
                errorAlertCenter(SITE_ERROR[1])
            }
        }
        fetchData()
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <Head>
                <title>Snooventure Time</title>
                <meta name="description" content="Snooventure Time" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="main-content">
                <img src="/img/title.png" className="back" alt="" />
                <div className="page-control">
                    <button className="btn btn-connect" onClick={() => connectWallet()}>
                        {!connected &&
                            <img src="/img/connect-wallet.png" alt="" />
                        }
                    </button>
                    <button className="btn btn-connect" onClick={() => handleMint()}>
                        <img src="/img/mint-here.png" alt="" />
                    </button>
                </div>
            </main>
            {/* eslint-disable-next-line */}
            <img
                src="/img/background.png"
                className="background"
                alt=""
            />
        </>
    )
}
