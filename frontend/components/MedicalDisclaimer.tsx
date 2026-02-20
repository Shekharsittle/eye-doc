
import React from 'react';
import { ShieldAlert, X, PhoneCall } from 'lucide-react';

interface MedicalDisclaimerProps {
  onClose: () => void;
}

const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-amber-50 p-6 flex items-start gap-4 border-b border-amber-100">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900">Medical Disclaimer</h3>
            <p className="text-amber-800/80 text-sm mt-1">Please read carefully before proceeding.</p>
          </div>
          <button 
            onClick={onClose}
            className="ml-auto p-2 hover:bg-amber-100 rounded-full text-amber-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong>Dr. Mrityunjay Singh AI is an AI assistant specializing in Ophthalmology.</strong> It is not a licensed medical professional.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>This tool provides educational information about eye care and vision health.</li>
              <li>It does <strong>not</strong> replace a physical eye examination (slit-lamp exam, fundoscopy, etc.) by a qualified Ophthalmologist.</li>
              <li>Do not use this tool for eye emergencies like chemical burns, penetrating injuries, or sudden vision loss.</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <PhoneCall size={20} />
            </div>
            <div className="text-xs text-red-900">
              <strong>Eye Emergency?</strong> If you have sudden vision loss, severe pain, or chemical injury, go to an <strong>Emergency Room</strong> immediately.
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-all"
          >
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
