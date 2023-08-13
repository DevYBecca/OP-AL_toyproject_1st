import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 예약 날짜 및 시간 타입 지정
export interface ReserveOptionState {
  start: string;
  end: string;
  timeDiffer: string;
}

// 예약 날짜 및 시간 초기값
const initialReserveOptionState: ReserveOptionState = {
  start: '',
  end: '',
  timeDiffer: '',
};

// 제품 상세 페이지에서 선택한 예약 날짜와 시간을 관리하는 slice
const reserveOptionSlice = createSlice({
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

export interface RootReserveState {
  reserveOptionSlice: ReserveOptionState;
}

export const { selectedDateTime } = reserveOptionSlice.actions;

export default reserveOptionSlice;
