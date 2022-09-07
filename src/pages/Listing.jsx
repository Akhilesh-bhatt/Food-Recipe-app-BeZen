import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, Popup, Marker, TileLayer } from "react-leaflet";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css";
import { Pagination } from "swiper";
// import Slider from "../components/Slider";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

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

  const splitString = listing?.title?.split(" ")
  const lastElement = splitString?.pop()
  const firstElement = splitString?.toString().replaceAll(",", " ")


  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="pageContainer">
      {/* <h3>This is main Recipe page in which we show detail recipe</h3> */}
{/* {firstElement}{" "}<span>{lastElement}</span> */}
        <h1 className="recipeHeading" style={{textAlign: "center"}}>
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
                height: "100%"
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <main className="recipeContainer">
          {/* <img
           src={listing.imgUrls[0]}
            alt={listing.title}
          />  */}
{/* <Slider /> */}

        <div className="correct">
          <h1>Ingredient used -</h1>

          <ul className="listingColumn">
            {listing.ingredients.map((ingredient, key) => (
              <li key={key}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="correct" style={{marginBottom: "5rem"}}>
          <h1>Directions/Steps to make recipe</h1>

          <ul className="listingColumn1">
          {listing.directions.map((step, key) => (
              <li key={key}>{step}</li>
            ))}
          </ul>
        </div>
      </main>



{/*
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer ? listing.discountedPrice : listing.regularPrice}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} bedrooms`
              : "1 bedroom"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} bathrooms`
              : "1 bathroom"}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>

      </div> */}
    </main>
  );
}

export default Listing;
