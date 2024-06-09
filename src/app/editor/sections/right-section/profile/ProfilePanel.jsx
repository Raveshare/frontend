import React, { useContext, useEffect, useState } from "react";
import { LogoutBtn, ProfilePanelHeaders } from "./components";
import iconTrending from "./assets/svgs/iconTrending.svg";
import {
  Tabs,
  Tab,
  TabsHeader,
  Select,
  Option,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import BsGift from "@meronex/icons/bs/BsGift";
import MdcStarFourPointsOutline from "@meronex/icons/mdc/MdcStarFourPointsOutline";
import {
  CardsHeading,
  LensCard,
  TasksCard,
  UserCard,
} from "./components/Cards";
import { useUser } from "../../../../../hooks/user";
import {
  getAllTasks,
  getInviteCode,
} from "../../../../../services/apis/BE-apis";
import { ErrorComponent } from "../../../common";
import { Context } from "../../../../../providers/context";
import HiOutlineArrowNarrowRight from "@meronex/icons/hi/HiOutlineArrowNarrowRight";

const ProfilePanel = () => {
  const { setMenu } = useContext(Context);
  const { username } = useUser();
  const [tasksArr, setTasksArr] = useState([]);
  const [inviteCodesArr, setInviteCodesArr] = useState([]);
  const [selectedTab, setSelectedTab] = useState("tasks");
  const [openedModal, setOpenedModal] = useState("");

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

  return (
    <ProfilePanelHeaders
      // panelHeader={`Hi @${username || "username"}`}
      panelHeader={`My Profile`}
      panelContent={
        <>
          <div className="flex flex-col align-middle justify-between">
            <UserCard username={username} />

            <div className="flex m-2">
              <div className="ml-2 text-base font-semibold"> Invite Codes </div>
              {/* <div className="ml-4 mt-0.5">{inviteCodeList}</div> */}

              {inviteCodeList && (
                <Select className="" label={"Choose an Invite code"}>
                  {inviteCodeList.map((val) => {
                    return <Option>{val}</Option>;
                  })}
                </Select>
              )}
            </div>

            <hr className="mb-2" />

            {/* <CardsHeading
              name="Trending"
              iconImg={iconTrending && iconTrending}
            /> */}
            <LensCard />

            <Tabs className="overflow-scroll my-2" value={selectedTab}>
              <TabsHeader className="relative top-0 mx-2 mb-4">
                <Tab
                  value="tasks"
                  className="appFont"
                  onClick={() => setSelectedTab("tasks")}
                >
                  <CardsHeading
                    name="Tasks"
                    icon={<MdcStarFourPointsOutline />}
                  />
                </Tab>

                <Tab
                  value="rewards"
                  className="appFont"
                  onClick={() => setSelectedTab("rewards")}
                >
                  <CardsHeading name="Rewards" icon={<BsGift />} />
                </Tab>
              </TabsHeader>

              {isLoading && (
                <div className="flex justify-center m-8"> Loading... </div>
              )}
              {selectedTab === "tasks" && (
                <>
                  {isError && <ErrorComponent error={error} />}
                  {taskList &&
                    taskList?.map(
                      (task) =>
                        // display only the tasks that are not completed
                        !task?.completed && (
                          <div
                            onClick={() => {
                              setOpenedModal(task?.tag);
                            }}
                          >
                            <TasksCard
                              modalName={task?.tag}
                              isCompleted={task?.completed}
                              // CardHead={task?.description.split(/\\n/)[0]}
                              // CardSubHead={task?.description.split(/\\n/)[1]}
                              CardHead={task?.name}
                              CardSubHead={task?.description}
                              NoOfPoints={task?.amount}
                            />
                          </div>
                        )
                    )}
                </>
              )}

              {selectedTab === "rewards" && (
                <>
                  {isError && <ErrorComponent error={error} />}
                  {taskList &&
                    taskList?.map(
                      (task) =>
                        // display only the tasks that are completed
                        task?.completed && (
                          <TasksCard
                            modalName={task?.tag}
                            isCompleted={task?.completed}
                            // onClickFn={}
                            // CardHead={task?.description.split(/\\n/)[0]}
                            // CardSubHead={task?.description.split(/\\n/)[1]}
                            CardHead={task?.name}
                            CardSubHead={task?.description}
                            NoOfPoints={task?.amount}
                          />
                        )
                    )}
                </>
              )}
            </Tabs>
          </div>
          <div
            className="flex flex-row align-middle justify-center cursor-pointer hover:opacity-0.5"
            onClick={() => setMenu("allTasksnRewards")}
          >
            <div className="mr-0.5">View all</div>
            <HiOutlineArrowNarrowRight className="m-1" />
          </div>
        </>
      }
    />
  );
};

export default ProfilePanel;
