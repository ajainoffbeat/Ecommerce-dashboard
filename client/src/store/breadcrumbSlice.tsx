import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  breadcrumb: ["Home","Dashboard"], 
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    setBreadcrumb: (state, action) => {
      state.breadcrumb = action.payload;
    },
  },
});

export const { setBreadcrumb } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;