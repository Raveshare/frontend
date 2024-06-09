import React, { useContext, useEffect, useState } from "react";
import { LogoutBtn, ProfilePanelHeaders } from "./components";
import { Tabs, Tab, TabsHeader } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import BsGift from "@meronex/icons/bs/BsGift";
import MdcStarFourPointsOutline from "@meronex/icons/mdc/MdcStarFourPointsOutline";
import { CardsHeading, LensCard, UserCard } from "./components/Cards";
import { useUser } from "../../../../../hooks/user";
import {
  getAllTasks,
  getInviteCode,
} from "../../../../../services/apis/BE-apis";
import { ErrorComponent, LoadingAnimatedComponent } from "../../../common";
import { Context } from "../../../../../providers/context";
import HiOutlineArrowNarrowRight from "@meronex/icons/hi/HiOutlineArrowNarrowRight";
import UserCardV2 from "./components/Cards/UserCardV2";
import RewardV1 from "./components/Cards/RewardV1";
import TaskCardV2 from "./components/Cards/TaskCardV2";

const ProfilePanelV2 = () => {
  const { setMenu } = useContext(Context);
  const { username } = useUser();
  const [tasksArr, setTasksArr] = useState([]);

  const {
    data: taskData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getTasks"],
    queryFn: getAllTasks,
  });

  const { data } = useQuery({
    queryKey: ["getInviteCode"],
    queryFn: getInviteCode,
  });

  const taskList = taskData?.message;
  const inviteCodeList = data?.message;

  console.log(taskList);

  useEffect(() => {
    setTasksArr(taskList);
  }, [taskList, data]);

  return (
    <ProfilePanelHeaders
      panelHeader={`My Profile`}
      panelContent={
        <>
          <div className="flex flex-col align-middle justify-between">
            <UserCardV2 username={username} />

            <div className="m-4 font-semibold ">TASKS</div>
            {isLoading ? <LoadingAnimatedComponent /> : null}
            {taskList && taskList.length > 0
              ? taskList.map((task) => (
                  <TaskCardV2
                    taskId={task.id}
                    taskAmount={task.amount}
                    isReward={task.isReward}
                    isCompleted={task.completed}
                    taskName={task.name}
                    taskDesc={task.description}
                  />
                ))
              : null}
          </div>
        </>
      }
    />
  );
};

export default ProfilePanelV2;
