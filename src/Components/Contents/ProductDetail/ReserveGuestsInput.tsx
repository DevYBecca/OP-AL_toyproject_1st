import React from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber } from 'antd';
import { selectedGuests } from 'redux/reducer/guestsSlice';

const ReserveGuestsInput = () => {
  const dispatch = useDispatch();

  // antd InputNumber - 예약 인원
  const onChangePerson = (value: number | null) => {
    dispatch(selectedGuests(value || 1));
  };

  return (
    <InputNumber
      size="large"
      min={1}
      max={50}
      defaultValue={1}
      onChange={onChangePerson}
    />
  );
};

export default ReserveGuestsInput;
