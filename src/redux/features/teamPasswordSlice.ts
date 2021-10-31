import { ApolloError } from "@apollo/client";
import { createSlice, PayloadAction, CaseReducer, createAsyncThunk, createSelector } from "@reduxjs/toolkit"
import { FETCH_ALL_TEAM_PASSWORDS, UPDATE_TEAM_PASSWORDS } from "../../utils/query";
import { VC } from "../../utils/types";
import { getErrorCode } from "../../utils";
import { client } from "../../utils/global";
import { DefaultNetworkingState } from "../../utils/const";

type InitialState = {
  teamPasswords: VC.TeamPassword[],
} & VC.DefaultNetworkingState;

const initialState: InitialState = {
  teamPasswords: Array(12).fill(0).map((v, i) => { return ({ team: i+1, password: '' } as VC.TeamPassword) }),
  ...DefaultNetworkingState
};

const fetchAllTeamPasswords = createAsyncThunk<VC.TeamPassword[], void, { rejectValue: VC.ErrorInfo }>(
  'teamPassword/fetch', 
  (_, { rejectWithValue }) => {
    return client.query<{allTeamPasswords: VC.TeamPassword[]}>({ query: FETCH_ALL_TEAM_PASSWORDS })
      .then(({ data: { allTeamPasswords } }) => {
        return allTeamPasswords;
      })
      .catch((err: ApolloError) => {
        const code = getErrorCode(err) ?? 'unknown';
        const message = err.message;
        return rejectWithValue({ code, message });
      });
});

const updateTeamPasswords = createAsyncThunk<VC.TeamPassword[], VC.TeamPassword[], { rejectValue: VC.ErrorInfo }>(
  'teamPassword/update',
  (teamPasswords, { rejectWithValue }) => {
    return client.mutate<{updateTeamPasswords: VC.TeamPassword[]}>({ mutation: UPDATE_TEAM_PASSWORDS, variables: { teamPasswords } })
      .then(({ data }) => {
        return data!.updateTeamPasswords;
      })
      .catch((err: ApolloError) => {
        const [code, message] = [getErrorCode(err), err.message];
        return rejectWithValue({ code, message });
      });
  }
);

const teamPasswordSlice = createSlice({
  name: 'teamPassword',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // ---------- fetchAllTeamPasswords ---------- //
    builder.addCase(fetchAllTeamPasswords.fulfilled, (state, action) => {
      state.teamPasswords = action.payload;
      state.fetchPending = false;
    }),
    builder.addCase(fetchAllTeamPasswords.pending, (state, action) => {
      state.fetchPending = true;
    }),
    builder.addCase(fetchAllTeamPasswords.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchPending = false;
    })

    // ---------- updateTeamPasswords ---------- //
    builder.addCase(updateTeamPasswords.fulfilled, (state, action) => {
      state.teamPasswords = action.payload;
      state.fetchPending = false;
    }),
    builder.addCase(updateTeamPasswords.pending, (state, action) => {
      state.fetchPending = true;
    }),
    builder.addCase(updateTeamPasswords.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchPending = false;
    })
  }
});

const { reducer } = teamPasswordSlice;
export default reducer;
export { fetchAllTeamPasswords, updateTeamPasswords };