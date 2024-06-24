import React, { useEffect, useRef, useState } from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { InputBox } from "../../../../../common";
import BiSearchAlt2 from "@meronex/icons/bi/BiSearchAlt2";
import { searchChannelFar } from "../../../../../../../services/apis/BE-apis";
import { useMutation } from "@tanstack/react-query";
import FaRegDotCircle from "@meronex/icons/fa/FaRegDotCircle";

const FarcasterChannel = ({ channelState, setChannelState }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const [data, setData] = useState([]);
  const requestTimeout = useRef();

  const { mutateAsync, isError, error, isLoading } = useMutation({
    mutationKey: "searchChannel",
    mutationFn: searchChannelFar,
  });

  const searchChannel = async () => {
    if (!query) return;
    setOpen(true);

    mutateAsync(delayedQuery)
      .then((res) => {
        setData(res?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query?.split(" ").join("-").toLowerCase());
    }, 2000);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  useEffect(() => {
    if (delayedQuery) {
      searchChannel();
    }
    if (!query) {
      setOpen(false);
    }
  }, [query, delayedQuery]);

  return (
    <>
      <div className="relative flex w-full max-w-[24rem]">
        <InputBox
          label="Search channel"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {open && (
        <Card>
          {isLoading ? (
            <List>
              <ListItem className="flex justify-center items-center gap-2">
                <Typography variant="h6" color="blue-gray">
                  Loading...
                </Typography>
                <Spinner color="green" />
              </ListItem>
            </List>
          ) : data?.length === 0 ? (
            <List>
              <ListItem className="flex justify-center items-center">
                <Typography variant="h6" color="blue-gray">
                  No channel found
                </Typography>
              </ListItem>
            </List>
          ) : (
            data?.length > 0 &&
            data.map((item) => (
              <List key={item?.id}>
                <ListItem
                  onClick={() => {
                    setChannelState(item);
                    setOpen(false);
                  }}
                >
                  <ListItemPrefix>
                    <Avatar
                      variant="circular"
                      alt="candice"
                      src={item?.image_url}
                      className="w-10 h-10"
                    />
                  </ListItemPrefix>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      {item?.name}
                    </Typography>
                  </div>
                </ListItem>
              </List>
            ))
          )}
        </Card>
      )}

      {channelState && (
        <Card className="mt-2">
          <List>
            <ListItem>
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center">
                  <ListItemPrefix>
                    <Avatar
                      variant="circular"
                      alt="candice"
                      src={channelState?.image_url}
                      className="w-10 h-10"
                    />
                  </ListItemPrefix>

                  <Typography variant="h6" color="blue-gray">
                    {channelState?.name}
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <FaRegDotCircle className="text-green-500" />
                </div>
              </div>
            </ListItem>
          </List>
        </Card>
      )}
    </>
  );
};

export default FarcasterChannel;
