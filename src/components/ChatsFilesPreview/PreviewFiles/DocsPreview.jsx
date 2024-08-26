import React from "react";
import { baseUrlForUploads } from "../../../App";
const DocsPreview = ({ src }) => {
  return (
    <div className="w-80   overflow-hidden rounded-lg my-2">
      <embed className="w-full h-full" src={src} />
    </div>
  );
};

export default DocsPreview;
