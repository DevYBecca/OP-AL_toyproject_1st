import React from 'react';
import { useDispatch } from 'react-redux';
import { DatePicker, ConfigProvider } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { selectedDateTime } from 'redux/reducer/reserveOptionSlice';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import locale from 'antd/locale/ko_KR';

// dayjs 라이브러리 한글화
dayjs.locale('ko');

// DatePicker에서 날짜 선택 시 범위 제한 적용
const { RangePicker } = DatePicker;

const ReserveDatePicker: React.FC = () => {
  const dispatch = useDispatch();

  // antd DatePicker - 예약 날짜 및 시간
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => [],
      };
    }
    return {
      disabledHours: () => [],
    };
  };

  const handleRangeChange = (dates: any) => {
    if (dates && dates.length >= 2) {
      const [start, end] = dates;

      // 선택한 입실, 퇴실 시간을 toISOString() 함수로 출력할 경우 UTC 기준 시간으로 반환함
      // antd에서 사용하고 있는 dayjs의 add() 메서드로 9시간을 추가하여
      // 대한민국 서울 기준(UTC+9) 시간으로 toISOString() 함수 적용
      const isoStartString = start.add(9, 'hour').toISOString();
      const isoEndString = end.add(9, 'hour').toISOString();

      // dayjs의 diff() 메서드로 선택한 입실 시간과 퇴실 시간의 시간차를 반환하지만
      // JavaScript의 Date 객체는 milliseconds 단위로 시간을 저장하기 때문에,
      // diff() 메서드의 결과값이 밀리초 단위 때문에 정확하게 나오지 않을 수 있음
      // 1시간을 밀리초로 변환하는 값으로 나누고, toFixed() 메서드로 소수점 자르기
      // 1,000ms(=1초) * 60s(=1분) * 60m(=1시간) => 1시간을 ms로 변환
      const timeOfUse = (end.diff(start) / (1000 * 60 * 60)).toFixed(0);

      dispatch(
        selectedDateTime({
          start: isoStartString,
          end: isoEndString,
          timeDiffer: timeOfUse,
        })
      );
    }
  };

  return (
    <ConfigProvider locale={locale}>
      <RangePicker
        size="large"
        disabledDate={disabledDate}
        disabledTime={disabledRangeTime}
        placeholder={['입실 날짜 및 시간', '퇴실 날짜 및 시간']}
        showTime={{
          hideDisabledOptions: true,
          defaultValue: [dayjs('00', 'HH'), dayjs('11', 'HH')],
        }}
        format="YYYY년 MM월 DD일 HH시"
        onChange={handleRangeChange}
        style={{ width: '400px', marginBottom: '15px' }}
      />
    </ConfigProvider>
  );
};

export default ReserveDatePicker;
