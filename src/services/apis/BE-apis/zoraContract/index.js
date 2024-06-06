import { API, api } from "../config";

export const deployZoraContract = async (deployArgs) => {
  const res = await api.post(`${API}/mint/deploy-contract`, deployArgs);

  console.log(res);
  return res.data;
};
