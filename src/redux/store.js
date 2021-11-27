import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { createStore, combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./auth/reducer";

const combinedReducer = combineReducers({ auth });

const reducer = (state, action) => {
  return combinedReducer(state, action);
};

const persistedReducers = persistReducer(
  {
    key: "realtimecomment:root",
    storage: storage,
    stateReconciler: autoMergeLevel2,
  },
  reducer
);

export const store = createStore(persistedReducers);

export const persist = persistStore(store);
