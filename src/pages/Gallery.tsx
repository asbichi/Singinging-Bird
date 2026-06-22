import MediaGrid from '../components/Media/MediaGrid';

const Gallery = () => {
  return (
    <div className="pt-32 pb-20 bg-nature-50 min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-heading font-black text-primary mb-2 text-center">Bird Gallery</h1>
        <p className="text-center text-gray-600 mb-12">Browse beautiful images of our members' finest birds.</p>
        
        <MediaGrid defaultFilter="image" />
      </div>
    </div>
  );
};

export default Gallery;
