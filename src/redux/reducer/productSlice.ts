import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 단일 제품 상세 조회 타입 지정
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

// 단일 제품 상세 조회 - 예약 정보가 있을 경우의 타입 지정
interface ReservationState {
  start: string;
  end: string;
  isCanceled: boolean;
  isExpired: boolean;
}

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

// 예약 정보가 있을 경우 초기값
const initialReservationState: ReservationState = {
  start: '',
  end: '',
  isCanceled: false,
  isExpired: false,
};

// 단일 제품 상세 조회 api 호출 시 데이터를 관리하는 slice
const productSlice = createSlice({
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

// 예약 정보가 있을 경우 데이터를 관리하는 slice
const reservationSlice = createSlice({
  name: 'reservation',
  initialState: initialReservationState,
  reducers: {
    updateReservation: (state, action: PayloadAction<ReservationState>) => {
      action.payload;
    },
  },
});

export const { updateProductDetail } = productSlice.actions;
export const { updateReservation } = reservationSlice.actions;

export default productSlice;
