import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// 코드 흐름을 따라가면서 이해해보시고 추가로 작성해주시면 됩니다.
interface TabState {
  selectedTab: string;
}
interface Counterstate {
  clickedCounter: number;
}
interface Searchstate {
  searchedValue: string;
}
interface listState {
  listValue: Product[];
}
interface AccountState {
  pickedAccount: string;
}
export interface Product {
  // 제품 정보
  id: string; // 제품 ID
  title: string; // 제품 이름
  price: number; // 제품 가격
  description: string; // 제품 설명(최대 100자)
  tags: string[]; // 제품 태그
  thumbnail: string | undefined; // 제품 썸네일 이미지(URL)
  discountRate: number; // 제품 할인율
}
// 단일 제품 상세 조회 - 예약 정보가 있을 경우 타입
interface ReservationState {
  start: string;
  end: string;
  isCanceled: boolean;
  isExpired: boolean;
}
// 단일 제품 상세 조회 타입
interface ProductState {
  id: string;
  title: string;
  price: number;
  description: string;
  tags: string[];
  thumbnail: string | null;
  photo: string | null;
  isSoldOut: boolean;
  reservations: ReservationState[];
  discountRate: number;
}
// 예약 날짜 및 시간
interface ReserveOptionState {
  start: string;
  end: string;
  timeDiffer: string;
}
// 예약 인원
interface GuestsState {
  guests: number;
}
// 초기값 설정입니다.
const initialState: TabState = {
  selectedTab: '내 정보',
};
const productInitialState: listState = {
  listValue: [
    {
      id: '',
      title: '',
      price: 0,
      description: '',
      tags: [''],
      thumbnail: '',
      discountRate: 0,
    },
  ],
};
// 예약 정보가 있을 경우 초기값
const initialReservationState: ReservationState = {
  start: '',
  end: '',
  isCanceled: false,
  isExpired: false,
};
// 단일 제품 상세 조회 초기값
const initialProductState: ProductState = {
  id: '',
  title: '',
  price: 0,
  description: '',
  tags: [],
  thumbnail: '',
  photo: '',
  isSoldOut: false,
  reservations: [],
  discountRate: 0,
};
const initialReserveOptionState: ReserveOptionState = {
  start: '',
  end: '',
  timeDiffer: '',
};
const initialGuestsState: GuestsState = {
  guests: 1,
};
const initialAccountState: AccountState = {
  pickedAccount: '',
};

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    selectTab: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        selectedTab: action.payload,
      };
    },
  },
});
export const counterSlice = createSlice({
  name: 'counterSlice',
  initialState: { clickedCounter: 0 },
  reducers: {
    up: (state, action: PayloadAction<number>) => {
      state.clickedCounter = state.clickedCounter + action.payload;
    },
    down: (state, action: PayloadAction<number>) => {
      state.clickedCounter = state.clickedCounter - action.payload;
    },
  },
});
export const selectAccountSlice = createSlice({
  name: 'selectAccountSlice',
  initialState: initialAccountState,
  reducers: {
    selectAccount: (state, action: PayloadAction<string>) => {
      state.pickedAccount = action.payload;
    },
  },
});
export const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: { searchedValue: '' },
  reducers: {
    search: (state, action: PayloadAction<string>) => {
      state.searchedValue = action.payload;
    },
    category: (state, action: PayloadAction<string>) => {
      state.searchedValue = action.payload;
    },
  },
});
export const listSlice = createSlice({
  name: 'listSlice',
  initialState: productInitialState,
  reducers: {
    plist: (state, action: PayloadAction<Product[]>) => {
      state.listValue = action.payload;
    },
  },
});
export const reservationSlice = createSlice({
  name: 'reservation',
  initialState: initialReservationState,
  reducers: {
    updateReservation: (state, action: PayloadAction<ReservationState>) => {
      action.payload;
    },
  },
});
export const productSlice = createSlice({
  name: 'product',
  initialState: initialProductState,
  reducers: {
    updateProductDetail: (state, action: PayloadAction<ProductState>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.price = action.payload.price;
      state.description = action.payload.description;
      state.tags = action.payload.tags;
      state.thumbnail = action.payload.thumbnail;
      state.photo = action.payload.photo;
      state.isSoldOut = action.payload.isSoldOut;
      state.reservations = action.payload.reservations;
      state.discountRate = action.payload.discountRate;
    },
  },
});
export const reserveOptionSlice = createSlice({
  name: 'reserveOption',
  initialState: initialReserveOptionState,
  reducers: {
    selectedDateTime: (state, action: PayloadAction<ReserveOptionState>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      state.timeDiffer = action.payload.timeDiffer;
    },
  },
});
export const guestsSlice = createSlice({
  name: 'guests',
  initialState: initialGuestsState,
  reducers: {
    selectedGuests: (state, action: PayloadAction<number>) => {
      state.guests = action.payload;
    },
  },
});
export interface RootState {
  tabSlice: TabState;
  counterSlice: Counterstate;
  searchSlice: Searchstate;
  selectAccountSlice: AccountState;
  listSlice: listState;
  productSlice: ProductState;
  reservationSlice: ReservationState;
  reserveOptionSlice: ReserveOptionState;
  guestsSlice: GuestsState;
}

export const { selectTab } = tabSlice.actions;
export const { up, down } = counterSlice.actions;
export const { search, category } = searchSlice.actions;
export const { selectAccount } = selectAccountSlice.actions;
export const { plist } = listSlice.actions;
export const { updateProductDetail } = productSlice.actions;
export const { updateReservation } = reservationSlice.actions;
export const { selectedDateTime } = reserveOptionSlice.actions;
export const { selectedGuests } = guestsSlice.actions;

export default {
  tabSlice: tabSlice.reducer,
  counterSlice: counterSlice.reducer,
  searchSlice: searchSlice.reducer,
  selectAccountSlice: selectAccountSlice.reducer,
  listSlice: listSlice.reducer,
  productSlice: productSlice.reducer,
  reservationSlice: reservationSlice.reducer,
  reserveOptionSlice: reserveOptionSlice.reducer,
  guestsSlice: guestsSlice.reducer,
};
