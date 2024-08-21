import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
// import { useStateContext } from '../context'
import { useCrowdFunding } from "../context/context";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { walletAddress, contract, getUserCampaigns } = useCrowdFunding();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [walletAddress, contract]);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Profile;
