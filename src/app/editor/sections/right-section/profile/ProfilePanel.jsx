import React, { useContext, useEffect, useState } from "react";
import { ProfilePanelHeaders } from "./components";
import { Tabs, Tab, TabsHeader, TabsBody } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { TaskCardV2 } from "./components/Cards";
import { useUser } from "../../../../../hooks/user";
import {
  apiGetPointsHistory,
  getAllTasks,
  getInviteCode,
} from "../../../../../services/apis/BE-apis";
import {
  CustomAccordion,
  ErrorComponent,
  LoadingAnimatedComponent,
} from "../../../common";
import { Context } from "../../../../../providers/context";
import UserCard from "./components/Cards/UserCard";

import farcasterLogo from "../../../../../assets/logos/logoFarcaster.jpg";
import PointHistoryCard from "./components/Cards/PointHistoryCard";

const ProfilePanel = () => {
  const { setMenu } = useContext(Context);
  const { username } = useUser();

  const [selectedTab, setSelectedTab] = useState("tasks");
  const [groupedTasks, setGroupedTasks] = useState({});

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
  const taskList = taskData?.message;
  const {
    data: pointHistoryData,
    isLoading: pointsHistoryIsLoading,
    isError: pointsHistoryIsError,
    error: pointsHistoryError,
  } = useQuery({
    queryKey: ["getPointsHistory"],
    queryFn: apiGetPointsHistory,
  });

  // Group the tasks by campaign :
  const fnGroupTaskByCampaign = async () => {
    setGroupedTasks(
      await taskData?.message?.reduce((acc, task) => {
        const campaignKey = task.campaign || "Poster";
        if (!acc[campaignKey]) {
          acc[campaignKey] = [];
        }
        acc[campaignKey].push(task);
        return acc;
      }, {})
    );
  };

  useEffect(() => {
    fnGroupTaskByCampaign();
  }, [taskData]);

  return (
    <ProfilePanelHeaders
      panelHeader={`My Profile`}
      panelContent={
        <>
          <div className="flex flex-col align-middle justify-between">
            <UserCard username={username} />

            <Tabs value="tasks">
              <div className="my-1">
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
                    {!isLoading && (
                      <div>
                        {/* Mapping the grouped tasks and then internal mapping the tasks */}
                        {groupedTasks &&
                          Object.entries(groupedTasks).map(
                            ([campaign, tasks], index) => (
                              <div key={campaign} className="mx-2">
                                {/* Accordion for each campaign / group */}
                                <CustomAccordion
                                  // customOpen - index of the `groupedTasks` that is to be open by default
                                  // customOpen={campaign === "farcaster" ? 1 : 0}   // can also be opened by campaign name
                                  customOpen={index === 0 ? 1 : 0}
                                  customHeader={
                                    <>
                                      <div className="flex items-center gap-2">
                                        <div className="">
                                          {campaign === "farcaster" && (
                                            <img
                                              src={farcasterLogo} // Assuming this is the same for all tasks
                                              alt={`${campaign} Tasks`}
                                              className="w-6 h-6 rounded-xl"
                                            />
                                          )}
                                        </div>
                                        <div>{`${campaign
                                          .slice(0, 1)
                                          .toUpperCase()}${campaign.slice(
                                          1
                                        )} Tasks`}</div>
                                      </div>
                                    </>
                                  }
                                  customBody={
                                    <>
                                      {tasks.length > 0
                                        ? tasks.map((task, index) =>
                                            !task.isRecurring ? (
                                              <TaskCardV2
                                                key={index}
                                                // taskId={task.id}
                                                taskId={index + 1} // Just to display the task number on FE, internally we use `task.id` Itself
                                                taskAmount={task.amount}
                                                isReward={task.isReward}
                                                isCompleted={task.completed}
                                                taskName={task.name}
                                                taskDesc={task.description}
                                              />
                                            ) : null
                                          )
                                        : null}
                                    </>
                                  }
                                />
                              </div>
                            )
                          )}
                      </div>
                    )}
                  </>
                )}

                {selectedTab === "pointsHistory" && (
                  <>
                    {pointHistoryData && pointHistoryData?.message?.length > 0
                      ? pointHistoryData?.message
                          ?.slice(1)
                          .reverse()
                          .map((point, index) => (
                            <PointHistoryCard
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

export default ProfilePanel;
