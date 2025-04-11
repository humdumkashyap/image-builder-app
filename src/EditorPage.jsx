import React, { useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import * as fabric from "fabric";

export default function EditorPage({ selectedImage, goBack }) {
  const { editor, onReady } = useFabricJSEditor();
  let backgroundImage = null;

  useEffect(() => {
    if (editor) {
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.src = selectedImage;

      imgElement.onload = () => {
        const img = new fabric.Image(imgElement, {
          left: 0,
          top: 0,
          selectable: false,
          //   editable: true,
        });

        const canvasWidth = editor.canvas.getWidth();
        const canvasHeight = editor.canvas.getHeight();
        const scaleX = canvasWidth / img.width;
        const scaleY = canvasHeight / img.height;
        const scale = Math.min(scaleX, scaleY);

        img.set({
          scaleX: scale,
          scaleY: scale,
        });

        editor.canvas.add(img);
        editor.canvas.sendObjectBackwards(img);
        backgroundImage = img;
        editor.canvas.renderAll();
      };
    }
  }, [editor, selectedImage]);

  const addText = () => {
    if (!editor) {
      alert("Canvas not ready!");
      return;
    }

    const text = new fabric.Textbox("Your caption here", {
      left: 50,
      top: 50,
      fontSize: 30,
      fill: "black",
      editable: true,
      selectable: true,
    });

    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);
    const objects = editor.canvas.getObjects();
    editor.canvas.moveTo(text, objects.length - 1);

    editor.canvas.renderAll();
  };

  const addShape = (type) => {
    if (!editor) return;

    let shape;
    switch (type) {
      case "circle":
        shape = new fabric.Circle({
          radius: 50,
          fill: "red",
          left: 100,
          top: 100,
          selectable: true,
        });
        break;
      case "rect":
        shape = new fabric.Rect({
          width: 100,
          height: 100,
          fill: "blue",
          left: 150,
          top: 150,
          selectable: true,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: "green",
          left: 200,
          top: 200,
          selectable: true,
        });
        break;
      case "polygon":
        shape = new fabric.Polygon(
          [
            { x: 200, y: 0 },
            { x: 250, y: 50 },
            { x: 200, y: 100 },
            { x: 150, y: 50 },
          ],
          {
            fill: "purple",
            left: 200,
            top: 200,
            selectable: true,
          }
        );
        break;
      default:
        return;
    }

    editor.canvas.add(shape);
    editor.canvas.setActiveObject(shape);
    if (backgroundImage) backgroundImage.sendToBack();
    editor.canvas.renderAll();
  };

  const downloadImage = () => {
    const dataURL = editor?.canvas.toDataURL({ format: "png" });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "modified-image.png";
    link.click();
  };

  return (
    <div>
      <h1>Image Editor</h1>
      <div className="backButton">
        <button onClick={goBack}>Go Back</button>
      </div>
      <div className="EditorPageWapper">
        <div className="editor">
          <FabricJSCanvas className="canvas" onReady={onReady} />
        </div>
        <div className="tools">
          <h3>Editing Tools</h3>
          <div>
            <button onClick={addText}>Add Text</button>
            <button onClick={() => addShape("circle")}>Add Circle</button>
            <button onClick={() => addShape("rect")}>Add Rectangle</button>
            <button onClick={() => addShape("triangle")}>Add Triangle</button>
            <button onClick={() => addShape("polygon")}>Add Polygon</button>
          </div>
          <button onClick={downloadImage}>Download</button>
        </div>
      </div>
    </div>
  );
}
