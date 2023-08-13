import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Image, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { productPaymentApi, PaymentRequestBody, accountListApi } from 'api';
import { RootState, selectTab } from 'redux/reducer/reducer';
import SelectionAccount from 'Components/Contents/SelectionAccount';
import styles from 'Styles/ProductPayment.module.scss';
import 'Styles/Modal.scss';

// 제품(공간) 주소는 모두 공통 주소로 출력
const productAddress = ['서울특별시 강남구 강남대로 364', '11층 11E 공간'];

// ProductPayment Component - 제품 결제 페이지
const ProductPayment: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 사용자의 accessToken을 cookies에서 불러오기
  const [accessCookies] = useCookies(['accessToken']);
  const accessToken = accessCookies.accessToken;

  // '결제하기' 버튼 클릭 시 결과 Modal 출력
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 제품 상세 페이지에서 선택한 제품 데이터를 state로 가져오기
  const productInfo = useSelector((state: RootState) => state.productSlice);

  // 제품 상세 페이지에서 선택한 예약 옵션들을 state로 가져오기
  const reserveOption = useSelector(
    (state: RootState) => state.reserveOptionSlice
  );

  // 선택한 예약 옵션이 재호출되지 않도록 useMemo()로 메모라이징
  // 선택한 예약 옵션이 바뀔때만 입실 및 퇴실 날짜, 시간, 이용시간을 재계산함
  const formattedDate = useMemo(() => {
    // 선택한 입실 날짜, 퇴실 날짜, 이용 시간 출력
    const reserveStartDate = reserveOption.start.split('T')[0];
    const reserveEndDate = reserveOption.end.split('T')[0];
    const reserveTimeDiffer = reserveOption.timeDiffer;
    // 선택한 예약 입실 시간, 퇴실 시간 출력
    const reserveStartTime = reserveOption.start.split('T')[1].split(':')[0];
    const reserveEndTime = reserveOption.end.split('T')[1].split(':')[0];

    // iso 형식으로 관리되는 입실 및 퇴실 날짜를 Date 객체로 변환
    const formatStartDate = new Date(reserveStartDate);
    const formatEndDate = new Date(reserveEndDate);
    // 년, 월, 일 형태로 출력하기 위한 로직
    const startYear = formatStartDate.getFullYear();
    const startMonth = formatStartDate.getMonth() + 1;
    const startDay = formatStartDate.getDate();
    const endYear = formatEndDate.getFullYear();
    const endMonth = formatEndDate.getMonth() + 1;
    const endDay = formatEndDate.getDate();
    const formattedStartDate = `${startYear}년 ${startMonth}월 ${startDay}일`;
    const formattedEndDate = `${endYear}년 ${endMonth}월 ${endDay}일`;

    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startTime: reserveStartTime,
      endTime: reserveEndTime,
      timeDiffer: reserveTimeDiffer,
    };
  }, [reserveOption]);

  // 제품 상세 페이지에서 선택한 예약 인원 수를 state로 가져오기
  const guests = useSelector((state: RootState) => state.guestsSlice.guests);

  // 제품 결제 페이지 하단에서 선택한 계좌를 state로 관리하고 가져오기
  const pickedAccount = useSelector(
    (state: RootState) => state.selectAccountSlice.pickedAccount
  );

  // 결제 완료 후 마이 페이지의 '구매 내역' 탭으로 이동
  const goMyPurchase = () => {
    dispatch(selectTab('구매 내역'));
    navigate('/mypage');
  };

  // '결제하기' 버튼 클릭 시 동작할 결제 로직
  const handlePayment = async () => {
    // 계좌 목록 및 잔액 조회
    const accountList = await accountListApi(accessToken);

    if (pickedAccount.length === 0 && accountList.accounts.length !== 0) {
      alert('결제하실 계좌를 선택해 주세요.');
    } else if (accountList.accounts.length === 0) {
      alert(
        '등록된 계좌가 없습니다.[계좌 등록]버튼을 눌러 계좌를 추가해 주세요.'
      );
    } else if (
      accountList.accounts.length !== 0 &&
      pickedAccount.length !== 0
    ) {
      try {
        const requestBody: PaymentRequestBody = {
          productId: productInfo.id,
          accountId: pickedAccount,
          reservation: {
            start: reserveOption.start,
            end: reserveOption.end,
          },
        };

        // 제품(공간) 구매 신청(결제)
        await productPaymentApi(accessToken, requestBody);
        setIsModalOpen(true);
      } catch {
        alert('결제에 실패하였습니다. 계좌 상태를 확인해주세요.');
      }
    }
  };

  return (
    <main className={styles.inner}>
      <Card
        className={styles.preview}
        title={
          <div className={styles.preview__title}>
            <h1>예약 희망 옵션 확인</h1>
            <p>선택한 옵션이 맞는지 확인해 주세요</p>
          </div>
        }
        bordered={false}
        headStyle={{ height: '230px' }}
        bodyStyle={{ height: '450px' }}
      >
        <figure className={styles.preview__card}>
          {productInfo.photo && (
            <Image
              preview={false}
              src={productInfo.photo}
              className={styles.product__img}
              alt={'공간 이미지'}
            />
          )}

          <div className={styles.product__info}>
            <h1>{productInfo.title}</h1>
            <div>
              {/* 제품(공간) 주소 출력 */}
              {productAddress.map((item, i) => (
                <p key={i}>{productAddress[i]}</p>
              ))}
            </div>
            <div className={styles.product__reserve}>
              <div className={styles.product__reserveInfo}>
                <span>예약 날짜 :</span>
                <p>{formattedDate.startDate}</p>
              </div>
              <div className={styles.product__reserveInfo}>
                <span>예약 시간 :</span>
                <p>
                  {formattedDate.startDate} {formattedDate.startTime}시<br />~{' '}
                  {formattedDate.endDate} {formattedDate.endTime}시 (
                  {formattedDate.timeDiffer}
                  시간)
                </p>
              </div>
              <div className={styles.product__reserveInfo}>
                <span>예약 인원 : </span>
                <p>{guests}명</p>
              </div>
              <div className={styles.product__reserveInfo}>
                <span>대여 가격 :</span>
                <p>
                  {(
                    productInfo.price * Number(formattedDate.timeDiffer)
                  ).toLocaleString()}
                  원
                </p>
              </div>
            </div>
          </div>
        </figure>
      </Card>
      <div className={styles.payment}>
        <Card
          className={styles.payment__card}
          title={'결제 진행'}
          bordered={false}
          headStyle={{
            height: '130px',
            fontSize: '30px',
            color: 'rgba(89, 80, 69, 1)',
          }}
          bodyStyle={{ height: '100%' }}
        >
          <SelectionAccount />
          <Button
            className="btn__brown"
            type="primary"
            style={{
              width: '84%',
              margin: '0 auto 75px',
            }}
            onClick={handlePayment}
          >
            결제하기
          </Button>
          <Modal open={isModalOpen} footer={null} closable={false}>
            <h1 className="modal__header">결제가 완료되었습니다</h1>
            <div className="ComplectModal__btn">
              <Button className="btn">
                <Link to="/">메인으로 가기</Link>
              </Button>
              <Button className="btn" onClick={goMyPurchase}>
                구매내역 가기
              </Button>
            </div>
          </Modal>
        </Card>
      </div>
    </main>
  );
};

export default ProductPayment;
