import React, { useContext, useEffect, useState } from 'react'
import { addressCrop, clearAllLocalStorageData, getAvatar, getFromLocalStorage } from '../../../../../utils'
import { useAccount, useDisconnect } from 'wagmi'
import { toast } from 'react-toastify'
import { Context } from '../../../../../providers/context/ContextProvider'
import { Typography, Button, Menu, MenuHandler, MenuList, MenuItem, Avatar } from '@material-tailwind/react'

import { useSolanaWallet } from '../../../../../hooks/solana'
import { useLogout } from '../../../../../hooks/app'
import { isMobile as useIsMobile } from '../../../../../hooks/app/useIsMobile'

const ProfileMenu = () => {
	const { solanaAddress } = useSolanaWallet()
	const [isMobile, setIsMobile] = useState(false)
	const { address } = useAccount()
	const { posthog } = useContext(Context)
	const { logout } = useLogout()

	useEffect(() => {
		setIsMobile(useIsMobile())
	}, [])

	const handleEVMAddressCopy = () => {
		navigator.clipboard.writeText(address)
		toast.success('address copied')
	}

	const handleSolanaAddressCopy = () => {
		navigator.clipboard.writeText(solanaAddress)
		toast.success('address copied')
	}

	const fnLogout = () => {
		logout()
		toast.success('Logout successful')

		// TODO: clear all local storage data + states
	}

	// state for profile menu items
	const profileMenuItems = [
		{
			label: address && addressCrop(address),
			icon: ClipboardIcon,
			onClick: handleEVMAddressCopy,
			shouldRender: address ? true : false,
		},
		{
			label: solanaAddress && addressCrop(solanaAddress),
			icon: ClipboardIcon,
			onClick: handleSolanaAddressCopy,
			shouldRender: solanaAddress ? true : false,
		},
		{
			label: 'Discord',
			icon: null,
			image: '/topbar-icons/iconDiscord.svg',
			onClick: () => {
				window.open('https://discord.gg/yHMXQE2DNb', '_blank')
			},
			shouldRender: isMobile ? true : false,
		},
		{
			label: 'Logout',
			icon: PowerIcon,
			onClick: fnLogout,
			shouldRender: true,
		},
	]

	return (
		<Menu placement="bottom-end">
			<MenuHandler>
				<Avatar variant="circular" alt="profile picture" className="cursor-pointer w-10 h-10 outline outline-black" src={getAvatar(address || solanaAddress)} />
			</MenuHandler>
			<MenuList className="p-1 mt-2">
				{profileMenuItems
					.filter((item) => item.shouldRender === true)
					.map(({ label, icon, image, onClick }, key) => {
						const isLastItem = label === 'Logout'
						return (
							<div className="outline-none" key={label}>
								{isLastItem && <hr className="my-2 border-blue-gray-50" />}
								<MenuItem
									key={label}
									onClick={onClick}
									className={`flex items-center gap-2 rounded ${isLastItem ? 'hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10' : ''}`}
								>
									{icon &&
										React.createElement(icon, {
											className: `h-4 w-4 ${isLastItem ? 'text-red-500' : ''}`,
											strokeWidth: 2,
										})}
									{image && <img src={image} alt="" className="w-5" />}

									<Typography as="span" variant="small" className="font-normal" color={isLastItem ? 'red' : 'inherit'}>
										{label}
									</Typography>
								</MenuItem>
							</div>
						)
					})}
			</MenuList>
		</Menu>
	)
}

export default ProfileMenu
