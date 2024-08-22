import styled from "styled-components";
import Loading from "react-loading";

const LoadingSpinner = () => (
  <SpinnerContainer>
    <Loading type="spin" color="var(--base-color)" height={50} width={50} />
    <h3>페이지에 접속 중...</h3>
  </SpinnerContainer>
);

export default LoadingSpinner;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
`;
