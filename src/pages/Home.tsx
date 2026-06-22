import Hero from '../components/Home/Hero';

const Home = () => {
  return (
    <div>
      <Hero />
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Latest from Kaduna Branch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with the latest bird singing videos, top-voted sounds, and featured members of our community.</p>
          </div>
          
          {/* Featured Sections Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-nature-50 p-8 rounded-2xl text-center hover:-translate-y-2 transition-transform shadow-md">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎥</div>
                <h3 className="font-bold text-xl mb-2 text-primary">Latest Videos</h3>
                <p className="text-gray-600">Watch the recent singing competitions and training sessions.</p>
             </div>
             <div className="bg-nature-50 p-8 rounded-2xl text-center hover:-translate-y-2 transition-transform shadow-md">
                <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔊</div>
                <h3 className="font-bold text-xl mb-2 text-primary">Top Bird Sounds</h3>
                <p className="text-gray-600">Listen and download high-quality canary singing recordings.</p>
             </div>
             <div className="bg-nature-50 p-8 rounded-2xl text-center hover:-translate-y-2 transition-transform shadow-md">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🏆</div>
                <h3 className="font-bold text-xl mb-2 text-primary">Featured Birds</h3>
                <p className="text-gray-600">Discover the champions of our recent Kaduna branch showcases.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
