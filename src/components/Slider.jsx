import { useState, useEffect } from "react";

import { db } from "../firebase.config";
import Spinner from "./Spinner";
import { collection, query, limit, orderBy, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, Popup, Marker, TileLayer } from "react-leaflet";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import shareIcon from "../assets/svg/shareIcon.svg";

import "swiper/css/pagination";
import "swiper/css";
import { Pagination } from "swiper";

function Slider({imgUrls, title}) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  // useEffect(() => {
  //   const fetchListing = async () => {
  //     const docRef = doc(db, "listings", params.listingId);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       setListing(docSnap.data());
  //       setLoading(false);
  //     }
  //   };

  //   fetchListing();
  // }, []);
  // const [loading, setLoading] = useState(true);
  // const [listings, setListings] = useState(null);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchListing = async () => {
  //     const listingsRef = collection(db, "listings");
  //     const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
  //     const querySnap = await getDocs(q);

  //     let listings = [];

  //     querySnap.forEach((docs) => {
  //       return listings.push({
  //         id: docs.id,
  //         data: docs.data(),
  //       });
  //     });
  //     setListings(listings);
  //     setLoading(false);
  //   };

  //   fetchListing();
  // }, []);

  // if (loading) {
  //   return <Spinner />;
  // }

  // if (listings.length === 0) {
  //   return <></>;
  // }
  return (
      <>
        <p className="exploreHeading">Recommanded</p>

        <Swiper
          slidesPerView={1}
          pagination={true}
          modules={[Pagination]}
          className="swiper-container"
        >
          {listing?.map(({imgUrls, title}, key) => (
            <SwiperSlide
              key={key}
              // onClick={() => navigate(`/category/$/${id}`)}
            >
              <div
                style={{
                  position: "relative",
                  background: `url(${imgUrls[key]}) center no-repeat`,
                  backgroundSize: "cover",
                  width: "100%",
                  height: "100%",
                }}
                className="swiperSlideDiv"
              >
                <p className="swiperSlideText">{title}</p>
                {/* <p className="swiperSlidePrice">
                  ${data.discountedPrice ?? data.regularPrice}{" "}
                  {data.type === "rent" && "/ month"}
                </p> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
  );
}

export default Slider;
