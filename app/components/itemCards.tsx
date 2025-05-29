import React from 'react';


interface CardProps {
  title: string;
  description?: string;
  author?: string;
  provider?: string;
  source?: string;
  image?: string; // URL for the image
}

const Card: React.FC<CardProps> = ({ title, description, author, provider, source, image }) => {
  return (
    <div
      className="border rounded p-4 flex flex-col cursor-pointer hover:shadow-md"
    >
      <div className="h-40 overflow-hidden flex items-center justify-center mb-2">
        {image ? (
          <img src={image} alt={title} className="max-h-full object-contain" />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            No image
          </div>
        )}
      </div>
      <h3 className="font-bold">{title || 'No title'}</h3>
      {author && <p className="text-sm mb-2 flex-grow">{author}</p>}
      {description && (
        <p className="text-sm mb-2 flex-grow">
          {description.length > 150 ? `${description.substring(0, 150)}...` : description}
        </p>
      )}
      {provider && <p className="text-sm mb-2 flex-grow">{provider}</p>}
      {source && (
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          Source
        </a>
      )}
    </div>
  );
};

export default Card;
