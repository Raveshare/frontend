import React, { useContext, useState } from 'react'
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography, IconButton, Spinner, Checkbox } from '@material-tailwind/react'
import { EVMWallets, SolanaWallets } from './wallets'
import { Context } from '../../../../../providers/context'

const LoginModal = () => {
	const { openedLoginModal, setOpenedLoginModal } = useContext(Context)
	const handleOpen = () => setOpenedLoginModal(!openedLoginModal)

	return (
		<>
			<Dialog
				size="sm"
				open={openedLoginModal}
				animate={{
					mount: { scale: 1, y: 0 },
					unmount: { scale: 0.9, y: -100 },
				}}
				className="outline-none"
			>
				<DialogHeader className="gap-2 border-b border-gray-300">
					<Typography variant="h5" color="blue-gray">
						Login With
					</Typography>
				</DialogHeader>
				<DialogBody className="flex flex-row gap-5 justify-center items-center">
					<SolanaWallets />
					<EVMWallets />
				</DialogBody>
				<DialogFooter>
					<Button color="lenspostLime" onClick={handleOpen} ripple="light" className="ml-4 outline-none bg-[#e1f16b] text-black">
						Close
					</Button>
				</DialogFooter>
			</Dialog>
		</>
	)
}

export default LoginModal
