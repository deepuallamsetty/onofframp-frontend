import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import abijson from "../assests/OnRampStablecoin.json"



const OnOffRampApp = (userAddress) => {
  const contractABI = abijson.abi;
  const contractAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("buy");
  const [balance, setBalance] = useState(null);


  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
  };


  const displayRazorpay = async (usdAmount, userEthAddress) => {
    const loadScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const res = await loadScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    const data = await fetch("http://localhost:3008/createOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: usdAmount }),
    }).then((t) => t.json());

    const options = {
      key: "rzp_test_RIxHNSBQDZ9VgV",
      amount: data.amount,
      currency: "INR",
      name: "Your Company Name",
      description: `Purchase $${usdAmount} worth of USDT`,
      order_id: data.id,
      handler: async function (response) {
        alert("✅ Payment Successful!");

        console.log("Payment response:", response);

        try {
          const depositResp = await fetch("http://localhost:3008/deposit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amountUSD: usdAmount,
              userAddress: userEthAddress,
            }),
          });
          const depositResult = await depositResp.json();
          console.log("Deposit result:", depositResult);
          alert(`Deposit transaction hash: ${depositResult.txHash}`);
          fetchBalance()
        } catch (err) {
          console.error("Deposit failed:", err);
          alert("❌ Deposit failed. Check console for details.");
        }
      },
      prefill: {
        name: "Deepika",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

async function sendBackToContract(amount) {
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  const amountInWei = ethers.parseUnits(amount.toString(), 18);

  const tx = await contract.sendBackToContract(amountInWei);
  await tx.wait();

  alert(`✅ Transaction successful! Hash: ${tx.hash}`);
  fetchBalance()
}






  const fetchBalance = async () => {
    if (!userAddress) return;
    try {
      const res = await fetch("http://localhost:3008/getBalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountAddress: userAddress.userAddress }),
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
      } else {
        setBalance(null);
      }
    } catch (error) {
      console.error("Error fetching balance", error);
      setBalance(null);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [userAddress]);


  const handleConfirm = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (mode === "buy") {
      displayRazorpay(amount, userAddress.userAddress)
      alert(`Buying USDT On-Ramp for amount: ${amount}`);
    } else {
       sendBackToContract(amount)
      // sendBack(5)
      alert(`Selling USDT Off-Ramp for amount: ${amount}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#232544",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 40,
          borderRadius: 8,
          minWidth: 320,
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ marginBottom: 24 }}>On-Ramp / Off-Ramp App</h2>

        <button
          style={{
            backgroundColor: mode === "buy" ? "#87ceeb" : "#eee",
            border: "none",
            padding: "12px 20px",
            marginRight: 12,
            cursor: "pointer",
            borderRadius: 4,
            fontWeight: "bold",
          }}
          onClick={() => handleModeChange("buy")}
        >
          🛒 Buy USDT (On-Ramp)
        </button>

        <button
          style={{
            backgroundColor: mode === "sell" ? "#90ee90" : "#eee",
            border: "none",
            padding: "12px 20px",
            cursor: "pointer",
            borderRadius: 4,
            fontWeight: "bold",
          }}
          onClick={() => handleModeChange("sell")}
        >
          💸 Sell USDT (Off-Ramp)
        </button>
        <div style={{ margin: "15px 0" }}>
          {balance !== null ? (
            <div>Your Balance: {balance / 1e18} USDT</div>
          ) : (
            <div>Loading balance...</div>
          )}
        </div>

        <div style={{ margin: "24px 0" }}>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: 12,
              width: "calc(100% - 24px)",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
        </div>

        <button
          onClick={handleConfirm}
          style={{
            backgroundColor: "#ffa500",
            border: "none",
            padding: "12px 20px",
            cursor: "pointer",
            borderRadius: 4,
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default OnOffRampApp;
