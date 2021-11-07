import { ApolloError } from "@apollo/client";
import { createSlice, PayloadAction, CaseReducer, createAsyncThunk, createSelector, SerializedError } from "@reduxjs/toolkit"
import { FETCH_TEAM_COMMANDS } from "../../utils/query";
import { VC } from "../../utils/types";
import { getErrorCode } from "../../utils";
import { client } from "../../utils/global";
import { defaultCommands, DefaultNetworkingState } from "../../utils/const";

type InitialState = {
  teamCommands: Array<VC.TeamCommands>
} & VC.DefaultNetworkingState

const initialState: InitialState = {
  teamCommands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((team) => {
    return {
      team,
      commands: Object.assign({}, defaultCommands)
    }
   }
  ),
  ...DefaultNetworkingState
};

const fetchTeamCommands = createAsyncThunk<VC.TeamCommands[], void, { rejectValue: VC.ErrorInfo }>(
  'teamCommands/fetch',
  (_, { rejectWithValue }) => {
    return client.query<{teamCommands: VC.TeamCommands[]}>({ query: FETCH_TEAM_COMMANDS })
      .then(({ data: { teamCommands } }) => { return teamCommands; })
      .catch((err: ApolloError) => {
        const code = getErrorCode(err) ?? 'unknown';
        const message = err.message;
        return rejectWithValue({ code, message });
      });
});

const commandTableSlice = createSlice({
  name: 'adminPassword',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // ---------- fetchAdminPassword ---------- //
    builder.addCase(fetchTeamCommands.fulfilled, (state, action) => {
      state.teamCommands = action.payload;
      state.fetchError = undefined;
      state.fetchPending = false;
    })
    builder.addCase(fetchTeamCommands.pending, (state, action) => {
      state.fetchPending = true;
    })
    builder.addCase(fetchTeamCommands.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchPending = false;
    })
  }
});

const { reducer } = commandTableSlice;
export default reducer;
export { fetchTeamCommands };