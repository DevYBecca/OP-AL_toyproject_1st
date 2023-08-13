import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import {
  tabSlice,
  counterSlice,
  searchSlice,
  selectAccountSlice,
  listSlice,
  productSlice,
  reservationSlice,
  reserveOptionSlice,
  guestsSlice,
} from 'redux/reducer/reducer';
import sessionStorage from 'redux-persist/lib/storage/session';

export const rootReducer = combineReducers({
  tabSlice: tabSlice.reducer,
  counterSlice: counterSlice.reducer,
  searchSlice: searchSlice.reducer,
  selectAccountSlice: selectAccountSlice.reducer,
  listSlice: listSlice.reducer,
  productSlice: productSlice.reducer,
  reservationSlice: reservationSlice.reducer,
  reserveOptionSlice: reserveOptionSlice.reducer,
  guestsSlice: guestsSlice.reducer,
});

// redux-persist의 구성 옵션을 정의하는 persistConfig
const persistConfig = {
  key: 'root', // storage에 저장될 데이터 key
  storage: sessionStorage, // Session storage에 저장
  whitelist: [
    // persist를 적용할 reducer
    'productSlice',
    'reservationSlice',
    'reserveOptionSlice',
    'guestsSlice',
  ],
  blacklist: [
    // persist를 적용하지 않을 reducer
    'tabSlice',
    'counterSlice',
    'searchSlice',
    'selectAccountSlice',
    'listSlice',
  ],
};

// 기존 Reducer에 persist를 적용한 persistReducer 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// reducer.tsx 파일에서 내보내진 reducer들을 configureStore에 전달하여 하나로 결합합니다.
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// redux-persist를 적용한 store 생성
const persistor = persistStore(store);

export { store, persistor };
