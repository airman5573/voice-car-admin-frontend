import { ApolloError } from "@apollo/client";
import { createSlice, PayloadAction, CaseReducer, createAsyncThunk, createSelector } from "@reduxjs/toolkit"
import { FETCH_EDITABLE, UPDATE_EDITABLE_SIMILARWORDS, UPDATE_EDITABLE_SPEEDS } from "../../utils/query";
import { VC } from "../../utils/types";
import { getErrorCode } from "../../utils";
import { client } from "../../utils/global";
import { DefaultNetworkingState } from "../../utils/const";
import _ from "lodash";

type InitialState = {
  editableSimilarWords: boolean,
  editableSpeeds: boolean,
} & VC.DefaultNetworkingState

const initialState: InitialState = {
  editableSimilarWords: false,
  editableSpeeds: false,
  ...DefaultNetworkingState
};

const fetchEditable = createAsyncThunk<{ editableSimilarWords: boolean, editableSpeeds: boolean }, void, { rejectValue: VC.ErrorInfo }>(
  'editable/fetch', 
  (_, { rejectWithValue }) => {
    return client.query<{meta: { editableSimilarWords: boolean, editableSpeeds: boolean }}>({ query: FETCH_EDITABLE })
      .then(({ data: { meta } }) => { return {
          editableSimilarWords: meta.editableSimilarWords,
          editableSpeeds: meta.editableSpeeds
      } })
      .catch((err: ApolloError) => {
        const code = getErrorCode(err) ?? 'unknown';
        const message = err.message;
        return rejectWithValue({ code, message });
      });
});

const updateEditableSimilarWords = createAsyncThunk<boolean, boolean, { rejectValue: VC.ErrorInfo }>(
  'editableSimilarWords/update',
  (editable, { rejectWithValue }) => {
    return client.mutate<{updateEditableSimilarWords: boolean}>({ mutation: UPDATE_EDITABLE_SIMILARWORDS, variables: { editable } })
      .then(({ data }) => { return data!.updateEditableSimilarWords })
      .catch((err: ApolloError) => {
        const [code, message] = [getErrorCode(err), err.message];
        return rejectWithValue({ code, message });
      });
  }
);

const updateEditableSpeeds = createAsyncThunk<boolean, boolean, { rejectValue: VC.ErrorInfo }>(
  'editableSpeeds/update',
  (editable, { rejectWithValue }) => {
    return client.mutate<{updateEditableSpeeds: boolean}>({ mutation: UPDATE_EDITABLE_SPEEDS, variables: { editable } })
      .then(({ data }) => { return data!.updateEditableSpeeds })
      .catch((err: ApolloError) => {
        const [code, message] = [getErrorCode(err), err.message];
        return rejectWithValue({ code, message });
      });
  }
);

const editableSlice = createSlice({
  name: 'editable',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // ---------- fetchControlMode ---------- //
    builder.addCase(fetchEditable.fulfilled, (state, action) => {
      state.editableSimilarWords = action.payload.editableSimilarWords;
      state.editableSpeeds = action.payload.editableSpeeds;
      state.fetchPending = false;
    }),
    builder.addCase(fetchEditable.pending, (state, action) => {
      state.fetchPending = true;
    }),
    builder.addCase(fetchEditable.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchPending = false;
    })

    // ---------- updateEditableSimilarWords ---------- //
    builder.addCase(updateEditableSimilarWords.fulfilled, (state, action) => {
      state.editableSimilarWords = action.payload
      state.fetchPending = false;
    }),
    builder.addCase(updateEditableSimilarWords.pending, (state, action) => {
      state.fetchPending = true;
    }),
    builder.addCase(updateEditableSimilarWords.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchPending = false;
    })

    // ---------- updateEditableSpeeds ---------- //
    builder.addCase(updateEditableSpeeds.fulfilled, (state, action) => {
      state.editableSpeeds = action.payload
      state.fetchPending = false;
    }),
    builder.addCase(updateEditableSpeeds.pending, (state, action) => {
      state.fetchPending = true;
    }),
    builder.addCase(updateEditableSpeeds.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchPending = false;
    })
  }
});

const { reducer } = editableSlice;
export default reducer;
export { fetchEditable, updateEditableSimilarWords, updateEditableSpeeds };