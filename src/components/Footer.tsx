import React from "react";
import styled from "styled-components";

function Footer() {
  return (
    <Container>
      <div>회사명: (주)원광생활건강</div>
      <div>사업자 등록번호: 503-86-21075</div>
      <div>대표자: 신용호</div>
      <div>연락처: 032-515-7417</div>
      <div>이메일: wonkwanglh@gmail.com</div>
      <div>주소: 인천광역시 부평구 부흥로 295, 2층 201호(부평동, 부평빌딩)</div>
      <br />
      <div>Copyright © (주)원광생활건강. All Rights Reserved.</div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: var(--footer-height);
  padding: 30px 0;
  background-color: #f7f7f7;
  color: gray;
  font-size: 0.8rem;
  text-align: center;
  border-top: 1px solid lightgray;
`;

export default Footer;
