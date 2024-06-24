import React, { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function CustomAccordion({
  className,
  customHeader,
  customBody,
  customOpen,
}) {
  const [open, setOpen] = useState(customOpen ? customOpen : 0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <div className={`${className} appFont opacity-100`}>
        <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
          <AccordionHeader onClick={() => handleOpen(1)}>
            {customHeader ? customHeader : ""}
          </AccordionHeader>
          <AccordionBody className="opacity-100 backdrop:fill-none">
            {" "}
            {customBody ? customBody : ""}{" "}
          </AccordionBody>
        </Accordion>
      </div>{" "}
    </>
  );
}
