import React, { createContext, useRef, useState } from 'react'
import posthog from 'posthog-js'

posthog.init('phc_CvXLACFkyLdhJjiGLxlix6ihbGjumRvGjUFSinPWJYD', {
	api_host: 'https://eu.posthog.com',
})

export const Context = createContext()

const ContextProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [text, setText] = useState('')
	const contextCanvasIdRef = useRef(null)
	const canvasBase64Ref = useRef([])
	const [postName, setPostName] = useState('')
	const [postDescription, setPostDescription] = useState('')
	const [open, setOpen] = useState(false)

	// Modal: MyDesign Section
	const [designModal, setDesignModal] = useState(false)

	// Profile Panel
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const [openedProfileModal, setOpenedProfileModal] = useState(false)
	const [openedLoginModal, setOpenedLoginModal] = useState(false)
	const [openedModalName, setOpenedModalName] = useState('')

	// User data from Profile panel
	const [userProfileDetails, setUserProfileDetails] = useState({
		email: '',
		username: '',
		points: '',
		lens_handle: '',
	})

	// for twitter auth
	const [queryParams, setQueryParams] = useState({
		oauth_token: '',
		oauth_verifier: '',
	})

	// for open different menu in share

	const [menu, setMenu] = useState('share')

	// Lens Share tab
	const [lensTab, setLensTab] = useState('normalPost')

	// solana Share tab
	const [solanaTab, setSolanaTab] = useState('cnft')

	// Farcaster Share tab
	const [farcasterTab, setFarcasterTab] = useState('normalPost')

	// Zora Mint Tab
	const [zoraTab, setZoraTab] = useState('ERC721')

	// for lens monetization
	const [enabled, setEnabled] = useState({
		chargeForCollect: false,
		chargeForCollectPrice: '1',
		chargeForCollectCurrency: 'WMATIC',

		mirrorReferralReward: false,
		mirrorReferralRewardFee: 25.0,

		splitRevenueRecipients: [
			{
				recipient: '',
				split: 0.0,
			},
		],

		limitedEdition: false,
		limitedEditionNumber: '1',

		timeLimit: false,
		endTimestamp: {
			date: '',
			time: '',
		},

		whoCanCollect: false,
	})

	const [enabledSmartPost, setEnabledSmartPost] = useState({
		chargeForCollect: false,
		chargeForCollectPrice: '1',
		chargeForCollectCurrency: 'WMATIC',

		limitedEdition: false,
		limitedEditionNumber: '1',
	})

	const [solanaEnabled, setSolanaEnabled] = useState({
		isChargeForMint: true,
		chargeForMintPrice: '',
		chargeForMintCurrency: 'SOL',

		// Array of List of Contract Addresses / Input Boxes
		isOnChainSplits: true,
		onChainSplitRecipients: [
			{
				address: '',
				share: null,
			},
		],

		isSellerFeeBasisPoints: true,
		sellerFeeBasisPoints: '',

		isLimitedEdition: true,
		limitedEditionNumber: '',

		isTimeLimit: false,
		startTimeStamp: {
			date: '',
			time: '',
		},
		endTimestamp: {
			date: '',
			time: '',
		},

		isAllowlist: false,
		allowlistAddresses: [''],

		isNftBurnable: false,
		nftBurnableContractAddresses: [''],

		isNftGate: false,
		nftGateContractAddresses: [''],

		isTokenGate: false,
		tokenGateContractAddresses: [''],
	})

	const [solanaStatesError, setSolanaStatesError] = useState({
		isChargeForMintError: false,
		chargeForMintErrorMessage: '',

		isSplitError: false,
		splitErrorMessage: '',

		isSellerFeeError: false,
		sellerFeeErrorMessage: '',

		isLimitedEditionError: false,
		limitedEditionErrorMessage: '',

		isTimeLimitError: false,
		timeLimitErrorMessage: '',

		isAllowlistError: false,
		allowlistErrorMessage: '',

		isNftBurnableError: false,
		nftBurnableErrorMessage: '',

		isNftGateError: false,
		nftGateErrorMessage: '',

		isTokenGateError: false,
		tokenGateErrorMessage: '',
	})

	const [zoraErc721Enabled, setZoraErc721Enabled] = useState({
		isContractDetails: false,
		contractName: '',
		contractSymbol: '',

		isChargeForMint: false,
		chargeForMintPrice: '',
		chargeForMintCurrency: 'ETH',

		isMintLimitPerAddress: false,
		mintLimitPerAddress: '',

		isRoyaltySplits: true,
		royaltySplitRecipients: [
			{
				address: '',
				percentAllocation: null,
			},
		],

		isRoyaltyPercent: true,
		royaltyPercent: '',

		isMaxSupply: false,
		maxSupply: '',

		isAllowlist: false,
		allowlistAddresses: [''],

		isPreSaleSchedule: false,
		preSaleStartTimeStamp: {
			date: '',
			time: '',
		},
		preSaleEndTimeStamp: {
			date: '',
			time: '',
		},

		isPublicSaleSchedule: false,
		publicSaleStartTimeStamp: {
			date: '',
			time: '',
		},

		publicSaleEndTimeStamp: {
			date: '',
			time: '',
		},

		// split contract address
		fundRecipientAddress: '',
	})

	const [zoraErc1155Enabled, setZoraErc1155Enabled] = useState({
		isContractDetails: false,
		contractName: '',
		contractSymbol: '',

		isChargeForMint: false,
		chargeForMintPrice: '',
		chargeForMintCurrency: '',

		isLimitedEdition: false,
		limitedEditionNumber: '',

		isMintLimitPerAddress: false,
		mintLimitPerAddress: '',

		isScheduleMint: false,
		scheduleMintTimeStamp: {
			date: '',
			time: '',
		},

		isRoyaltySplits: true,
		royaltySplitRecipients: [
			{
				address: '',
				share: null,
			},
		],

		isRoyaltyPercent: false,
		royaltyPercent: '',

		isMaxSupply: false,
		maxSupply: '',

		isPresaleSchedule: false,
		preSaleStartTimeStamp: {
			date: '',
			time: '',
		},
		preSaleEndTimeStamp: {
			date: '',
			time: '',
		},

		isPublicSaleSchedule: false,
		publicSaleStartTimeStamp: {
			date: '',
			time: '',
		},

		publicSaleEndTimeStamp: {
			date: '',
			time: '',
		},
	})

	const [zoraErc721StatesError, setZoraErc721StatesError] = useState({
		isContractNameError: false,
		contractNameErrorMessage: '',

		isContractSymbolError: false,
		contractSymbolErrorMessage: '',

		isChargeForMintError: false,
		chargeForMintErrorMessage: '',

		isLimitedEditionError: false,
		limitedEditionErrorMessage: '',

		isMintLimitPerAddressError: false,
		mintLimitPerAddressMessage: '',

		isScheduleMintError: false,
		scheduleMintErrorMessage: '',

		isRoyaltySplitError: false,
		royaltySplitErrorMessage: '',

		isRoyaltyPercentError: false,
		royaltyPercentErrorMessage: '',

		isMaxSupplyError: false,
		maxSupplyErrorMessage: '',

		isAllowlistError: false,
		allowlistErrorMessage: '',

		isPresaleScheduleError: false,
		presaleScheduleErrorMessage: '',

		isPublicsaleScheduleError: false,
		publicsaleScheduleErrorMessage: '',
	})

	const [zoraErc1155StatesError, setZoraErc1155StatesError] = useState({
		isChargeForMintError: false,
		chargeForMintErrorMessage: '',

		isLimitedEditionError: false,
		limitedEditionErrorMessage: '',

		isMintLimitPerAddressError: false,
		mintLimitPerAddressMessage: '',

		isScheduleMintError: false,
		scheduleMintErrorMessage: '',

		isRoyaltySplitError: false,
		royaltySplitErrorMessage: '',

		isRoyaltyPercentError: false,
		royaltyPercentErrorMessage: '',

		isMaxSupplyError: false,
		maxSupplyErrorMessage: '',

		isPresaleScheduleError: false,
		presaleScheduleErrorMessage: '',

		isPublicsaleScheduleError: false,
		publicsaleScheduleErrorMessage: '',
	})

	const [farcasterStates, setFarcasterStates] = useState({
		isFarcasterAuth: false,

		isChannel: false,
		channel: '',

		frameData: {
			isFrame: false,

			isGateWith: false,
			isLike: false,
			isRecast: false,
			isFollow: false,

			allowedMints: '',
			allowedMintsIsError: false,
			allowedMintsError: '',

			isCreatorSponsored: false,

			isTopup: false,
			isSufficientBalance: false,

			isExternalLink: false,
			externalLink: '',

      isExternalLinkError: false,
      externalLinkError: "",

      isCustomCurrMint: false,

      customCurrAmount: 1,

      isCustomCurrAmountError: false,
      customCurrAmountError: "",

      customCurrSymbol: "",
      customCurrAddress: "",

      fcSplitRevenueRecipients: [
        {
          address: "",
          percentAllocation: null,
        },
      ],

      // split recipient error
      isFcSplitError: false,
      fcSplitErrorMsg: "",

      selectedNetwork: {
        id: "",
        name: "",
      },
    },
  });

	// for calendar
	const [stFormattedDate, setStFormattedDate] = useState('')
	const [stFormattedTime, setStFormattedTime] = useState('')
	const [stCalendarClicked, setStCalendarClicked] = useState(false)

	// for preview
	const [fastPreview, setFastPreview] = useState([])

	// for split revenue eligible address/recipient
	const referredFromRef = useRef([])

	// owner address of canvas
	const canvasOwnerAddressRef = useRef('')

	// NOTE: dataRefs has elementId and handle data {elementId: "elementId", handle: "handle"}

	// elementId and handle data for lens collect nft
	const lensCollectNftRecipientDataRef = useRef([])

	// elementId and handle data for assets nft
	const assetsRecipientDataRef = useRef([])

	// elementId and handle data for nfts
	const nftRecipientDataRef = useRef([])

	// elementId and handle data for BG remover nft
	const bgRemoverRecipientDataRef = useRef([])

	// elementId and handle data getting from BE
	const preStoredRecipientDataRef = useRef([])

	// It has all the DataRefs data
	const parentRecipientDataRef = useRef([])

	// It hass all the recipients list (kind of final recipient list but some address/)
	const parentRecipientListRef = useRef([])

	// Right Sidebar
	const [isShareOpen, setIsShareOpen] = useState(false)

	// for lens monetization price error
	const [priceError, setPriceError] = useState({
		isError: false,
		message: '',
	})

	// for lens monetization split error
	const [splitError, setSplitError] = useState({
		isError: false,
		message: '',
	})

	// for lens monetization edition error
	const [editionError, setEditionError] = useState({
		isError: false,
		message: '',
	})

	// for lens monetization referral error
	const [referralError, setReferralError] = useState({
		isError: false,
		message: '',
	})

	// for explore dilog
	const [dialogOpen, setDialogOpen] = useState(false)
	const [explorerLink, setExplorerLink] = useState('')

	const handleOpen = () => setDialogOpen((cur) => !cur)

	// console.log("ContextProvider", solanaEnabled.onChainSplitRecipients);
	// states for lens data
	const [lensAuthState, setLensAuthState] = useState({
		lensProfileData: [],

		id: '',

		loading: {
			isLoading: false,
			text: '',
		},

		dispatcherStatus: false,
	})

	// console.log("ContextProvider", farcasterStates?.frameData);
	// console.log("ContextProvider", zoraErc721StatesError);

	return (
		<Context.Provider
			value={{
				isLoading,
				setIsLoading,
				text,
				setText,
				contextCanvasIdRef,
				canvasBase64Ref,

				// Modal: MyDesign Section
				designModal,
				setDesignModal,
				// User Profile Details
				userProfileDetails,
				setUserProfileDetails,

				// for modal in profile panel
				openedModalName,
				setOpenedModalName,

				//for mobile login modal
				openedLoginModal,
				setOpenedLoginModal,

				// for twitter auth
				queryParams,
				setQueryParams,

				// for open different menu in share
				menu,
				setMenu,

				// Lens Share tab
				lensTab,
				setLensTab,

				// Farcaster Share tab
				farcasterTab,
				setFarcasterTab,

				// for lens monetization
				enabled,
				setEnabled,
				postName,
				setPostName,

				postDescription,
				setPostDescription,
				open,
				setOpen,

				// For Profile Panel
				isProfileOpen,
				setIsProfileOpen,
				openedProfileModal,
				setOpenedProfileModal,

				// for calendar
				stFormattedDate,
				setStFormattedDate,
				stFormattedTime,
				setStFormattedTime,
				stCalendarClicked,
				setStCalendarClicked,

				// for preview
				fastPreview,
				setFastPreview,

				// Right Sidebar
				isShareOpen,
				setIsShareOpen,

				// user public templates states
				referredFromRef,

				// elementId and handle data for lens collect nft
				lensCollectNftRecipientDataRef,

				// elementId and handle data for assets nft
				assetsRecipientDataRef,

				// elementId and handle data for solana nfts nft
				nftRecipientDataRef,

				// elementId and handle data for BG remover nft
				bgRemoverRecipientDataRef,

				// elementId and handle data getting from BE
				preStoredRecipientDataRef,

				// It has all the DataRefs data
				parentRecipientDataRef,

				// It hass all the recipients list (kind of final recipient list but some address/)
				parentRecipientListRef,

				// for lens monetization price error
				priceError,
				setPriceError,

				// for lens monetization split error
				splitError,
				setSplitError,

				// for lens monetization edition error
				editionError,
				setEditionError,

				// for lens monetization referral error
				referralError,
				setReferralError,

				// posthog analytics
				posthog,

				// for solana mint
				solanaEnabled,
				setSolanaEnabled,

				// for solana mint error
				solanaStatesError,
				setSolanaStatesError,

				// for explorer dilog
				dialogOpen,
				setDialogOpen,
				explorerLink,
				setExplorerLink,
				handleOpen,

				// states for lens data
				lensAuthState,
				setLensAuthState,

				// for zora mint tab
				zoraTab,
				setZoraTab,

				// for zora erc721 edition tab
				zoraErc721Enabled,
				setZoraErc721Enabled,

				// for zora erc1155 edition mint
				zoraErc1155Enabled,
				setZoraErc1155Enabled,

				// for zora mint error
				zoraErc721StatesError,
				setZoraErc721StatesError,

				// for zora mint error
				zoraErc1155StatesError,
				setZoraErc1155StatesError,

				// For Lens Share - Smart Post
				enabledSmartPost,
				setEnabledSmartPost,

				// for farcaster
				farcasterStates,
				setFarcasterStates,

				// for solana tab
				solanaTab,
				setSolanaTab,
			}}
		>
			{children}
		</Context.Provider>
	)
}

export default ContextProvider
