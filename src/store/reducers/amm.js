import { createSlice } from '@reduxjs/toolkit'

export const amm = createSlice({
	name: 'amm',
	initialState: {
		contract: [null, null, null, null, null, null],
		shares: [0, 0, 0, 0, 0, 0],
		swaps: [[], [], [], [], [], []]
	},
	reducers: {
		setAMMPairs: (state, action) => {
			state.contract = action.payload
		},
		sharesLoaded: (state, action) => {
			state.shares = action.payload
		}
	}
})

export const { setAMMPairs, sharesLoaded } = amm.actions;

export default amm.reducer;
