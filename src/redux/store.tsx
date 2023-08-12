import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import productSlice from './reducer/productSlice';
import reserveOptionSlice from './reducer/reserveOptionSlice';
import guestsSlice from './reducer/guestsSlice';
import sessionStorage from 'redux-persist/lib/storage/session';
import reducers from './reducer/reducer';

// redux-persist의 구성 옵션을 정의하는 persistConfig
const persistConfig = {
  key: 'root', // storage에 저장될 데이터 key
  storage: sessionStorage, // Session storage에 저장
};

// 각 slice의 Reducer에 redux-persist 적용
const persistedDetailReducer = persistReducer(
  persistConfig,
  productSlice.reducer
);
const persistedReserveOptionReducer = persistReducer(
  persistConfig,
  reserveOptionSlice.reducer
);
const persistedGuestsReducer = persistReducer(
  persistConfig,
  guestsSlice.reducer
);

// reducer.tsx 파일에서 내보내진 reducer들을 configureStore에 전달하여 하나로 결합합니다.
// 기존에 사용하던 slice들은 rootReducer를 받고 persistReducer로 받을 slice 지정
const store = configureStore({
  reducer: {
    ...reducers,
    productSlice: persistedDetailReducer,
    reserveOptionSlice: persistedReserveOptionReducer,
    guestsSlice: persistedGuestsReducer,
  },
});

// redux-persist를 적용한 store 생성
const persistor = persistStore(store);

export { store, persistor };
