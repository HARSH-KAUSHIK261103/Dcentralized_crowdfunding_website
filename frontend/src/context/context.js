import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Address, abi } from "./constant";

export const CrowdFunding = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const connect = async () => {
    const accounts = await window?.ethereum?.request({
      method: "eth_requestAccounts",
    });
    if (accounts) setWalletAddress(accounts[0]);
  };
  useEffect(() => {
    connect();
    window?.ethereum?.on("accountsChanged", connect);
  }, []);

  const setSmartContractAndProvider = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const newProvider = new ethers.providers.Web3Provider(connection);
    const signer = newProvider.getSigner();
    const newContract = new ethers.Contract(Address, abi, signer);

    setProvider(newProvider);
    setContract(newContract);
  };
  useEffect(() => {
    setSmartContractAndProvider();
  }, []);

  const publishCampaign = async (form) => {
    try {
      const data = await contract.createCampaign(
        walletAddress, // owner
        form.title, // title
        form.description, // description
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image
      );

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.getCampaigns();
    // console.log(campaigns);

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));
    // console.log(parsedCampaings);
    return parsedCampaings;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await contract.getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === walletAddress
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.donateToCampaign([pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.getDonators([pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <CrowdFunding.Provider
      value={{
        walletAddress,
        contract,
        connect,
        publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </CrowdFunding.Provider>
  );
};

export const useCrowdFunding = () => useContext(CrowdFunding);
