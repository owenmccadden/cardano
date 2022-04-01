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
      console.log(await getNetworkId());
      console.log(await getChangeAddress());
      console.log(await getRewardAddresses());
      console.log(await getUsedAddresses());
      console.log(await getCollateral());
      console.log(await getUtxos());
    } catch (err) {
      console.log(err);
    }
  }

  const getCollateral = async () => {

    let CollatUtxos = [];

    try {

      let collateral = [];

      API.experimental.getCollateral();

      for (const x of collateral) {
        const utxo = TransactionUnspentOutput.from_bytes(Buffer.from(x, "hex"));
        CollatUtxos.push(utxo)
        // console.log(utxo)
      }
      return CollatUtxos;
    } catch (err) {
      console.log(err)
    }

  }

  const getUtxos = async () => {

    let Utxos = [];

    try {
      const rawUtxos = await API.getUtxos();

      for (const rawUtxo of rawUtxos) {
        const utxo = TransactionUnspentOutput.from_bytes(Buffer.from(rawUtxo, "hex"));
        const input = utxo.input();
        const txid = Buffer.from(input.transaction_id().to_bytes(), "utf8").toString("hex");
        const txindx = input.index();
        const output = utxo.output();
        const amount = output.amount().coin().to_str(); // ADA amount in lovelace
        const multiasset = output.amount().multiasset();
        let multiAssetStr = "";

        if (multiasset) {
          const keys = multiasset.keys() // policy Ids of thee multiasset
          const N = keys.len();
          // console.log(`${N} Multiassets in the UTXO`)


          for (let i = 0; i < N; i++) {
            const policyId = keys.get(i);
            const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString("hex");
            // console.log(`policyId: ${policyIdHex}`)
            const assets = multiasset.get(policyId)
            const assetNames = assets.keys();
            const K = assetNames.len()
            // console.log(`${K} Assets in the Multiasset`)

            for (let j = 0; j < K; j++) {
              const assetName = assetNames.get(j);
              const assetNameString = Buffer.from(assetName.name(), "utf8").toString();
              const assetNameHex = Buffer.from(assetName.name(), "utf8").toString("hex")
              const multiassetAmt = multiasset.get_asset(policyId, assetName)
              multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`
              // console.log(assetNameString)
              // console.log(`Asset Name: ${assetNameHex}`)
            }
          }
        }


        const obj = {
          txid: txid,
          txindx: txindx,
          amount: amount,
          str: `${txid} #${txindx} = ${amount}`,
          multiAssetStr: multiAssetStr,
          TransactionUnspentOutput: utxo
        }
        Utxos.push(obj);
        // console.log(`utxo: ${str}`)
      }
      return Utxos;
    } catch (err) {
      console.log(err)
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

  const getNetworkId = async () => {
    try {
      const networkId = await API.getNetworkId();
      return networkId;

    } catch (err) {
      console.log(err)
    }
  }

  const getChangeAddress = async () => {
    try {
      const raw = await API.getChangeAddress();
      const changeAddress = Address.from_bytes(Buffer.from(raw, "hex")).to_bech32();
      return changeAddress;
    } catch (err) {
      console.log(err)
    }
  }

  const getRewardAddresses = async () => {

    try {
      const raw = await API.getRewardAddresses();
      const rawFirst = raw[0];
      const rewardAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
      return rewardAddress;

    } catch (err) {
      console.log(err)
    }
  }

  const getUsedAddresses = async () => {

    try {
      const raw = await API.getUsedAddresses();
      const rawFirst = raw[0];
      const usedAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
      return usedAddress;

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
