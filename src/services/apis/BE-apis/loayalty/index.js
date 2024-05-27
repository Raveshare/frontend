import { API, api } from "../config";

// Get all live tasks in the platform
export const getAllTasks = async () => {
  const result = await api.get(`${API}/user/loyalty/tasks`);

  return result?.data;
};

// Get available Invite code

export const getInviteCode = async () => {
  const result = await api.get(`${API}/user/loyalty/invite-code`);

  return result?.data;
};

export const apiClaimReward = async (data) => {
  const result = await api.post(`${API}/user/loyalty/claim-reward`, {
    taskId: data,
  });

  return result?.data;
};
