import MediaGrid from '../components/Media/MediaGrid';
import BirdAudioPlayer from '../components/Media/BirdAudioPlayer';

const Media = () => {
  return (
    <div className="pt-32 pb-20 bg-nature-50 min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-heading font-black text-primary mb-2 text-center">Media Center</h1>
        <p className="text-center text-gray-600 mb-12">Listen to top bird sounds and watch breeding guides.</p>
        
        {/* Featured Audio Player section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">Featured Song of the Week</h2>
          <BirdAudioPlayer 
            audioUrl="https://upload.wikimedia.org/wikipedia/commons/b/b5/Chaffinch_song_1.ogg" 
            birdName="Champion Harz Roller" 
          />
        </div>

        <MediaGrid />
      </div>
    </div>
  );
};

export default Media;
