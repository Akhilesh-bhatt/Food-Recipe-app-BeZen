import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

function ListingItem({ listing, id, onDelete, onEdit }) {
  return (
    // <>
    //   <h3>Listing item for showcase</h3>
    // </>
    <li className="categoryListing">
      <Link
        className="categoryListingLink"
        to={`/category/${listing.type}/${id} `}
      >
        <img
          src={listing.imgUrls[0]}
          alt={listing.title}
          className="categoryListingImg"
        />

        <div className="categoryListingDetails">
          <p className="categoryListingName">{listing.title}</p>
          <p className="categoryListingLocation">{listing.description}</p>
          {/* <p className="categoryListingPrice">
            ${listing.offer ? listing.discountedPrice : listing.regularPrice}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </p>

            <img src={bathtubIcon} alt="Bathroom" />
            <p className="categoryListingInfoText">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : "1 Bathroom"}
            </p>
          </div> */}
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          onClick={() => onDelete(listing.id)}
          className="removeIcon"
          fill="rgb(231, 76, 0)"
        />
      )}
      {onEdit && (
        <EditIcon  className="editIcon" onClick={() => onEdit(id)}/>
      )}
    </li>
  );
}

export default ListingItem;