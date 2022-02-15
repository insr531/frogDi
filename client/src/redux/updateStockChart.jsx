import { createSlice } from "@reduxjs/toolkit";

export const updateStockChartSlice = createSlice({
    name: "stockChart",
    initialState: { value: null },
    reducers: {
        updateStockChart: (state, action) => {
            state.value = action.payload;
        }
    },
});

export const { updateStockChart } = updateStockChartSlice.actions;
export default updateStockChartSlice.reducer;