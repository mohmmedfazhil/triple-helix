import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { 
  Users, 
  X, 
  Plus, 
  Trash2, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  projectId: string;
  onClose: () => void;
  onTeamCreatedSuccess: () => void;
}

export const TeamCreationModal: React.FC<Props> = ({
  isOpen,
  projectId,
  onClose,
  onTeamCreatedSuccess
}) => {
  const { projects, blockAndCreateTeam, triggerError } = useApp();

  const project = projects.find(p => p.id === projectId);

  // Student list state (starts with 1 student, max 5 per SRS Section 11)
  const [students, setStudents] = useState<Omit<Student, 'id'>[]>([
    {
      fullName: '',
      registerNumber: '',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      email: '',
      mobileNumber: '',
      isLeader: true // default first student is leader
    }
  ]);

  const [formErrors, setFormErrors] = useState<string[]>([]);

  if (!isOpen || !project) return null;

  const handleAddStudent = () => {
    if (students.length >= 5) {
      triggerError('Project Selection Errors', 'A maximum of 5 students is permitted per project team (SRS Section 11).');
      return;
    }

    setStudents(prev => [
      ...prev,
      {
        fullName: '',
        registerNumber: '',
        department: 'Electronics and Communication',
        year: '3rd Year',
        email: '',
        mobileNumber: '',
        isLeader: false
      }
    ]);
  };

  const handleRemoveStudent = (index: number) => {
    if (students.length <= 1) {
      triggerError('Project Selection Errors', 'At least one student must be added to form a project team.');
      return;
    }

    const wasLeader = students[index].isLeader;
    const updated = students.filter((_, i) => i !== index);
    
    // If the removed student was leader, assign leader to the first remaining student
    if (wasLeader && updated.length > 0) {
      updated[0].isLeader = true;
    }

    setStudents(updated);
  };

  const updateStudentField = (index: number, field: keyof Omit<Student, 'id'>, value: any) => {
    setStudents(prev => {
      const copy = [...prev];
      if (field === 'isLeader') {
        // Enforce exactly ONE leader rule (SRS Section 11)
        copy.forEach((s, idx) => {
          s.isLeader = idx === index;
        });
      } else {
        (copy[index] as any)[field] = value;
      }
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    // Validation Rules (SRS Section 11)
    if (students.length === 0 || students.length > 5) {
      errors.push('Team size must be between 1 and 5 students');
    }

    const leaderCount = students.filter(s => s.isLeader).length;
    if (leaderCount !== 1) {
      errors.push('Exactly one student must be designated as Team Leader');
    }

    // Check each student required fields
    const regNumbers = new Set<string>();

    students.forEach((s, i) => {
      const num = i + 1;
      if (!s.fullName.trim()) errors.push(`Student #${num}: Full Name is required`);
      if (!s.registerNumber.trim()) {
        errors.push(`Student #${num}: Register Number is required`);
      } else {
        const cleanReg = s.registerNumber.trim().toUpperCase();
        if (regNumbers.has(cleanReg)) {
          errors.push(`Duplicate Register Number "${cleanReg}" found on Student #${num}`);
        }
        regNumbers.add(cleanReg);
      }
      if (!s.department.trim()) errors.push(`Student #${num}: Department is required`);
      if (!s.email.trim() || !s.email.includes('@')) errors.push(`Student #${num}: Valid Email is required`);
      if (!s.mobileNumber.trim()) errors.push(`Student #${num}: Mobile Number is required`);
    });

    if (errors.length > 0) {
      setFormErrors(errors);
      triggerError('Registration Errors', errors[0]);
      return;
    }

    setFormErrors([]);

    const result = blockAndCreateTeam(projectId, students);
    if (result.success) {
      onTeamCreatedSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-sky-50 border-b border-sky-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Team Creation & Project Assignment
              </h2>
              <p className="text-xs text-slate-500">
                Locking <strong className="text-slate-800">{project.id}</strong> · {project.title.substring(0, 45)}...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Instructions & Constraints (SRS Section 11) */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800">Team Assembly Specifications:</span>
              <p>
                Maximum of 5 students per team. Exactly one member must be marked as <strong>Team Leader</strong>. All members will be named on final verified government student completion certificates upon Milestone 3 approval.
              </p>
            </div>
          </div>

          {/* Form Errors */}
          {formErrors.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Please correct the team roster:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                {formErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Student Cards Roster */}
            <div className="space-y-4">
              {students.map((student, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    student.isLeader 
                      ? 'bg-sky-50/50 border-sky-300 ring-1 ring-sky-200' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">
                        Student #{idx + 1}
                      </span>

                      {/* Team Leader Selector (Exactly one required) */}
                      <label className="flex items-center gap-1.5 cursor-pointer ml-2">
                        <input
                          type="radio"
                          name="teamLeaderRadio"
                          checked={student.isLeader}
                          onChange={() => updateStudentField(idx, 'isLeader', true)}
                          className="text-sky-600"
                        />
                        <span className={`text-xs font-semibold flex items-center gap-1 ${
                          student.isLeader ? 'text-sky-800' : 'text-slate-500'
                        }`}>
                          <Star className={`w-3.5 h-3.5 ${student.isLeader ? 'fill-sky-500 text-sky-500' : 'text-slate-400'}`} />
                          {student.isLeader ? 'Designated Team Leader' : 'Mark as Leader'}
                        </span>
                      </label>
                    </div>

                    {students.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Remove student from roster"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* 6 Fields required per student (SRS Section 11) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Karthik S"
                        value={student.fullName}
                        onChange={e => updateStudentField(idx, 'fullName', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Register Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 710022104018"
                        value={student.registerNumber}
                        onChange={e => updateStudentField(idx, 'registerNumber', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Department <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={student.department}
                        onChange={e => updateStudentField(idx, 'department', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                      >
                        <option value="Computer Science and Engineering">Computer Science & Engg</option>
                        <option value="Electronics and Communication">Electronics & Communication</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Robotics and Automation">Robotics & Automation</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechatronics Engineering">Mechatronics</option>
                        <option value="Biomedical Engineering">Biomedical Engineering</option>
                        <option value="Agricultural Engineering">Agricultural Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Year of Study <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={student.year}
                        onChange={e => updateStudentField(idx, 'year', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year (Final Year)</option>
                        <option value="Postgraduate">Postgraduate (M.E / M.Tech)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        College Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="student@college.edu"
                        value={student.email}
                        onChange={e => updateStudentField(idx, 'email', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98400 00000"
                        value={student.mobileNumber}
                        onChange={e => updateStudentField(idx, 'mobileNumber', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Student Button (Up to 5) */}
            {students.length < 5 && (
              <button
                type="button"
                onClick={handleAddStudent}
                className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-sky-500 text-slate-600 hover:text-sky-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member ({students.length} of 5 added)</span>
              </button>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Roster & Initialize Workspace</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
