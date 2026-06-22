const About = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-[80vh]">
      <h1 className="text-4xl font-heading font-black text-primary mb-8 text-center animate-fade-in-up">About Us</h1>
      
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-nature-100">
        <h2 className="text-2xl font-bold text-secondary-dark mb-4">History of the Association</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The Singing Birds Association (Kaduna Branch) was established to connect avian enthusiasts, canary breeders, and nature lovers across the region. We recognized a growing passion for avian care and singing competitions, aiming to create a centralized community to share knowledge and foster ethical breeding practices.
        </p>

        <h2 className="text-2xl font-bold text-secondary-dark mb-4">Mission & Vision</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Our mission is to support the avian hobbyist community by providing resources, organizing competitions, and promoting the well-being of singing birds. 
          Our vision is to become the premier association in West Africa for high-quality canary breeding and singing excellence.
        </p>

        <h2 className="text-2xl font-bold text-secondary-dark mb-4">Benefits of Joining</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
          <li>Access to exclusive singing competitions and exhibitions.</li>
          <li>Networking with experienced breeders and enthusiasts.</li>
          <li>Free workshops on avian health, diet prep, and breeding techniques.</li>
          <li>Access to our vast media library of bird songs for training.</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
