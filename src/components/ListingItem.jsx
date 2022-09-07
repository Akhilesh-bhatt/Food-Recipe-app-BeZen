import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";

function ListingItem({ listing, id, onDelete, onEdit }) {
  return (
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
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          onClick={() => onDelete(listing.id)}
          className="removeIcon"
          fill="rgb(231, 76, 0)"
        />
      )}
      {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
    </li>
  );
}

export default ListingItem;
