import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; // Import the Home component
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";  // Import PetraWallet

// Initialize the wallet provider with PetraWallet
const wallets = [new PetraWallet()];

function App() {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* You can add more routes here as needed */}
        </Routes>
      </Router>
    </AptosWalletAdapterProvider>
  );
}

export default App;
