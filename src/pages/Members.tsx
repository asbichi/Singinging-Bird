import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export interface Member {
  id: string;
  name: string;
  role: string;
  type: 'executive' | 'general';
  image: string;
}

const Members = () => {
  const [membersList, setMembersList] = useState<Member[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sba_members');
    
    // AI generated placeholders to remove
    const aiGeneratedIds = ['1', '2', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    if (saved) {
      const parsed = JSON.parse(saved);
      let updated = parsed.filter((m: Member) => !aiGeneratedIds.includes(m.id));
      let changed = (updated.length !== parsed.length);
      
      if (!updated.some((m: Member) => m.name === 'Mahmud Ibrahim Jalingo')) {
        updated.unshift({ id: '0', name: "Mahmud Ibrahim Jalingo", role: "Chairman Board of Trustee", type: 'executive', image: "https://i.ibb.co/d4NbRZy1/mahmud.jpg" });
        changed = true;
      }
      
      if (!updated.some((m: Member) => m.name === "Abdullahi Ya'u")) {
        const insertIndex = updated.findIndex((m: Member) => m.name === 'Mahmud Ibrahim Jalingo');
        updated.splice(insertIndex !== -1 ? insertIndex + 1 : 0, 0, { id: '0-1', name: "Abdullahi Ya'u", role: "Vice Chairman Board of Trustee", type: 'executive', image: "https://i.ibb.co/cK6sYDvj/woza.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Dr. Mubarak Ahmed")) {
        const insertIndex = updated.findIndex((m: Member) => m.name === "Abdullahi Ya'u");
        updated.splice(insertIndex !== -1 ? insertIndex + 1 : 0, 0, { id: '0-2', name: "Dr. Mubarak Ahmed", role: "Chairman", type: 'executive', image: "https://i.ibb.co/VcTz7vwr/mubarka.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Abdullahi Shuaibu Bichi")) {
        const insertIndex = updated.findIndex((m: Member) => m.name === "Dr. Mubarak Ahmed");
        updated.splice(insertIndex !== -1 ? insertIndex + 1 : 0, 0, { id: '0-3', name: "Abdullahi Shuaibu Bichi", role: "Vice Chairman", type: 'executive', image: "https://i.ibb.co/Ld2fjJBQ/bichi.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Bashir Abduullahi")) {
        const insertIndex = updated.findIndex((m: Member) => m.name === "Abdullahi Shuaibu Bichi");
        updated.splice(insertIndex !== -1 ? insertIndex + 1 : 0, 0, { id: '0-4', name: "Bashir Abduullahi", role: "PRO 2", type: 'executive', image: "https://i.ibb.co/ZzHm6K5J/bashar.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Mohammed Mustapha Bulama")) {
        const insertIndex = updated.findIndex((m: Member) => m.name === "Bashir Abduullahi");
        updated.splice(insertIndex !== -1 ? insertIndex + 1 : 0, 0, { id: '0-5', name: "Mohammed Mustapha Bulama", role: "PRO 1", type: 'executive', image: "https://i.ibb.co/B5xK2yjj/muhammed-pro.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Balarabe Yakubu")) {
        const insertIndex = updated.findIndex((m: Member) => m.name === "Mohammed Mustapha Bulama");
        updated.splice(insertIndex !== -1 ? insertIndex + 1 : 0, 0, { id: '0-6', name: "Balarabe Yakubu", role: "Judge 1", type: 'executive', image: "https://i.ibb.co/20N3Rp3j/bala.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Abubakar Sadauki Jibril (babawo)")) {
        const insertIndex = updated.findIndex((m: Member) => m.name === "Balarabe Yakubu");
        updated.splice(insertIndex !== -1 ? insertIndex + 1 : 0, 0, { id: '0-7', name: "Abubakar Sadauki Jibril (babawo)", role: "Judge 2", type: 'executive', image: "https://i.ibb.co/8nmTGsG8/bawo.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Abubakar Safiyanu")) {
        updated.push({ id: '0-8', name: "Abubakar Safiyanu", role: "Member", type: 'general', image: "https://i.ibb.co/hx0vC757/5c809e8b-5772-4d04-845f-0aea0e440902.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Jamilu Haruna Danja")) {
        updated.push({ id: '0-9', name: "Jamilu Haruna Danja", role: "Member", type: 'general', image: "https://i.ibb.co/v0WY1yP/jzmil.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Ja'afar Auwal")) {
        updated.push({ id: '0-10', name: "Ja'afar Auwal", role: "Member", type: 'general', image: "https://i.ibb.co/v486SvXJ/Ja-afar.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Isah Abdullahi")) {
        updated.push({ id: '0-11', name: "Isah Abdullahi", role: "Member", type: 'general', image: "https://i.ibb.co/Dfj1TfbM/eba9d9ad-78f2-421e-9cf1-1de28973a287.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name === "Idris Isma'il")) {
        updated.push({ id: '0-12', name: "Idris Isma'il", role: "Member", type: 'general', image: "https://i.ibb.co/sJHbhnTy/bce29db4-ee8a-4659-b547-fe7e97666a02.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name.includes("George Ado"))) {
        updated.push({ id: '0-13', name: "Engr. George Ado", role: "Member", type: 'general', image: "https://i.ibb.co/Q3JjSmsw/0218bd58-65a5-4460-aa96-79b9b8207a34.jpg" });
        changed = true;
      } else {
        // Automatically migrate any existing cached entry for George Ado set to the temporary unsplash thumbnail
        updated = updated.map((m: Member) => {
          if (m.name.includes("George Ado") && m.image.includes("unsplash.com")) {
            changed = true;
            return { ...m, image: "https://i.ibb.co/Q3JjSmsw/0218bd58-65a5-4460-aa96-79b9b8207a34.jpg" };
          }
          return m;
        });
      }

      if (!updated.some((m: Member) => m.name.includes("Abdullahi Muhammad Ciroma"))) {
        updated.push({ id: '0-14', name: "Abdullahi Muhammad Ciroma", role: "Treasurer", type: 'executive', image: "https://i.ibb.co/B5HVyxL2/5188e667-db17-4b34-b488-feec8cc8a8c3-1.jpg" });
        changed = true;
      }

      if (!updated.some((m: Member) => m.name.includes("Nazifi Ya'u"))) {
        updated.push({ id: '0-15', name: "Nazifi Ya'u", role: "Member", type: 'general', image: "https://i.ibb.co/nsft7W4b/12c4b8d0-7d0f-4c32-a459-f7e74b095d50.jpg" });
        changed = true;
      }

      if (changed) {
        setMembersList(updated);
        localStorage.setItem('sba_members', JSON.stringify(updated));
      } else {
        setMembersList(updated);
      }
    } else {
      const defaultMembers: Member[] = [
        { id: '0', name: "Mahmud Ibrahim Jalingo", role: "Chairman Board of Trustee", type: 'executive', image: "https://i.ibb.co/d4NbRZy1/mahmud.jpg" },
        { id: '0-1', name: "Abdullahi Ya'u", role: "Vice Chairman Board of Trustee", type: 'executive', image: "https://i.ibb.co/cK6sYDvj/woza.jpg" },
        { id: '0-2', name: "Dr. Mubarak Ahmed", role: "Chairman", type: 'executive', image: "https://i.ibb.co/VcTz7vwr/mubarka.jpg" },
        { id: '0-3', name: "Abdullahi Shuaibu Bichi", role: "Vice Chairman", type: 'executive', image: "https://i.ibb.co/Ld2fjJBQ/bichi.jpg" },
        { id: '0-5', name: "Mohammed Mustapha Bulama", role: "PRO 1", type: 'executive', image: "https://i.ibb.co/B5xK2yjj/muhammed-pro.jpg" },
        { id: '0-6', name: "Balarabe Yakubu", role: "Judge 1", type: 'executive', image: "https://i.ibb.co/20N3Rp3j/bala.jpg" },
        { id: '0-7', name: "Abubakar Sadauki Jibril (babawo)", role: "Judge 2", type: 'executive', image: "https://i.ibb.co/8nmTGsG8/bawo.jpg" },
        { id: '0-4', name: "Bashir Abduullahi", role: "PRO 2", type: 'executive', image: "https://i.ibb.co/ZzHm6K5J/bashar.jpg" },
        { id: '3', name: "Sani Musa Kala", role: "Secretary", type: 'executive', image: "https://i.ibb.co/tMzB99fh/54658ae9-cfa2-4e67-adf1-a81b94c750fe.jpg" },
        { id: '0-8', name: "Abubakar Safiyanu", role: "Member", type: 'general', image: "https://i.ibb.co/hx0vC757/5c809e8b-5772-4d04-845f-0aea0e440902.jpg" },
        { id: '0-9', name: "Jamilu Haruna Danja", role: "Member", type: 'general', image: "https://i.ibb.co/v0WY1yP/jzmil.jpg" },
        { id: '0-10', name: "Ja'afar Auwal", role: "Member", type: 'general', image: "https://i.ibb.co/v486SvXJ/Ja-afar.jpg" },
        { id: '0-11', name: "Isah Abdullahi", role: "Member", type: 'general', image: "https://i.ibb.co/Dfj1TfbM/eba9d9ad-78f2-421e-9cf1-1de28973a287.jpg" },
        { id: '0-12', name: "Idris Isma'il", role: "Member", type: 'general', image: "https://i.ibb.co/sJHbhnTy/bce29db4-ee8a-4659-b547-fe7e97666a02.jpg" },
        { id: '0-13', name: "Engr. George Ado", role: "Member", type: 'general', image: "https://i.ibb.co/Q3JjSmsw/0218bd58-65a5-4460-aa96-79b9b8207a34.jpg" },
        { id: '0-14', name: "Abdullahi Muhammad Ciroma", role: "Treasurer", type: 'executive', image: "https://i.ibb.co/B5HVyxL2/5188e667-db17-4b34-b488-feec8cc8a8c3-1.jpg" },
        { id: '0-15', name: "Nazifi Ya'u", role: "Member", type: 'general', image: "https://i.ibb.co/nsft7W4b/12c4b8d0-7d0f-4c32-a459-f7e74b095d50.jpg" }
      ];
      setMembersList(defaultMembers);
      localStorage.setItem('sba_members', JSON.stringify(defaultMembers));
    }
  }, []);

  const executives = membersList.filter(m => m.type === 'executive');
  const members = membersList.filter(m => m.type === 'general');

  return (
    <div className="pt-32 pb-20 bg-nature-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-4xl font-heading font-black text-primary mb-2 text-center">Association Members</h1>
        <p className="text-center text-gray-600 mb-12">Meet the dedicated executive team and hobbyists of the Kaduna Branch.</p>
        
        {/* Executives Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-primary mb-8 border-b-2 border-secondary pb-2 inline-block">Executive Committee</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {executives.map((exec, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-nature-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform">
                <img src={exec.image} alt={exec.name} className="w-56 h-56 rounded-full mb-4 border-4 border-nature-50 shadow-sm object-cover" />
                <h3 className="font-bold text-lg text-gray-800">{exec.name}</h3>
                <p className="text-sm font-semibold text-accent mt-1 uppercase tracking-wider">{exec.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Members Section */}
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary mb-8 border-b-2 border-secondary pb-2 inline-block">Other Members</h2>
          <div className="bg-white rounded-2xl p-8 shadow-md border border-nature-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {members.map((member, idx) => (
                <div key={member.id} className="flex flex-col items-center gap-3 text-center transition-transform hover:scale-105">
                  <img src={member.image || 'https://via.placeholder.com/150'} alt={member.name} className="w-48 h-48 bg-nature-50 rounded-full object-cover shadow-sm border-2 border-white" />
                  <div>
                    <span className="font-bold text-gray-700 block">{member.name}</span>
                    {member.role && member.role !== 'Member' && <span className="text-xs text-gray-500">{member.role}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 italic">...and many more passionate breeders and bird lovers in Kaduna.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
