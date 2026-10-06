import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TamilNaduEmblem } from '../logos/TamilNaduEmblem';
import { TripleHelixLogo } from '../logos/TripleHelixLogo';
import { 
  Award, 
  ArrowLeft, 
  Printer, 
  Download, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  projectId: string;
  onBack: () => void;
}

export const CertificateView: React.FC<Props> = ({ projectId, onBack }) => {
  const { projects, institutions } = useApp();

  const project = projects.find(p => p.id === projectId);
  const institution = institutions.find(i => i.id === project?.selectedByInstitutionId);

  // Active Certificate Tab: 'institution' | studentId
  const [activeCert, setActiveCert] = useState<string>('institution');
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Confetti celebration when opening completed certificates
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <p className="text-slate-600">Project record not found.</p>
        <button onClick={onBack} className="mt-4 text-xs font-semibold text-sky-700 underline">
          Back
        </button>
      </div>
    );
  }

  const completionDate = project.completionDate || '2026-03-24';
  const students = project.team?.students || [];
  const selectedStudent = students.find(s => s.id === activeCert);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCertificate = () => {
    const certType = activeCert === 'institution' ? 'Institution_Certificate' : `Student_Certificate_${selectedStudent?.fullName.replace(/\s+/g, '_')}`;
    const certContent = `
================================================================================
GOVERNMENT OF TAMIL NADU - DISTRICT INNOVATION MISSION
TRIPLE HELIX ACCREDITED COMPLETION CERTIFICATE
================================================================================
Certificate ID: TH-CERT-${project.id}-${Date.now().toString().slice(-6)}
Issue Date: ${completionDate}

${activeCert === 'institution' ? `
INSTITUTION COMPLETION CERTIFICATE
This is to certify that:
Institution: ${project.selectedByInstitutionName || institution?.name}
Has successfully developed, validated, and completed the district problem statement:
Project: "${project.title}"
Under Department: ${project.department}
Completion Date: ${completionDate}
` : `
STUDENT MERIT & ENGINEERING EXCELLENCE CERTIFICATE
This is to certify that:
Student Name: ${selectedStudent?.fullName}
Register Number: ${selectedStudent?.registerNumber}
Department: ${selectedStudent?.department}
Institution: ${project.selectedByInstitutionName || institution?.name}
Has successfully completed the engineering solution for:
Project: "${project.title}"
Role: ${selectedStudent?.isLeader ? 'Designated Team Leader' : 'Core Engineering Member'}
Completion Date: ${completionDate}
`}
================================================================================
Digitally Verified & Sealed by District Collectorate and State Higher Education Council
================================================================================
    `;

    const blob = new Blob([certContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${certType}_${project.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Bar Navigation & Actions (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Workspace</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
          <button
            onClick={handleDownloadCertificate}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Certificate (.txt)</span>
          </button>
        </div>
      </div>

      {/* Certificate Selector Tabs (SRS Section 22: Institution Certificate + Student Certificates) */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold overflow-x-auto pb-2 print:hidden">
        <button
          onClick={() => setActiveCert('institution')}
          className={`py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeCert === 'institution'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Institution Certificate</span>
        </button>

        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => setActiveCert(student.id)}
            className={`py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeCert === student.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Student: {student.fullName}</span>
          </button>
        ))}
      </div>

      {/* PRINTABLE OFFICIAL CERTIFICATE CONTAINER */}
      <div 
        ref={certificateRef}
        className="w-full bg-[#fdfdfc] text-slate-900 border-4 sm:border-8 border-double border-slate-800 rounded-xl p-4 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden font-serif selection:bg-amber-100"
      >
        {/* Subtle Ornamental Corner Details */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-6 h-6 sm:w-10 sm:h-10 border-t-2 border-l-2 border-slate-700 pointer-events-none" />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-10 sm:h-10 border-t-2 border-r-2 border-slate-700 pointer-events-none" />
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-10 sm:h-10 border-b-2 border-l-2 border-slate-700 pointer-events-none" />
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-6 h-6 sm:w-10 sm:h-10 border-b-2 border-r-2 border-slate-700 pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center space-y-2 sm:space-y-3 border-b-2 border-slate-300 pb-5 sm:pb-8">
          
          {/* Government / Mission Official Crests */}
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <TamilNaduEmblem size={44} className="w-10 h-10 sm:w-14 sm:h-14" />
            <div className="h-8 sm:h-10 w-px bg-slate-300" />
            <TripleHelixLogo height={38} className="h-8 sm:h-11 w-auto" showText={true} />
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-sans font-bold text-slate-600">
              Government of Tamil Nadu · District Innovation Mission
            </h4>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-wide text-slate-900 uppercase">
              Triple Helix Certificate of Excellence
            </h2>
            <p className="text-[10px] sm:text-xs font-sans text-slate-500 italic">
              Conferred Under The Tripartite District Engineering Innovation Framework
            </p>
          </div>
        </div>

        {/* Certificate Content: Institution vs Student (SRS Section 22) */}
        <div className="py-10 text-center space-y-6">
          
          {activeCert === 'institution' ? (
            /* INSTITUTION CERTIFICATE (SRS Section 22: Institution Name, Project Name, Completion Date) */
            <div className="space-y-6 max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-wider text-slate-500 font-sans">
                This Certificate of Institutional Distinction is proudly presented to
              </p>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-sky-950 font-serif border-b border-slate-300 pb-2 inline-block">
                {project.selectedByInstitutionName || institution?.name || 'Institution Name'}
              </h1>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans max-w-2xl mx-auto">
                in recognition of outstanding academic engineering achievement and civic innovation in successfully designing, developing, and field-validating all mandated milestones for the district problem statement:
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-w-2xl mx-auto">
                <span className="text-xs font-sans uppercase font-bold text-slate-500 block mb-1">
                  Project Title
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-900 font-serif block">
                  "{project.title}"
                </span>
                <span className="text-xs text-slate-500 font-sans mt-1 block">
                  Department of {project.department} · {project.sector}
                </span>
              </div>

              <div className="text-xs font-sans text-slate-600">
                Official Completion Date: <strong className="text-slate-900 font-mono">{completionDate}</strong>
              </div>
            </div>
          ) : (
            /* STUDENT CERTIFICATE (SRS Section 22: Student Name, Register Number, Project Name, Institution Name) */
            <div className="space-y-6 max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-wider text-slate-500 font-sans">
                This Certificate of Collegiate Engineering Merit is awarded to
              </p>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-sky-950 font-serif border-b border-slate-300 pb-1 inline-block">
                  {selectedStudent?.fullName}
                </h1>
                <div className="text-xs font-sans font-mono text-slate-600">
                  Register Number: <strong className="text-slate-900">{selectedStudent?.registerNumber}</strong>
                </div>
              </div>

              <p className="text-sm text-slate-700 font-sans max-w-2xl mx-auto leading-relaxed">
                enrolled at <strong>{project.selectedByInstitutionName || institution?.name}</strong>, for successfully demonstrating engineering rigor, technical leadership, and collaborative excellence on:
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-w-2xl mx-auto">
                <span className="text-base sm:text-lg font-bold text-slate-900 font-serif block">
                  "{project.title}"
                </span>
                <span className="text-xs text-slate-500 font-sans mt-0.5 block">
                  {selectedStudent?.department} · {selectedStudent?.year}
                </span>
              </div>

              <div className="text-xs font-sans text-slate-600">
                Issued in Chengalpattu, Tamil Nadu on <strong className="text-slate-900 font-mono">{completionDate}</strong>
              </div>
            </div>
          )}

        </div>

        {/* Certificate Signatures & Security Footer */}
        <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-sans text-xs">
          
          {/* Sign 1: District Collector */}
          <div className="space-y-1 flex flex-col items-center">
            <div className="h-10 flex items-end">
              <span className="font-serif italic text-base font-bold text-slate-800">
                S. Arunraj, IAS
              </span>
            </div>
            <div className="w-36 border-t border-slate-700 mt-1 pt-1 font-bold text-slate-900">
              District Collector
            </div>
            <div className="text-[10px] text-slate-500">Chengalpattu District</div>
          </div>

          {/* Center: Official Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 bg-amber-50/50 flex flex-col items-center justify-center p-1 text-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-amber-700" />
              <span className="text-[8px] font-bold text-amber-900 uppercase">OFFICIAL SEAL</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-1">
              TH-{project.id}
            </span>
          </div>

          {/* Sign 3: Industry Mentor & Academic Lead */}
          <div className="space-y-1 flex flex-col items-center">
            <div className="h-10 flex items-end">
              <span className="font-serif italic text-base font-bold text-slate-800">
                {project.assignedMentorName || 'Dr. Rajeshwari Krishnan'}
              </span>
            </div>
            <div className="w-36 border-t border-slate-700 mt-1 pt-1 font-bold text-slate-900">
              Industry Chief Mentor
            </div>
            <div className="text-[10px] text-slate-500">Technical Advisory Council</div>
          </div>

        </div>

      </div>

    </div>
  );
};
