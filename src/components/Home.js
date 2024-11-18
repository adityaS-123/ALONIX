import React, { useState } from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";  // Only import WalletSelector
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "./Home.css";

function Home() {
  const [activeTab, setActiveTab] = useState("buy");
  const [nfts, setNfts] = useState([
    { id: 1, name: "NFT 1", price: 5 },
    { id: 2, name: "NFT 2", price: 10 },
    { id: 3, name: "NFT 3", price: 7 },
  ]);
  const [ownedNfts, setOwnedNfts] = useState([
    { id: 4, name: "Owned NFT 1" },
    { id: 5, name: "Owned NFT 2" },
  ]);
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
    items: "",
  });
  const [collectionMessage, setCollectionMessage] = useState("");
  const [buyMessage, setBuyMessage] = useState("");
  const { connected, account } = useWallet();

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

  const handleCollectionSubmit = (e) => {
    e.preventDefault();
    setCollectionMessage(
      `Collection "${collectionData.collectionName}" has been created successfully!`
    );
    setCollectionData({ collectionName: "", description: "", items: "" });
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
          onClick={() => handleTabChange("sell")}
          className={activeTab === "sell" ? "active" : ""}
        >
          Sell NFTs
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
          {nfts.map((nft) => (
            <div className="nft-card" key={nft.id}>
              <h2>{nft.name}</h2>
              <p>{nft.price} APT</p>
              <div className="buttons">
                <button onClick={() => setShowClaimForm(true)}>Claim</button>
                <button onClick={() => handleBuySubmit(nft)}>Buy</button>
              </div>
            </div>
          ))}
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
            <input
              name="description"
              placeholder="Description"
              value={collectionData.description}
              onChange={handleCollectionChange}
              required
            />
            <input
              name="supply"
              placeholder="Supply"
              value={collectionData.items}
              onChange={handleCollectionChange}
              required
            />
             <input
              name="price"
              placeholder="Price"
              value={collectionData.items}
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