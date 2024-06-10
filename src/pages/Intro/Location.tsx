import React, { useEffect } from "react";
import styled from "styled-components";

const Location: React.FC = () => {
  useEffect(() => {
    const { kakao } = window as any;
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.49879082400211, 126.72478981193977),
      level: 2,
    };

    const map = new kakao.maps.Map(container, options);

    const markerPosition = new kakao.maps.LatLng(
      37.49879082400211,
      126.72478981193977
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    marker.setMap(map);

    const iwContent = `<div style="text-align:center;padding:2px;width:210px;">인천광역시 부평구 부흥로 295</div>`;
    const infowindow = new kakao.maps.InfoWindow({
      content: iwContent,
    });
    infowindow.open(map, marker);

    kakao.maps.event.addListener(marker, "click", () => {
      window.open(
        "https://map.kakao.com/link/map/CompanyName,37.49879082400211,126.72478981193977"
      );
    });
  }, []);

  return (
    <Container>
      <Title>오시는 길</Title>
      <MapContainer id="map"></MapContainer>
    </Container>
  );
};

export default Location;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const MapContainer = styled.div`
  width: 80%;
  height: 500px;
  border: 1px solid #ddd;
`;
