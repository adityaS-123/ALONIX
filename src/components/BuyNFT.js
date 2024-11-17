// src/components/BuyNFT.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AptosClient } from 'aptos';
import './BuyNFT.css';

function BuyNFT() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleBuy = async () => {
    setLoading(true);
    try {
      const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');
      const transaction = {
        // Transaction details here
      };
      await client.submitTransaction(transaction);
      setMessage('Purchase successful!');
    } catch (error) {
      setMessage('Error purchasing NFT');
    }
    setLoading(false);
  };

  return (
    <div className="container buy-page">
      <h1>Buy NFT {id}</h1>
      <button onClick={handleBuy} disabled={loading}>
        {loading ? 'Processing...' : 'Buy Now'}
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default BuyNFT;
