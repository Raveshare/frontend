import React, { useContext, useEffect, useState } from "react";
import { LogoutBtn, ProfilePanelHeaders } from "./components";
import { Tabs, Tab, TabsHeader, TabsBody } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import BsGift from "@meronex/icons/bs/BsGift";
import MdcStarFourPointsOutline from "@meronex/icons/mdc/MdcStarFourPointsOutline";
import { CardsHeading, LensCard, UserCard } from "./components/Cards";
import { useUser } from "../../../../../hooks/user";
import {
  apiGetPointsHistory,
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

  const [selectedTab, setSelectedTab] = useState("tasks");

  const tabsArr = [
    { label: "Tasks", value: "tasks" },
    { label: "Points history", value: "pointsHistory" },
  ];

  const {
    data: taskData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getTasks"],
    queryFn: getAllTasks,
  });

  const { data: inviteCodesData } = useQuery({
    queryKey: ["getInviteCode"],
    queryFn: getInviteCode,
  });

  const {
    data: pointHistoryData,
    isLoading: pointsHistoryIsLoading,
    isError: pointsHistoryIsError,
    error: pointsHistoryError,
  } = useQuery({
    queryKey: ["getPointsHistory"],
    queryFn: apiGetPointsHistory,
  });

  console.log("pointHistoryData", pointHistoryData);
  return (
    <ProfilePanelHeaders
      panelHeader={`My Profile`}
      panelContent={
        <>
          <div className="flex flex-col align-middle justify-between">
            <UserCardV2 username={username} />

            <Tabs value="tasks">
              <div className="my-2">
                <TabsHeader className="appFont">
                  {tabsArr.map(({ label, value }) => (
                    <Tab
                      onClick={() => setSelectedTab(value)}
                      key={value}
                      value={value}
                    >
                      {label}
                    </Tab>
                  ))}
                </TabsHeader>
              </div>

              <TabsBody>
                {selectedTab === "tasks" && (
                  <>
                    {isLoading ? <LoadingAnimatedComponent /> : null}
                    {taskData && taskData?.message?.length > 0
                      ? taskData?.message?.map((task) => (
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
                  </>
                )}

                {selectedTab === "pointsHistory" && (
                  <>
                    {pointHistoryData && pointHistoryData?.message?.length > 0
                      ? pointHistoryData?.message?.slice(1).map((point, index) => (
                          <RewardV1
                            pointsId={index + 1}
                            pointsReason={point.reason}
                            pointsAmt={point.amount}
                            pointsDate={point.createdAt}
                          />
                        ))
                      : null}
                  </>
                )}
              </TabsBody>
            </Tabs>
          </div>
        </>
      }
    />
  );
};

export default ProfilePanelV2;
