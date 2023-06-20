import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import BiChevronRight from "@meronex/icons/bi/BiChevronRight";
import { ShareIcon } from "../editor-icon";
import MdcCalendarClock from "@meronex/icons/mdc/MdcCalendarClock";
import BsLink45Deg from "@meronex/icons/bs/BsLink45Deg";
import { Switch } from "@headlessui/react";

// New Imports :
// import { DatePicker, Space } from "antd"
import { DateTimePicker } from "@atlaskit/datetime-picker";

export default function RightDrawer({}) {
	const [open, setOpen] = useState(false);
	const [menu, setMenu] = useState("share");
	const [stIsActive, setStIsActive] = useState("false")

	return (
		<>
			<button onClick={() => setOpen(!open)}>
				<ShareIcon />
			</button>
			<Transition.Root show={open} as={Fragment}>
				<Dialog	as="div" className="relative z-10" onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-500"
						enterFrom="opacity-0"
						enterTo="opacity-0"
						leave="ease-in-out duration-500"
						leaveFrom="opacity-0"
						leaveTo="opacity-0">
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-hidden">
						<div className="absolute inset-0 overflow-scroll">
							<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 top-20">
								<Transition.Child
									as={Fragment}
									enter="transform transition ease-in-out duration-500 sm:duration-700"
									enterFrom="translate-x-full"
									enterTo="translate-x-0"
									leave="transform transition ease-in-out duration-500 sm:duration-700"
									leaveFrom="translate-x-0"
									leaveTo="translate-x-full">
									<Dialog.Panel className="pointer-events-auto relative w-screen max-w-sm">
										<Transition.Child
											as={Fragment}
											enter="ease-in-out duration-500"
											enterFrom="opacity-0"
											enterTo="opacity-100"
											leave="ease-in-out duration-500"
											leaveFrom="opacity-100"
											leaveTo="opacity-0">
											<div className="">
												<div className="absolute left-0 top-0  flex flex-col items-center justify-center">
													<div
														className="-ml-32 flex items-center justify-center flex-col"
														onClick={() =>{
															setMenu("share");
														}}>
														<button className={`${menu == "share" ? "bg-black" : "bg-white"} h-12 w-12 rounded-full outline-none`}>
															{/* <ShareIcon /> */}
														</button>
														<p>Share</p>
													</div>
													<div
														className="-ml-32 flex items-center justify-center flex-col"
														onClick={() =>{ 
															setMenu("monetization"); setStIsActive(!stIsActive)
														} 
															
														}>
														<button className={`${ menu== "monetization"? "bg-black" : "bg-white"} h-12 w-12 rounded-full outline-none`}>
															{/* <ShareIcon /> */}
														</button>
														<p className="w-20 text-center">
															Monetization
															
														</p>
													</div>
													<div className="-ml-32 flex items-center justify-center flex-col"
														onClick={() =>{
															setMenu("post"); 
														}}>
														<button className={`${menu == "post" ? "bg-[#E1F26C]" : "bg-white"} h-12 w-12 rounded-full outline-none`}>
															{/* <ShareIcon /> */}
														</button>
														<p className="w-20 text-center">
															Comment & Mirror
														</p>
													</div>
												</div>
												<div className="absolute left-0 top-1/2 flex -ml-5 flex-col items-center justify-center">
													<button
														type="button"
														className="rounded-xl outline-none "
														onClick={() =>
															setOpen(false)
														}>
														<BiChevronRight className="h-10 w-6 bg-white rounded-sm" />
													</button>
												</div>
											</div>
										</Transition.Child>
										{menu === "share" && <Share />}
										{menu === "monetization" && (
											<Monetization />
										)}
										{/* {menu === "post" && <Post />} */}
										{menu === "post" && <Post />} 
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}

const Share = () => {
	
	const [stShareClicked, setStShareClicked] = useState(false)
	const [stCalendarClicked, setStCalendarClicked] = useState(false)
	const [stSelectedDateTime, setStSelectedDateTime] = useState()
	const [stFormattedDate , setStFormattedDate] = useState("")
	const [stFormattedTime , setStFormattedTime] = useState("")


	// Calendar Functions: 
	const onCalChange = (value, dateString) => {
		console.log("Selected Time: ", value)
		console.log("Formatted Selected Time: ", dateString)
		setStSelectedDateTime(value)

		const dateTime = new Date(stSelectedDateTime);

		// Format the date
		const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		setStFormattedDate(dateTime.toLocaleDateString(undefined, dateOptions));
	
		// Format the time
		const timeOptions = { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
		setStFormattedTime(dateTime.toLocaleTimeString(undefined, timeOptions));
	
	  }
	

		

	return (
		<div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
			<div className="">
				<Dialog.Title className="w-full text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10">
					Share this Design
				</Dialog.Title>
			</div>
			<div className="relative mt-16 px-4 pt-2 pb-1 sm:px-6">
				<div className="space-y-4">
					<div className="flex items-center justify-between"></div>
					<div className="space-x-4">
						<textarea className="border border-b-8 w-full h-40" />
					</div>
					<div className="flex items-center justify-between ">
						<div onClick={() => {setStShareClicked(!stShareClicked); setStCalendarClicked(false);}} className="flex items-center justify-center w-full text-md bg-[#E1F26C]  py-2 h-10 rounded-md cursor-pointer">
							<BsLink45Deg className="m-2"/>
							Share Now
						</div>
						<div onClick={()=> {setStCalendarClicked(!stCalendarClicked); setStShareClicked(true);}} className=" ml-4 py-2 rounded-md cursor-pointer">
							<MdcCalendarClock className="h-10 w-10" />
						</div>
					</div>
				</div>
			</div>
			
			{/* Calender For Schedule - 18Jun2023 */}
			<div className={`${stCalendarClicked? "visible" : "collapse"} ml-6 mr-6 mb-4`}>
				<div className="m-1">
					Choose schedule time and date
				</div>
				<DateTimePicker className="m-4" onChange={onCalChange}/> 
			</div>

			<div className={`${stCalendarClicked? "visible" : "collapse"} flex flex-col m-2 ml-8`}>
				<div className="mt-3 mb-3">Scheduled</div>
				<div className="flex flex-row border-l-8 border-l-[#E1F26C] p-4"> 
					<div className="flex flex-col">
						<div className="text-4xl text-[#E699D9]">{stFormattedDate.slice(0,2)}</div>
						<div className="text-lg text-[#2D346C]">{stFormattedDate.slice(2)}</div>
					</div> 
					
					<div className="flex flex-col ml-4">
						<div className="m-2"><input type="text" className="border" placeholder="Canvas name"/></div>
						<div className="ml-2 mt-2">{stFormattedTime}</div>
					</div>
				</div>
			</div>

			{/* Share - Icons - 18Jun2023 */}
			<hr />
			<div className={`relative mt-6 px-4 sm:px-6 ${stShareClicked == true? "visible": "collapse" }`}>
				<p className="text-lg">Share on socials</p>
				<div className="flex items-center justify-center space-x-12 py-5">
					<div> <img className="w-10 cursor-pointer" src="/other-icons/iconLens.png" alt="Lens" /> </div>
					<div> <img className="w-10 cursor-pointer" src="/other-icons/iconTwitter.png" alt="Twitter" /> </div>
					{/* <div>Lens</div>
					<div>Lens</div>
					<div>Lens</div> */}
				</div>
			</div>
			<hr />
		</div>
	);
};

const Monetization = () => {
	const [enabled, setEnabled] = useState(false);
	return (
		<div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
			<div className="">
				<Dialog.Title className="w-full text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10">
					Monetization Settings
				</Dialog.Title>
			</div>
			<div className="relative px-4 pt-2 pb-4 sm:px-6 mt-24">
				<div className="">
					<div className="flex flex-col justify-between">	
						<Switch.Group>
							<div className="flex items-center mb-4">
								<Switch
									checked={enabled}
									onChange={setEnabled}
									className={`${
										enabled ? "bg-blue-600" : "bg-gray-200"
									} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
									<span
										className={`${
											enabled
												? "translate-x-6"
												: "translate-x-1"
										} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
									/>
								</Switch>
								<Switch.Label className="ml-4">
									Enable notifications
								</Switch.Label>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">
									Charge for collecting
								</h2>
								<Switch
									checked={enabled}
									onChange={setEnabled}
									className={`${
										enabled ? "bg-blue-600" : "bg-gray-200"
									} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
									<span
										className={`${
											enabled
												? "translate-x-6"
												: "translate-x-1"
										} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
									/>
								</Switch>
								<Switch.Label className="ml-4">
									Get paid when someone collects your post
								</Switch.Label>
								<div className="flex">
									<div className="flex flex-col w-1/2 p-2">
										<label htmlFor="price">Price</label>
										<input
											className="border border-black rounded-md p-2"
											type="number"
											min={"0"}
											step={"0.01"}
											placeholder="0.0$"
										/>
									</div>
									<div className="flex flex-col w-1/2 p-2">
										<label htmlFor="price">Currency</label>
										<select
											name="cars"
											id="cars"
											placeholder="Wrapped Matic"
											className="border border-black rounded-md p-2">
											<option value="wmatic">
												Wrapped MATIC
											</option>
											<option value="weth">
												Wrapped ETH
											</option>
											<option value="dai">DAI</option>
											<option value="usdc">USDC</option>
										</select>
									</div>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">
									Mirror referral award
								</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Share your fee with people who amplify
										your content
									</Switch.Label>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">
									Limited Edition
								</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Make the collects exclusive
									</Switch.Label>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">Time Limit</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Limit collecting to first 24 hours
									</Switch.Label>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">Split Revenue</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Set multiple recipients for the collect
										fee
									</Switch.Label>
								</div>
							</div>
							<div className="mb-4">
								<h2 className="text-lg mb-2">
									Who can collect
								</h2>
								<div className="flex">
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${
											enabled
												? "bg-blue-600"
												: "bg-gray-200"
										} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
										<span
											className={`${
												enabled
													? "translate-x-6"
													: "translate-x-1"
											} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
										/>
									</Switch>
									<Switch.Label className="ml-4">
										Only followers can collect
									</Switch.Label>
								</div>
							</div>
						</Switch.Group>
					</div>
				</div>
			</div>
		</div>
	);
};

const Post = () => {
	return <>
		<div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"> 

			<Dialog.Title className="w-full text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10">
				Comment and Mirror
			</Dialog.Title>

			Under DEV
			<div className="mt-24">
			

			</div> 

		</div>
	</>;
};
