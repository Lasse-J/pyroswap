import { createSlice } from '@reduxjs/toolkit'

export const amm = createSlice({
	name: 'amm',
	initialState: {
		contract: [null, null, null, null, null, null],
		shares: [0, 0, 0, 0, 0, 0],
		swaps: [[], [], [], [], [], []],
		swapping: {
			isSwapping: false,
			isSuccess: false,
			transactionHash: null
		}
	},
	reducers: {
		setAMMPairs: (state, action) => {
			state.contract = action.payload
		},
		sharesLoaded: (state, action) => {
			state.shares = action.payload
		},
		swapRequest: (state, action) => {
			state.swapping.isSwapping = true
			state.swapping.isSuccess = false
			state.swapping.transactionHash = null
		},
		swapSuccess: (state, action) => {
			state.swapping.isSwapping = false
			state.swapping.isSuccess = true
			state.swapping.transactionHash = action.payload
		},
		swapFail: (state, action) => {
			state.swapping.isSwapping = false
			state.swapping.isSuccess = false
			state.swapping.transactionHash = null
		}
	}
})

export const {
	setAMMPairs,
	sharesLoaded,
	swapRequest,
	swapSuccess,
	swapFail
} = amm.actions;

export default amm.reducer;
