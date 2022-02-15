import { createSlice } from "@reduxjs/toolkit";

export const compareLastYearSlice = createSlice({
    name: "comparePrice",
    initialState: { value: 0 },
    reducers: {
        compareLastYear: (state, action) => {
            state.value = action.payload;
        }
    },
});

export const { compareLastYear } = compareLastYearSlice.actions;
export default compareLastYearSlice.reducer;