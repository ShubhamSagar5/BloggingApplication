import axios from "axios";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const PopularAuthors = () => {
  const [authors, setAuthors] = useState([]);
  useEffect(() => {
    const fetchAuthors = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/getAllAuthor",
        { withCredentials: true }
      );
      setAuthors(data.author);
    };
    fetchAuthors();
  }, []);
  return (
    <section className="popularAuthors">
      <h3>Popular Authors</h3>
      <div className="container">
        {authors && authors.length > 0 ? (
          authors.slice(0, 4).map((element) => {
            return (
              <div className="card" key={element._id}>
                <img src={element.avatar.url} alt="author" />
                <p>{element.name}</p>
                <p>{element.role}</p>
              </div>
            );
          })
        ) : (
          <BeatLoader size={30} color='gray' style={{display:"flex",
          justifyContent:"center",alignItems:"center",width: "100%"}}/>
        )}
      </div>
    </section>
  );
};

export default PopularAuthors;