import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-nature-50 py-12 border-t-8 border-secondary">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-heading font-bold text-2xl mb-4 text-secondary">SBA Kaduna</h3>
          <p className="text-nature-100 mb-4">
            Connecting bird lovers, canary breeders, and avian hobbyists across Kaduna. 
            Experience the finest singing competitions and expert breeding insights.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors"><Facebook size={24}/></a>
            <a href="#" className="hover:text-accent transition-colors"><Instagram size={24}/></a>
            <a href="#" className="hover:text-accent transition-colors"><Twitter size={24}/></a>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-bold text-xl mb-4">Quick Links</h4>
          <ul className="space-y-2">
             <li><a href="/" className="hover:text-secondary transition-colors">Home</a></li>
             <li><a href="/about" className="hover:text-secondary transition-colors">About Us</a></li>
             <li><a href="/gallery" className="hover:text-secondary transition-colors">Gallery</a></li>
             <li><a href="/media" className="hover:text-secondary transition-colors">Media Center</a></li>
             <li><a href="/members" className="hover:text-secondary transition-colors">Members & Executives</a></li>
             <li><a href="/contact" className="hover:text-secondary transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
           <h4 className="font-heading font-bold text-xl mb-4">Contact Info</h4>
           <address className="not-italic space-y-2 text-nature-100">
             <p>S. 15 Charanchi Road</p>
             <p>Tudun Wada Kaduna</p>
             <p className="mt-4 flex flex-col gap-1">
               <span>Email: <a href="mailto:abdullahibichishuaib.abs@gmail.com" className="hover:text-nature-50 transition-colors">abdullahibichishuaib.abs@gmail.com</a></span>
               <span>Email: <a href="mailto:mubarakmashi@gmail.com" className="hover:text-nature-50 transition-colors">mubarakmashi@gmail.com</a></span>
             </p>
             <p className="mt-2 text-sm leading-relaxed">
               Phone: <a href="tel:08069771954" className="hover:text-nature-50">0806 977 1954</a> | <a href="tel:08039197650" className="hover:text-nature-50">0803 919 7650</a><br/>
               SMS: <a href="sms:08069771954" className="hover:text-nature-50">0806 977 1954</a> | <a href="sms:08039197650" className="hover:text-nature-50">0803 919 7650</a><br/>
             </p>
           </address>
        </div>
      </div>
      <div className="container mx-auto px-6 text-center mt-12 pt-8 border-t border-primary-light text-sm text-nature-100">
        &copy; <a href="/login" className="hover:text-nature-50 transition-colors">{new Date().getFullYear()}</a> Singing Birds Association - Kaduna Branch. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
