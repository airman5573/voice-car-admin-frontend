import { combineReducers, configureStore, Reducer, AnyAction, createSlice } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import adminPasswordReducer from "./features/adminPasswordSlice";
import controlModeReducer from "./features/controlModeSlice";
import teamPasswordReducer from "./features/teamPasswordSlice";
import commandTableReducer from "./features/commandTableSlice";

const reducer = combineReducers({
  adminPassword: adminPasswordReducer,
  controlMode: controlModeReducer,
  teamPasswords: teamPasswordReducer,
  teamCommands: commandTableReducer
});
export type RootState = ReturnType<typeof reducer>;
const store = configureStore({ reducer });
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;