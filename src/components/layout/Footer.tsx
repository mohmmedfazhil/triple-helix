import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building, MapPin, Phone, Mail, ExternalLink, Sparkles } from 'lucide-react';
import { TamilNaduEmblem } from '../logos/TamilNaduEmblem';
import { TripleHelixLogo } from '../logos/TripleHelixLogo';
import cresImg from './cres.jpg';
import clubImg from './Club.jpg';

export const Footer: React.FC = () => {
  const { setActivePage, currentUser } = useApp();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto pb-24 md:pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Portal Official Branding with both Logos */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 sm:gap-4 bg-white/95 p-2.5 sm:p-3 rounded-xl border border-slate-700/60 w-fit">
              <TamilNaduEmblem size={40} className="w-9 h-9 sm:w-11 sm:h-11" />
              <div className="h-7 sm:h-8 w-px bg-slate-300" />
              <TripleHelixLogo height={34} className="h-7 sm:h-9 w-auto" showText={true} />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              The Triple Helix Portal unites District Administration, Academic Institutions, and Industry Mentors to solve localized real-world challenges through structured student engineering projects and validated milestone governance.
            </p>
            <div className="text-xs text-sky-400 font-medium">
              Government of Tamil Nadu · District Innovation Mission Initiative
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button 
                  onClick={() => setActivePage('home')}
                  className="hover:text-white transition-colors text-slate-400 py-1 text-left cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    try { window.history.pushState({}, '', '/problem-statements'); } catch {}
                    setActivePage('problem-statements');
                  }}
                  className="hover:text-white transition-colors text-slate-400 py-1 text-left cursor-pointer"
                >
                  Problem Statements
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('about')}
                  className="hover:text-white transition-colors text-slate-400 py-1 text-left cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('faq')}
                  className="hover:text-white transition-colors text-slate-400 py-1 text-left cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('contact')}
                  className="hover:text-white transition-colors text-slate-400 py-1 text-left cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('login')}
                  className="hover:text-white transition-colors text-slate-400 py-1 text-left cursor-pointer"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              District Office Contact
            </h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 font-medium">
                  District Innovation & e-Governance Cell
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>District Collectorate Complex, GST Road, Chengalpattu - 603001, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>+91 44 27422201 / 27422202</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="break-all">triplehelix.chengalpattu@tn.gov.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright Notice & Developed by Crescent * Club */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div>
              © {new Date().getFullYear()} Triple Helix Portal. District Innovation & Higher Education Initiative. All rights reserved.
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Government of Tamil Nadu · Civic Innovation Ecosystem
            </div>
          </div>

          {/* Right side: Developed by Crescent * Club */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-2xl shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Developed by
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-2 py-1 rounded-lg border border-white/10 transition-colors shadow-2xs" title="Crescent Institute">
                <img 
                  src={cresImg} 
                  alt="Crescent" 
                  className="h-7 w-auto max-h-7 object-contain rounded-xs" 
                />
                <span className="text-xs font-bold text-white tracking-wide">Crescent</span>
              </div>

              <span className="text-amber-400 font-black text-base px-1 select-none leading-none">*</span>

              <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-2 py-1 rounded-lg border border-white/10 transition-colors shadow-2xs" title="Club">
                <img 
                  src={clubImg} 
                  alt="Club" 
                  className="h-7 w-auto max-h-7 object-contain rounded-xs" 
                />
                <span className="text-xs font-bold text-white tracking-wide">Club</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
