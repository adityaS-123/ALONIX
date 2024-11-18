import React, { useState } from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design"; // Only import WalletSelector
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { AccountAddress, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import "./Home.css";

const Home: React.FC= () => {
  const CONTRACT_ADDRESS = "ebd9983149940c8db441c3e3ad1a8a36d4647f8c599751c781180b40b45995b0";
  const aa = new Aptos(new AptosConfig({ network: Network.DEVNET }));
  const mname = "brand_nft_collection";

  const [activeTab, setActiveTab] = useState("buy");
  const [nfts, setNfts] = useState([]); // Dynamic NFT data from backend
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    phone: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [collectionData, setCollectionData] = useState({
    collectionName: "",
    description: "",
    supply: "",
    price: "",
    ImageURL: "",
  });
  const [collectionMessage, setCollectionMessage] = useState("");
  const [buyMessage, setBuyMessage] = useState("");
  const { connected, account, signAndSubmitTransaction } = useWallet();

  const displaynfts = async () =>{
    try {
      const response = await aa.getAccountResource({
        accountAddress: `${CONTRACT_ADDRESS}`, 
        resourceType: "0xebd9983149940c8db441c3e3ad1a8a36d4647f8c599751c781180b40b45995b0::brand_nft_collection::CollectionList"
      })
      console.log('Fetched Reports:', response);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  }

  const buynft = async () =>{
    if (!account) {
      console.error("Wallet not connected!");
      return;
    }
    
    const collectionname1 = "";
    const payload: InputTransactionData = {
      data: {
        function: `${CONTRACT_ADDRESS}::${mname}::mint_nft`,
        functionArguments: [collectionname1,collectionname1,account?.address],
      },
    };
    try {
      const txnRequest = await signAndSubmitTransaction(payload);

      console.log('Crime reported, Transaction Hash:', txnRequest.hash);
      displaynfts(); // Refresh reports after a new crime is reported
    } catch (error) {
      console.error("Failed to report crime:", error);
    }
  }

  const claimNFT = async () =>{
    if (!account) {
      console.error("Wallet not connected!");
      return;
    }
    
    const collectionname1 = "";
    const payload: InputTransactionData = {
      data: {
        function: `${CONTRACT_ADDRESS}::${mname}::burn_nft`,
        functionArguments: [collectionname1,collectionname1],
      },
    };
    try {
      const txnRequest = await signAndSubmitTransaction(payload);

      console.log('Crime reported, Transaction Hash:', txnRequest.hash);
      displaynfts(); // Refresh reports after a new crime is reported
    } catch (error) {
      console.error("Failed to report crime:", error);
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowClaimForm(false);
    setMessage("");
    setBuyMessage("");
    setCollectionMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    setMessage("Your order has been placed");
    setShowClaimForm(false);
    setFormData({ address: "", name: "", phone: "", email: "" });
  };

  const handleBuySubmit = (nft) => {
    setBuyMessage(`You have successfully purchased ${nft.name} for ${nft.price} APT.`);
  };

  const handleCollectionChange = (e) => {
    const { name, value } = e.target;
    setCollectionData({ ...collectionData, [name]: value });
  };

  const handleCollectionSubmit = async (e) => {
    if (!account) {
      console.error("Wallet not connected!");
      return;
    }
    
    e.preventDefault();
    const pp = 10;

    const payload: InputTransactionData = {
      data: {
        function: `${CONTRACT_ADDRESS}::${mname}::create_collection`,
        functionArguments: [collectionData.description, collectionData.collectionName, collectionData.supply, collectionData.ImageURL, pp],
      },
    };
    try {
      const txnRequest = await signAndSubmitTransaction(payload);

      console.log('Crime reported, Transaction Hash:', txnRequest.hash);
      displaynfts(); // Refresh reports after a new crime is reported
    } catch (error) {
      console.error("Failed to report crime:", error);
    }
    setCollectionMessage(
      `Collection "${collectionData.collectionName}" has been created successfully!`
    );
    setCollectionData({ collectionName: "", description: "", supply: "", price: "", ImageURL: "" });
  };

  return (
    <div className="container">
      <div className="wallet-connection">
        <h1>Alonix</h1>
        <WalletSelector />
        {connected && (
          <p className="connected-info">Connected: {account?.address}</p>
        )}
      </div>

      <div className="tabs">
        <button
          onClick={() => handleTabChange("buy")}
          className={activeTab === "buy" ? "active" : ""}
        >
          Buy / Claim NFTs
        </button>
        <button
          onClick={() => handleTabChange("create")}
          className={activeTab === "create" ? "active" : ""}
        >
          Create Collection Drop
        </button>
      </div>

      {activeTab === "buy" && (
        <div className="nft-grid">
          {/* {nfts.length > 0 ? (
            nfts.map((nft) => (
              <div className="nft-card" key={nft.id}>
                <img src={nft.image} alt={nft.name} className="nft-image" />
                <h2>{nft.name}</h2>
                <p>{nft.price} APT</p>
                <div className="buttons">
                  <button onClick={() => setShowClaimForm(true)}>Claim</button>
                  <button onClick={() => handleBuySubmit(nft)}>Buy</button>
                </div>
              </div>
            ))
          ) : (
            <p>No NFTs available currently. Please check back later.</p>
          )} */}
        </div>
      )}

      {showClaimForm && (
        <div className="claim-form">
          <h3>Enter Your Details</h3>
          <form onSubmit={handleClaimSubmit}>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {message && <p className="confirmation-message">{message}</p>}
      {buyMessage && <p className="confirmation-message">{buyMessage}</p>}

      {activeTab === "create" && (
        <div className="collection-form">
          <h3>Create a New Collection</h3>
          <form onSubmit={handleCollectionSubmit}>
            <input
              type="text"
              name="collectionName"
              placeholder="Collection Name"
              value={collectionData.collectionName}
              onChange={handleCollectionChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={collectionData.description}
              onChange={handleCollectionChange}
              required
            />
            <input
              type="number"
              name="Price"
              placeholder="Price"
              value={collectionData.price}
              onChange={handleCollectionChange}
            />
            <input
              type="number"
              name="supply"
              placeholder="Supply"
              value={collectionData.supply}
              onChange={handleCollectionChange}
              required
            />
            <input
              type="text"
              name="ImageURL"
              placeholder="ImageURL"
              value={collectionData.ImageURL}
              onChange={handleCollectionChange}
              required
            />
            <button type="submit">Create Collection</button>
          </form>
        </div>
      )}

      {collectionMessage && (
        <p className="confirmation-message">{collectionMessage}</p>
      )}
    </div>
  );
}

export default Home;
