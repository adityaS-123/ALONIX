// src/components/NFTDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './NFTDetails.css';

function NFTDetails() {
  const { id } = useParams();
  const [nft, setNft] = useState(null);

  useEffect(() => {
    async function fetchNFTDetails() {
      const response = await fetch(`/api/nfts/${id}`); // Replace with your API call
      const data = await response.json();
      setNft(data);
    }
    fetchNFTDetails();
  }, [id]);

  if (!nft) return <div>Loading...</div>;

  return (
    <div className="container nft-details">
      <img src={nft.image} alt={nft.name} className="nft-image" />
      <div className="nft-info">
        <h1>{nft.name}</h1>
        <p>{nft.description}</p>
        <p>Price: {nft.price} APT</p>
        <Link to={`/buy/${id}`} className="buy-button">Buy NFT</Link>
      </div>
    </div>
  );
}

export default NFTDetails;
