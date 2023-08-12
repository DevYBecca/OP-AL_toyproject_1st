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

const initialAccountState: AccountState = {
  pickedAccount: '',
};

const tabSlice = createSlice({
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

const counterSlice = createSlice({
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

const selectAccountSlice = createSlice({
  name: 'selectAccountSlice',
  initialState: initialAccountState,
  reducers: {
    selectAccount: (state, action: PayloadAction<string>) => {
      state.pickedAccount = action.payload;
    },
  },
});

const searchSlice = createSlice({
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

const listSlice = createSlice({
  name: 'listSlice',
  initialState: productInitialState,
  reducers: {
    plist: (state, action: PayloadAction<Product[]>) => {
      state.listValue = action.payload;
    },
  },
});

export interface RootState {
  tabSlice: TabState;
  counterSlice: Counterstate;
  searchSlice: Searchstate;
  selectAccountSlice: AccountState;
  listSlice: listState;
}

export const { selectTab } = tabSlice.actions;
export const { up, down } = counterSlice.actions;
export const { search, category } = searchSlice.actions;
export const { selectAccount } = selectAccountSlice.actions;
export const { plist } = listSlice.actions;

export default {
  tabSlice: tabSlice.reducer,
  counterSlice: counterSlice.reducer,
  searchSlice: searchSlice.reducer,
  selectAccountSlice: selectAccountSlice.reducer,
  listSlice: listSlice.reducer,
};
