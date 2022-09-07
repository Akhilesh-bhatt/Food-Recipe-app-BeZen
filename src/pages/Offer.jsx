import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import {
  collection,
  getDocs,
  orderBy,
  where,
  limit,
  startAfter,
  query,
} from "firebase/firestore";
import ListingItem from "../components/ListingItem";

function Offer() {
  const [text, setText] = useState("");
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchListing, setLastFetchListing] = useState(null);

  useEffect(() => {
    const searchRecipes = listings?.filter(
      (recipe) => recipe.data.title === text
    );
    setSearchedRecipes(searchRecipes);
    console.log(searchRecipes)
  }, [listings])

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault()
    try{
    setLoading(true);
    //Get referance
    const listingsRef = collection(db, "listings");

    // Create query
    const q = query(listingsRef, limit(10));

    //Execute query snap
    const querySnap = await getDocs(q);
    const lastVisible = querySnap.docs[querySnap.docs.length - 1];
    setLastFetchListing(lastVisible);
    const listing = [];

    querySnap.forEach((doc) => {
      return listing.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setListings(listing);
    setLoading(false);
    }
    catch(error){
      setLoading(false)
      toast.error("No recipe found !")
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="category">
      <h1>Search bar for Search</h1>
      <div style={{marginTop: "1rem"}}>
        <div>
          <form onSubmit={handleSearch}>
            <div className="form-control">
              <div
                className="relative "
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  className="w-full pr-40 bg-gray-200 input input-lg text-black"
                  placeholder="Search the recipe"
                  value={text}
                  onChange={handleChange}
                />
                <button
                  className="searchButton"
                  type="submit"
                >
                  Go
                </button>
              </div>
            </div>
          </form>
        </div >
        <div style={{marginTop: "2rem"}}>
        {
          searchedRecipes && searchedRecipes.length !== 0 ?
          searchedRecipes.map((recipe, key) => (
            <ListingItem key={recipe.id} listing={recipe.data} id={recipe.id} />
          )) : <h1 style={{color: "#00cc66"}}>No Recipe to veiw :) search another recipe</h1>
        }
        </div>
      </div>
    </div>
  );
}

export default Offer;
