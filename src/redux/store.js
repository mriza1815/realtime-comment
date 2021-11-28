import { createStore, combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./auth/reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import hardSet from "redux-persist/es/stateReconciler/hardSet";

const combinedReducer = combineReducers({ auth });

const reducer = (state, action) => {
  return combinedReducer(state, action);
};

const persistedReducers = persistReducer(
  {
    key: "realtimecomment:root",
    storage,
    stateReconciler: hardSet,
  },
  reducer
);

export const store = createStore(persistedReducers, composeWithDevTools());

export const persist = persistStore(store);
