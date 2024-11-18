import React, { useState } from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design"; // Only import WalletSelector
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "./Home.css";

function Home() {
  const [activeTab, setActiveTab] = useState("buy");
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
    items: "",
  });
  const [collectionMessage, setCollectionMessage] = useState("");
  const { connected, account } = useWallet();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowClaimForm(false);
    setMessage("");
    setCollectionMessage("");
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
    setCollectionData({ collectionName: "", description: "", supply: "", items: "" });
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
              name="supply"
              placeholder="Supply"
              value={collectionData.supply}
              onChange={handleCollectionChange}
              required
            />
            <textarea
              name="items"
              placeholder="Items (comma-separated)"
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
