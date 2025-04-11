import React, { useState, useEffect } from "react";

const API_KEY = "hpdfGZt2QqryrTmFPaQcKfb-7_JDUCtNrF-F-VL7Bd4";

export default function SearchPage({ onImageSelect }) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [cache, setCache] = useState(() => {
    const savedCache = localStorage.getItem("imageSearchCache");
    return savedCache ? JSON.parse(savedCache) : {};
  });

  useEffect(() => {
    localStorage.setItem("imageSearchCache", JSON.stringify(cache));
  }, [cache]);

  const handleSearch = async () => {
    if (cache[query]) {
      setImages(cache[query]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${API_KEY}`
      );
      const data = await res.json();
      setImages(data.results);

      setCache((prevCache) => ({
        ...prevCache,
        [query]: data.results,
      }));
    } catch (error) {
      alert("Error fetching images");
    }
  };

  return (
    <div className="searchPageWrapper">
      <h1>Search Images</h1>

      <div className="search-section">
        <input
          className="search-bar"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images"
        />
        <button className="searchButton" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="results">
        {images.map((img) => (
          <div key={img.id} className="img-card">
            <img
              src={img.urls.thumb}
              alt={img.alt_description}
              style={{ height: "200px", width: "200px" }}
            />
            <button onClick={() => onImageSelect(img.urls.regular)}>
              Add Caption
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
