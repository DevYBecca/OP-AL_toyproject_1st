import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 예약 인원 타입 지정
export interface GuestsState {
  guests: number;
}

// 예약 인원 초기값
const initialGuestsState: GuestsState = {
  guests: 1,
};

// 제품 상세 페이지에서 선택한 예약 인원을 관리하는 slice
const guestsSlice = createSlice({
  name: 'guests',
  initialState: initialGuestsState,
  reducers: {
    selectedGuests: (state, action: PayloadAction<number>) => {
      state.guests = action.payload;
    },
  },
});

export interface RootGuestsState {
  guestsSlice: GuestsState;
}

export const { selectedGuests } = guestsSlice.actions;

export default guestsSlice;
