import { createSlice } from '@reduxjs/toolkit'

export const amm = createSlice({
	name: 'amm',
	initialState: {
		contract: [null, null, null, null, null, null],
		shares: [0, 0, 0, 0, 0, 0],
		swaps: [[], [], [], [], [], []]
	},
	reducers: {
		setAMMPair: (state, action) => {
			state.contract = action.payload
		}
	}
})

export const { setAMMPair } = amm.actions;

export default amm.reducer;
