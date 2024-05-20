import { API, api } from "../config";

export const deployZoraContract = async ({
  contract_type,
  canvasId,
  chainId,
  currency,
  args,
  recipients
}) => {
  const res = await api.post(`${API}/mint/deploy-contract`, {
    contract_type,
    canvasId,
    chainId,
    currency,
    args,
    recipients,
  });

  console.log(res);
  return res.data;
};
