import { ApolloError } from "@apollo/client";
import { createSlice, PayloadAction, CaseReducer, createAsyncThunk, createSelector, SerializedError } from "@reduxjs/toolkit"
import { FETCH_ADMIN_PASSWORD, UPDATE_ADMIN_PASSWORD } from "../../utils/query";
import { VC } from "../../utils/types";
import { getErrorCode } from "../../utils";
import { client } from "../../utils/global";
import { DefaultNetworkingState } from "../../utils/const";

type InitialState = {
  password: string,
} & VC.DefaultNetworkingState

const initialState: InitialState = {
  password: '5911',
  ...DefaultNetworkingState
};

const fetchAdminPassword = createAsyncThunk<string, void, { rejectValue: VC.ErrorInfo }>(
  'adminPassword/fetch', 
  (_, { rejectWithValue }) => {
    return client.query<{meta: { adminPassword: string }}>({ query: FETCH_ADMIN_PASSWORD })
      .then(({ data: { meta } }) => {
        const { adminPassword } = meta;
        return adminPassword;
      })
      .catch((err: ApolloError) => {
        const code = getErrorCode(err) ?? 'unknown';
        const message = err.message;
        return rejectWithValue({ code, message });
      });
});

const updateAdminPassword = createAsyncThunk<string, string, { rejectValue: VC.ErrorInfo }>(
  'adminPassword/update',
  (password, { rejectWithValue }) => {
    return client.mutate<{meta: { adminPassword: string }}>({ mutation: UPDATE_ADMIN_PASSWORD, variables: { password } })
      .then(({ data }) => {
        return password;
      })
      .catch((err: ApolloError) => {
        console.dir(err);
        const [code, message] = [getErrorCode(err), err.message];
        return rejectWithValue({ code, message });
      });
  }
);

const adminPasswordSlice = createSlice({
  name: 'adminPassword',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // ---------- fetchAdminPassword ---------- //
    builder.addCase(fetchAdminPassword.fulfilled, (state, action) => {
      state.password = action.payload;
      state.fetchError = undefined;
      state.fetchPending = false;
    })
    builder.addCase(fetchAdminPassword.pending, (state, action) => {
      state.fetchPending = true;
    })
    builder.addCase(fetchAdminPassword.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchPending = false;
    })

    // ---------- updateAdminPassword ---------- //
    builder.addCase(updateAdminPassword.fulfilled, (state, action) => {
      state.password = action.payload;
      state.updateError = undefined;
      state.updatePending = false;
    })
    builder.addCase(updateAdminPassword.pending, (state, action) => {
      state.updatePending = true;
    })
    builder.addCase(updateAdminPassword.rejected, (state, action) => {
      state.updateError = action.payload;
      state.updatePending = false;
    })
  }
});

const { reducer } = adminPasswordSlice;
export default reducer;
export { fetchAdminPassword, updateAdminPassword };