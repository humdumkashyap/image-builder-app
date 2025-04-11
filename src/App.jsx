import React, { useState } from "react";
import SearchPage from "./SearchPage";
import EditorPage from "./EditorPage";
import "./App.css";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="App">
      {selectedImage ? (
        <EditorPage
          selectedImage={selectedImage}
          goBack={() => setSelectedImage(null)}
        />
      ) : (
        <SearchPage onImageSelect={(image) => setSelectedImage(image)} />
      )}
    </div>
  );
}
