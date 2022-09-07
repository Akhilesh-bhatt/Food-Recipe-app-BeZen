import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css";
import { Pagination } from "swiper";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  // const splitString = listing?.title?.split(" ")
  // const lastElement = splitString?.pop()
  // const firstElement = splitString?.toString().replaceAll(",", " ")

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="pageContainer">
      {/* <h3>This is main Recipe page in which we show detail recipe</h3> */}
      {/* {firstElement}{" "}<span>{lastElement}</span> */}
      <h1 className="recipeHeading" style={{ textAlign: "center" }}>
        {listing.title}
      </h1>
      <Swiper
        slidesPerView={1}
        pagination={true}
        modules={[Pagination]}
        className="swiper-container"
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index} className="swiper-container">
            <div
              className="swiperSlideDiv"
              style={{
                position: "relative",
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
                width: "100%",
                height: "100%",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <main className="recipeContainer">
        <div className="correct">
          <h1>Ingredient used -</h1>

          <ul className="listingColumn">
            {listing.ingredients.map((ingredient, key) => (
              <li key={key}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="correct" style={{ marginBottom: "5rem" }}>
          <h1>Directions/Steps to make recipe</h1>

          <ul className="listingColumn1">
            {listing.directions.map((step, key) => (
              <li key={key}>{step}</li>
            ))}
          </ul>
        </div>
      </main>
    </main>
  );
}

export default Listing;
