const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");

const namaEl = document.getElementById("nama");
const nimEl = document.getElementById("nim");
const errorEl = document.createElement("p");
errorEl.style.color = "red";
document.body.appendChild(errorEl);

let connectedAddress = null; // simpan state

const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  return (balance / 1e18).toFixed(4);
}

function shortenAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

async function connectWallet() {
  if (!window.ethereum) {
    alert("Core Wallet tidak terdeteksi!");
    return;
  }

  try {
    statusEl.textContent = "Connecting...";
    errorEl.textContent = "";

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    connectedAddress = accounts[0];
    addressEl.textContent = shortenAddress(connectedAddress);

    namaEl.textContent = "muhamad faisal";
    nimEl.textContent = "231011402003";

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    await handleChain(chainId, connectedAddress);

    // Ubah tombol menjadi Disconnect
    connectBtn.textContent = "Disconnect";
    connectBtn.classList.add("disconnect");
    connectBtn.onclick = disconnectWallet;

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Connection Failed ❌";
    errorEl.textContent = err.message;
  }
}

async function handleChain(chainId, address) {
  if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
    networkEl.textContent = "Avalanche Fuji Testnet";
    statusEl.textContent = "Connected ✅";
    statusEl.style.color = "#4cd137";

    const balanceWei = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });

    balanceEl.textContent = formatAvaxBalance(balanceWei);
  } else {
    networkEl.textContent = "Wrong Network ❌";
    statusEl.textContent = "Please switch to Avalanche Fuji";
    statusEl.style.color = "#e1b12c";
    balanceEl.textContent = "-";
  }
}

function disconnectWallet() {
  connectedAddress = null;

  statusEl.textContent = "Not Connected";
  statusEl.style.color = "";
  addressEl.textContent = "-";
  namaEl.textContent = "-";
  nimEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";

  connectBtn.textContent = "Connect Wallet";
  connectBtn.classList.remove("disconnect");
  connectBtn.onclick = connectWallet;
}

// Listen event jika wallet ganti akun
window.ethereum?.on("accountsChanged", (accounts) => {
  if (accounts.length === 0) {
    disconnectWallet();
  } else {
    addressEl.textContent = shortenAddress(accounts[0]);
  }
});

window.ethereum?.on("chainChanged", () => {
  location.reload();
});

connectBtn.onclick = connectWallet;
