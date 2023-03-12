import React from "react";
export default function Header({
  connected,
  signerAddress,
  connectWallet
}) {

  return (
    <header>
      <div className="header-content">
        <div className="page-logo">
          {/* eslint-disable-next-line */}
          <img src="./logo.png" alt="logo" className="logo" />
        </div>
        <button variant="contained" color="secondary" className="wallet-button" onClick={() => connectWallet()} sx={{ color: "#fff", letterSpacing: 2 }}>
          {!connected ?
            <>
              Connect Wallet
            </>
            :
            <span className="wallet-address">
              {`0x${signerAddress.slice(2, 5)}...${signerAddress.slice(-5)}`}
            </span>
          }
        </button>
      </div>
    </header>
  )
}
