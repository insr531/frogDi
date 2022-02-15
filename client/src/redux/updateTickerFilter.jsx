import { createSlice } from "@reduxjs/toolkit";

export const updateTickerFilterSlice = createSlice({
    name: "mainTicker",
    initialState: { value: null },
    reducers: {
        updateTickerFilter: (state, action) => {
            state.value = action.payload;
        }
    },
});

export const { updateTickerFilter } = updateTickerFilterSlice.actions;
export default updateTickerFilterSlice.reducer;