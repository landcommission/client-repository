import React, { useState } from "react";

const TruncatedDescription = ({ description }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = description
    ? description.split(" ").slice(0, 40).join(" ")
    : "This file was uploaded into the repository by National Land Commission";

  return (
    <div>
      <p className="text-sm text-gray-600">
        {showFullDescription ? description : truncatedDescription}
        {description && description.split(" ").length > 40 && (
          <span>
            {showFullDescription ? (
              <br />
            ) : (
                <span className="font-bold text-gray-950 text-lg">{" ..."}</span>
            )}
            <br />
            <span className="cursor-pointer font-semibold text-red-700 underline" onClick={toggleDescription}>
              {showFullDescription ? "See less" : "Read more"}
            </span>
          </span>
        )}
      </p>
    </div>
  );
};

export default TruncatedDescription;
