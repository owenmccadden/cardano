import * as React from 'react';
import { ReactDOM } from 'react';
import { Button } from '@mui/material';
import './App.css';
import { useEffect } from 'react';
import {
  Address,
  BaseAddress,
  MultiAsset,
  Assets,
  ScriptHash,
  Costmdls,
  Language,
  CostModel,
  AssetName,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  TransactionOutput,
  Value,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  TransactionOutputBuilder,
  LinearFee,
  BigNum,
  BigInt,
  TransactionHash,
  TransactionInputs,
  TransactionInput,
  TransactionWitnessSet,
  Transaction,
  PlutusData,
  PlutusScripts,
  PlutusScript,
  PlutusList,
  Redeemers,
  Redeemer,
  RedeemerTag,
  Ed25519KeyHashes,
  ConstrPlutusData,
  ExUnits,
  Int,
  NetworkInfo,
  EnterpriseAddress,
  TransactionOutputs,
  hash_transaction,
  hash_script_data,
  hash_plutus_data,
  ScriptDataHash, Ed25519KeyHash, NativeScript, StakeCredential
} from "@emurgo/cardano-serialization-lib-asmjs"
let Buffer = require('buffer/').Buffer

function App() {

  const checkIfWalletEnabled = async () => {
    let walletEnabled = false;
    try {
      walletEnabled = await window.cardano.nami.isEnabled();
    } catch (err) {
      console.log(err);
    }
    return walletEnabled;
  }

  let API = null;
  let balance = 0;

  const connectWallet = async () => {
    try {
      API = await window.cardano.nami.enable();
      await checkIfWalletEnabled();
      console.log("wallet connected: " + await checkIfWalletEnabled());
      balance = await getBalance();
      console.log("balance: " + balance + " Lovelace");
    } catch (err) {
      console.log(err);
    }
  }

  const getBalance = async () => {
    try {
        const balanceCBORHex = await API.getBalance();
        const balance = Value.from_bytes(Buffer.from(balanceCBORHex, "hex")).coin().to_str();
        return balance;

    } catch (err) {
        console.log(err)
    }
}

  return (
    <div id="wallet_button">
      <Button variant="contained" onClick={connectWallet}>Connect Nami Wallet</Button>
    </div>
  );
}

export default App;
