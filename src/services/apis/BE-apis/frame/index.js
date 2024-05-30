import { API, api } from "../config";

export const getFrame = async (frameId) => {
  const res = await api.get(`${API}/util/get-frame-data/${frameId}`);
  return res.data;
};

export const postFrame = async (params) => {
  const res = await api.post(`${API}/util/create-frame-data`, params);
  return res.data;
};

export const getOrCreateWallet = async (chainId) => {
  const res = await api.get(`${API}/mint?chainId=${chainId}`);
  return res.data;
};

export const withdrawFunds = async ({ address, amount }) => {
  const res = await api.post(`${API}/mint/withdraw`, {
    to: address,
    amount: amount,
  });
  return res.data;
};
