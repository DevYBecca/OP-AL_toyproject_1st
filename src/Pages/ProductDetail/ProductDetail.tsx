import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Carousel, Button, Space, Card, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { productDetailApi } from 'api';
import {
  RootProductState,
  updateProductDetail,
} from 'redux/reducer/productSlice';
import {
  RootReserveState,
  selectedDateTime,
} from 'redux/reducer/reserveOptionSlice';
import { RootGuestsState, selectedGuests } from 'redux/reducer/guestsSlice';
import ReserveDatePicker from 'Components/Contents/ProductDetail/ReserveDatePicker';
import ReserveGuestsInput from 'Components/Contents/ProductDetail/ReserveGuestsInput';
import styles from 'Styles/ProductDetail.module.scss';

// 제품(공간) 주소는 모두 공통 주소로 출력
const productAddress = ['서울특별시 강남구 강남대로 364', '11층 11E 공간'];

// ProductDetail Component - 제품 상세 페이지
const ProductDetail: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useParams()로 동적인 제품 ID를 받아오기
  const { id } = useParams();

  // 사용자의 accessToken을 cookies에서 불러오기
  const [accessCookies] = useCookies(['accessToken']);
  const accessToken: string = accessCookies.accessToken;

  // '예약하기' 버튼 클릭 시 로그인 상태를 확인하여 Modal 출력
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 제품 상세 페이지 렌더링 시 제품 ID에 해당하는 데이터를 redux에 업데이트하고,
  // 업데이트된 state를 가져오기
  const product = useSelector((state: RootProductState) => state.productSlice);

  // 제품의 tags를 가져와 해시태그 기호를 붙여 출력
  const hashTags = product.tags.map((tag) => `#${tag}`);

  // 제품의 description을 가져와 문자열에 포함된 <br>을 기준으로 나누고 빈 문자열만 제거
  const productInfo = (product.description || '')
    .split('<br>')
    .filter((item) => item !== '');

  // productInfo에서 '상세정보', '시설안내'의 인덱스 번호 찾기
  const detailedInfoIndex = productInfo.findIndex(
    (item) => item === '상세정보'
  );
  const facilityInfoIndex = productInfo.findIndex(
    (item) => item === '시설안내'
  );

  // productInfo에서 '상세정보', '시설안내'에 해당하는 내용만 출력
  const detailedInfo = productInfo.slice(
    detailedInfoIndex + 1,
    facilityInfoIndex
  );
  const facilityInfo = productInfo.slice(facilityInfoIndex + 1);

  // 입실 시간, 퇴실 시간, 이용 시간을 관리하는 state 가져오기
  const reserveOption = useSelector(
    (state: RootReserveState) => state.reserveOptionSlice
  );

  const endTime = reserveOption.end; // 퇴실 시간 변수 지정

  // 예약 인원 수를 관리하는 state 가져오기
  const guests = useSelector(
    (state: RootGuestsState) => state.guestsSlice.guests
  );

  // '예약하기' 버튼 클릭 시 동작하는 함수
  const handlePaymentClick = () => {
    const { start, end, timeDiffer } = reserveOption;

    if (accessToken) {
      // 선택한 입실 시간, 퇴실 시간, 이용 시간, 예약 인원 수를 업데이트
      dispatch(selectedDateTime({ start, end, timeDiffer }));
      dispatch(selectedGuests(guests));
      navigate('/productpayment');
    } else {
      setIsModalOpen(true);
    }
  };

  // 예약하기 버튼 클릭 시 비로그인 상태라면 로그인이 필요함을 안내하고 로그인 페이지로 이동
  const handleOk = () => {
    navigate('/signin');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 제품 ID가 변경될 시 제품 상세 데이터를 useDispatch() 함수를 통해 업데이트
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDetailData = await productDetailApi(id as string);
        dispatch(updateProductDetail(productDetailData));
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <main className={styles.inner}>
      <div className={styles.title}>{product.title}</div>
      <Carousel autoplay>
        <div>
          <img
            src={product.thumbnail as string}
            alt="공간 썸네일 이미지"
            className={styles.product__img}
          />
        </div>
        <div>
          <img
            src={product.photo as string}
            alt="공간 상세 이미지"
            className={styles.product__img}
          />
        </div>
      </Carousel>

      <aside className={styles.tags__container}>
        {hashTags.map((tag, i) => (
          <Space wrap key={i}>
            <Button
              type="primary"
              shape="round"
              size={'large'}
              className={styles.product__tag}
            >
              <span>{hashTags[i]}</span>
            </Button>
          </Space>
        ))}
      </aside>

      <Card
        title={
          <div className={styles.product__title}>
            <h1>{product.title}</h1>
            <p style={{ fontSize: '20px' }}>
              {product.description.split('<br>')[0]}
            </p>
          </div>
        }
        bordered={false}
        headStyle={{ height: '130px' }}
        bodyStyle={{
          height: '230px',
          fontSize: '18px',
          overflow: 'hidden',
          border: 'none',
        }}
        className={styles.product__card}
      >
        <Card.Grid
          hoverable={false}
          className={styles.product__address}
          style={{ width: '33%' }}
        >
          <div>
            {/* 제품(공간) 장소 출력 */}
            <h3 className={styles.product__address}>주소</h3>
            {productAddress.map((item, i) => (
              <p key={i}>{productAddress[i]}</p>
            ))}
          </div>
        </Card.Grid>

        <Card.Grid
          hoverable={false}
          className={styles.product__selection}
          style={{ width: '45%' }}
        >
          <form className={styles.product__selection}>
            {/* 제품(공간)을 예약할 날짜, 시간, 인원 선택 */}
            <h3>예약 사항 선택</h3>
            <p style={{ display: 'block', marginBottom: '10px' }}>
              · 예약 날짜 및 시간 :
            </p>
            <ReserveDatePicker />
            <br />
            <p>· 예약 인원 : </p>
            <Space direction="vertical" style={{ width: '60%' }}>
              <ReserveGuestsInput />
              <p>(최소 1명, 최대 50명)</p>
            </Space>
          </form>
        </Card.Grid>

        <Card.Grid hoverable={false} style={{ width: '22%' }}>
          <div>
            {/* 제품(공간) 가격 (1시간 당) 출력 */}
            <h3>가격</h3>
            <strong>{product.price.toLocaleString()}</strong>
            <span>원/ 1시간 당</span>
          </div>
        </Card.Grid>
      </Card>

      <Space direction="vertical" className={styles.btn__container}>
        <Button
          type="primary"
          block
          className={styles.reservation__Btn}
          onClick={handlePaymentClick}
          disabled={endTime.length === 0 ? true : false}
        >
          예약하기
        </Button>
        <Modal
          title="안내메세지"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <span>로그인이 필요한 기능입니다. </span>
          <span>로그인 하시겠습니까?</span>
        </Modal>
      </Space>

      <Card
        title={<span className={styles.card__title}>상세정보</span>}
        bordered={false}
        className={styles.detailedInfo__card}
      >
        {detailedInfo.map((item, index) => (
          <p key={index}>
            {item} <br />
          </p>
        ))}
      </Card>

      <Card
        title={<span className={styles.card__title}>시설안내</span>}
        bordered={false}
        className={styles.detailedInfo__card}
      >
        {facilityInfo.map((item, index) => (
          <p key={index}>
            {item} <br />
          </p>
        ))}
      </Card>
    </main>
  );
};

export default ProductDetail;
