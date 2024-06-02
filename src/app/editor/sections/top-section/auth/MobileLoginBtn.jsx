import React from 'react'
import { Button } from '@material-tailwind/react'
import { useContext } from 'react'
import { Context } from '../../../../../providers/context'

function MobileLoginBtn() {
	const { setOpenedLoginModal } = useContext(Context)
	return (
		<>
			<div className="md:hidden flex items-center">
				<Button size="lg" color="black" className="flex items-center justify-center gap-3 outline-none my-2" onClick={() => setOpenedLoginModal(true)}>
					Login
				</Button>
			</div>
		</>
	)
}

export default MobileLoginBtn
