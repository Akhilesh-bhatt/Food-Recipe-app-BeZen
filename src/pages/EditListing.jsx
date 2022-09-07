import { useState, useEffect, useRef } from "react";
import Spinner from "../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";

function EditListing() {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(false);
  const params = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    directions: [],
    ingredients: [],
    images: {},
  });
  const { title, description, directions, ingredients, images } = formData;
  const isMounted = useRef(true);
  const auth = getAuth();
  const navigate = useNavigate();

  //Redirects if listing is not user's
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can not edit this listing!");
      navigate("/");
    }
  });

  //fetch data of listing
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist!");
      }
    };
    fetchListing();
  }, [params.listingId, navigate]);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/signin");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (images.length > 3) {
      setLoading(false);
      toast.error("Maximum 3 files can be uploaded");
      return;
    }

    //store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "image/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Files not uploaded!");
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;

    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing updated!");
    navigate(`/category/food/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = false;
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const handleIngredientCount = () => {
    setFormData({
      ...formData,
      ingredients: [...ingredients, ""],
    });
  };

  const handleStepCount = () => {
    setFormData({
      ...formData,
      directions: [...directions, ""],
    });
  };

  const handleIngredient = (e, i) => {
    const ingredientsClone = [...ingredients];

    ingredientsClone[i] = e.target.value;

    setFormData({
      ...formData,
      ingredients: ingredientsClone,
    });
  };

  const handleStep = (e, i) => {
    const stepsClone = [...directions];

    stepsClone[i] = e.target.value;

    setFormData({
      ...formData,
      directions: stepsClone,
    });
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="formLabel">Title</label>
            <input
              id="title"
              className="formInputName"
              value={title}
              onChange={onMutate}
              maxLength="32"
              minLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label className="formLabel">Description</label>
            <textarea
              type="text"
              className="formInputAddress"
              id="description"
              value={description}
              onChange={onMutate}
              maxLength="90"
              minLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label className="formLabel">Ingredients</label>
            {ingredients.map((ingredient, i) => (
              <input
                type="text"
                key={i}
                className="formInputName"
                value={ingredient}
                onChange={(e) => handleIngredient(e, i)}
              />
            ))}

            <button
              type="button"
              onClick={handleIngredientCount}
              className="formButtonActive"
            >
              Add ingredient
            </button>
          </div>

          <div className="form-group">
            <label className="formLabel">Steps</label>
            {directions.map((step, i) => (
              <textarea
                type="text"
                key={i}
                className="formInputName"
                value={step}
                onChange={(e) => handleStep(e, i)}
              />
            ))}

            <button
              type="button"
              onClick={handleStepCount}
              className="formButtonActive"
            >
              Add step
            </button>
          </div>

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 2).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Edit Recipe
          </button>
        </form>
      </main>
    </div>
  );
}

export default EditListing;
