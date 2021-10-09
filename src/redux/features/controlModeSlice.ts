import { ApolloError } from "@apollo/client";
import { createSlice, PayloadAction, CaseReducer, createAsyncThunk, createSelector } from "@reduxjs/toolkit"
import { FETCH_CONTROLMODE, UPDATE_CONTROLMODE } from "../../utils/query";
import { VC } from "../../utils/types";
import { getErrorCode } from "../../utils";
import { client } from "../../utils/global";
import { DefaultNetworkingState } from "../../utils/const";
import _ from "lodash";
import { ValuesOfCorrectTypeRule } from "graphql";

type InitialState = {
  controlMode: string,
} & VC.DefaultNetworkingState

const initialState: InitialState = {
  controlMode: 'rc',
  ...DefaultNetworkingState
};

const fetchControlMode = createAsyncThunk<string, void, { rejectValue: VC.ErrorInfo }>(
  'controlMode/fetch', 
  (_, { rejectWithValue }) => {
    return client.query<{meta: { controlMode: string }}>({ query: FETCH_CONTROLMODE })
      .then(({ data: { meta } }) => { return meta.controlMode })
      .catch((err: ApolloError) => {
        const code = getErrorCode(err) ?? 'unknown';
        const message = err.message;
        return rejectWithValue({ code, message });
      });
});

const updateControlMode = createAsyncThunk<string, string, { rejectValue: VC.ErrorInfo }>(
  'controlMode/update',
  (controlMode, { rejectWithValue }) => {
    return client.mutate<{updateControlMode: string}>({ mutation: UPDATE_CONTROLMODE, variables: { mode: controlMode } })
      .then(({ data }) => {
        return data!.updateControlMode;
      })
      .catch((err: ApolloError) => {
        const [code, message] = [getErrorCode(err), err.message];
        return rejectWithValue({ code, message });
      });
  }
);

const controlModeSlice = createSlice({
  name: 'controlMode',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // ---------- fetchControlMode ---------- //
    builder.addCase(fetchControlMode.fulfilled, (state, action) => {
      state.controlMode = action.payload;
      state.fetchPending = false;
    }),
    builder.addCase(fetchControlMode.pending, (state, action) => {
      state.fetchPending = true;
    }),
    builder.addCase(fetchControlMode.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchPending = false;
    })

    // ---------- updateControlMode ---------- //
    builder.addCase(updateControlMode.fulfilled, (state, action) => {
      state.controlMode = action.payload;
      state.fetchPending = false;
    }),
    builder.addCase(updateControlMode.pending, (state, action) => {
      state.fetchPending = true;
    }),
    builder.addCase(updateControlMode.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchPending = false;
    })
  }
});

const { reducer } = controlModeSlice;
export default reducer;
export { fetchControlMode, updateControlMode };