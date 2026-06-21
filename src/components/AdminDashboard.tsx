import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileQuestion, Clock, CheckCircle, UploadCloud, FileText, Download, Database, Trash2, AlertTriangle, Printer } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { seedQuestionsDB } from '../lib/seedQuestions';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab ] = useState<'students' | 'subjects' | 'questions' | 'exam' | 'results'>('students');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [results, setResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [printCandidate, setPrintCandidate] = useState<any>(null);
  const [deletingResultId, setDeletingResultId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Student Form
  const [student, setStudent] = useState({ id: '', firstName: '', lastName: '' });
  
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'candidates'), {
        candidate_id: student.id,
        first_name: student.firstName,
        last_name: student.lastName,
        created_at: new Date().toISOString()
      });
      showMessage('success', 'Student added successfully to the database.');
      setStudent({ id: '', firstName: '', lastName: '' });
    } catch (err: any) {
      showMessage('error', err.message);
    }
  };
  // Subject Form
  const [subjectTitle, setSubjectTitle] = useState('');
  
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'subjects'), {
          name: subjectTitle,
          created_at: new Date().toISOString()
      });
      showMessage('success', 'Subject added successfully.');
      setSubjectTitle('');
    } catch (err: any) {
      showMessage('error', err.message);
    }
  };

  // Timing/Exam settings Map to 'exams' table
  const [examConfig, setExamConfig] = useState({ title: '', duration: 60, marks: 100 });
  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'exams'), {
        title: examConfig.title,
        duration_minutes: examConfig.duration,
        total_marks: examConfig.marks,
        created_at: new Date().toISOString()
      });
      showMessage('success', 'Exam configuration saved successfully.');
      setExamConfig({ title: '', duration: 60, marks: 100 });
    } catch (err: any) {
      showMessage('error', err.message);
    }
  };

  // Question Form
  const [question, setQuestion] = useState({ type: 'mcq', text: '', options: '', answer: '', points: 1 });
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const opts = question.options ? question.options.split(',').map(s => s.trim()) : null;
      await addDoc(collection(db, 'questions'), {
        question_type: question.type,
        question_text: question.text,
        options: opts,
        correct_answer: question.answer,
        points: question.points,
        subject: 'General',
        created_at: new Date().toISOString()
      });
      showMessage('success', 'Question banked successfully.');
      setQuestion({ type: 'mcq', text: '', options: '', answer: '', points: 1 });
    } catch (err: any) {
      showMessage('error', err.message);
    }
  };

  const [isSeeding, setIsSeeding] = useState(false);
  const handleSeedQuestions = async () => {
     setIsSeeding(true);
     const res = await seedQuestionsDB();
     setIsSeeding(false);
     if (res.success) {
        showMessage('success', res.message);
     } else {
        showMessage('error', res.message);
     }
  };

  useEffect(() => {
    if (activeTab === 'results') {
      const fetchResults = async () => {
        setLoadingResults(true);
        try {
          const resultsQuery = query(collection(db, 'exam_results'), orderBy('created_at', 'desc'));
          const snapshot = await getDocs(resultsQuery);
          const resultsData: any[] = [];
          snapshot.forEach(doc => {
            resultsData.push({ id: doc.id, ...doc.data() });
          });
          setResults(resultsData);
        } catch (error) {
          console.error("Error fetching results:", error);
          showMessage('error', 'Failed to load exam results.');
        } finally {
          setLoadingResults(false);
        }
      };
      fetchResults();
    }
  }, [activeTab]);

  const downloadCSV = () => {
    if (results.length === 0) return;
    const header = "REG NO,NAME,SCORE,TOTAL POINTS,PERCENTAGE,TAB SWITCHES,RIGHT CLICKS,COPY PASTES\n";
    const rows = results.map(row => `${row.candidate_id},"${row.candidate_name}",${row.score},${row.total_points},${row.percentage}%,${row.security_stats?.tabSwitches || 0},${row.security_stats?.rightClicks || 0},${row.security_stats?.copyPasted || 0}`);
    const csvContent = "data:text/csv;charset=utf-8," + header + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exam_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const executeDeleteResult = async () => {
    if (!deletingResultId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'exam_results', deletingResultId));
      showMessage('success', 'Result deleted successfully.');
      setResults(prev => prev.filter(r => r.id !== deletingResultId));
    } catch (error) {
      console.error("Error deleting result:", error);
      showMessage('error', 'Failed to delete result.');
    } finally {
      setIsDeleting(false);
      setDeletingResultId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0 print:hidden">
         <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded-full p-1 shadow-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img 
                        src="https://i.ibb.co/XfdCjdnM/294463932-545722830683545-9019441332151319432-n.jpg" 
                        alt="Logo" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                </div>
                <h2 className="text-xl font-bold text-red-500 leading-tight">Admin<br/>Portal</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 pl-[3.75rem]">DITM Control Center</p>
         </div>
         <nav className="flex-1 px-4 space-y-2">
            <button onClick={() => setActiveTab('students')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors justify-start ${activeTab === 'students' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Users className="w-5 h-5 mr-3 flex-shrink-0" /> Manage Students
            </button>
            <button onClick={() => setActiveTab('subjects')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors justify-start ${activeTab === 'subjects' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                <BookOpen className="w-5 h-5 mr-3 flex-shrink-0" /> Manage Subjects
            </button>
            <button onClick={() => setActiveTab('exam')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors justify-start ${activeTab === 'exam' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Clock className="w-5 h-5 mr-3 flex-shrink-0" /> Exam Configuration
            </button>
            <button onClick={() => setActiveTab('questions')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors justify-start ${activeTab === 'questions' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                <FileQuestion className="w-5 h-5 mr-3 flex-shrink-0" /> Question Bank
            </button>
            <button onClick={() => setActiveTab('results')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors justify-start ${activeTab === 'results' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                <FileText className="w-5 h-5 mr-3 flex-shrink-0" /> Exam Results
            </button>
         </nav>
         <div className="p-4">
             <button onClick={onLogout} className="w-full py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors">Logout</button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto print:hidden">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 capitalize">{activeTab.replace('_', ' ')} Settings</h1>
            
            {message.text && (
                <div className={`p-4 rounded-lg mb-6 flex items-center shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.type === 'success' && <CheckCircle className="w-5 h-5 mr-2 text-green-600" />}
                    {message.text}
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                {activeTab === 'students' && (
                    <div className="space-y-8">
                        <form onSubmit={handleAddStudent} className="space-y-5">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Add Allowed Candidate</h3>
                                <p className="text-sm text-slate-500 mb-6">Manually provision student access for the CBT system (supports up to 1500 concurrent connections).</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                                    <input required type="text" value={student.id} onChange={(e) => setStudent({...student, id: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="e.g. DIT-001" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                    <input required type="text" value={student.firstName} onChange={(e) => setStudent({...student, firstName: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                    <input required type="text" value={student.lastName} onChange={(e) => setStudent({...student, lastName: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">Provision Student</button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <form onSubmit={handleAddSubject} className="space-y-5">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Add Examination Subject</h3>
                            <p className="text-sm text-slate-500 mb-6">Define a core subject identifier.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                            <input required type="text" value={subjectTitle} onChange={(e) => setSubjectTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="e.g. Mathematics 101" />
                        </div>
                        <div className="pt-4">
                             <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">Save Subject</button>
                        </div>
                    </form>
                )}

                {activeTab === 'exam' && (
                    <form onSubmit={handleAddExam} className="space-y-5">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Configure Global Exam & Timing</h3>
                            <p className="text-sm text-slate-500 mb-6">Adjust duration and global scoring parameters.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Exam Title</label>
                            <input required type="text" value={examConfig.title} onChange={(e) => setExamConfig({...examConfig, title: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="e.g. End of Semester Examinations" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Global Duration (Minutes)</label>
                                <input required type="number" min="1" value={examConfig.duration} onChange={(e) => setExamConfig({...examConfig, duration: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Total Expected Marks</label>
                                <input required type="number" min="1" value={examConfig.marks} onChange={(e) => setExamConfig({...examConfig, marks: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">Apply Configuration</button>
                        </div>
                    </form>
                )}

                {activeTab === 'questions' && (
                     <div className="space-y-8">
                         <form onSubmit={handleAddQuestion} className="space-y-5">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Question Bank Master</h3>
                                <p className="text-sm text-slate-500 mb-6">Insert new standardized questions.</p>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Points / Weight</label>
                                    <input required type="number" min="1" value={question.points} onChange={(e) => setQuestion({...question, points: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Question Format</label>
                                    <select required value={question.type} onChange={(e) => setQuestion({...question, type: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                                        <option value="mcq">Multiple Choice Question (MCQ)</option>
                                        <option value="tf">True / False</option>
                                        <option value="fill">Fill in the Blank</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Question Query</label>
                                <textarea required rows={3} value={question.text} onChange={(e) => setQuestion({...question, text: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-y" placeholder="Describe the question in detail..." />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Options (Comma separated) - Required for MCQ</label>
                                <input type="text" value={question.options} onChange={(e) => setQuestion({...question, options: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Option A, Option B, Option C, Option D" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Correct Answer (Exact string)</label>
                                <input required type="text" value={question.answer} onChange={(e) => setQuestion({...question, answer: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Enter the exact correct response" />
                            </div>
                             <div className="pt-4">
                                <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">Publish to Bank</button>
                            </div>
                         </form>
                         <div className="border-t border-slate-200 pt-8 mt-8">
                             <h3 className="text-lg font-bold text-slate-800 mb-1">Auto-Generate Course Questions</h3>
                             <p className="text-sm text-slate-500 mb-4">Click below to auto-generate 150 standard questions for EXCEL, MICROSOFT WORD, POWERPOINT, and WINDOWS OPERATION (600 total) into the database.</p>
                             <button
                                 onClick={handleSeedQuestions}
                                 disabled={isSeeding}
                                 className="flex items-center px-6 py-3 bg-red-50 text-red-700 font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                             >
                                 <Database className="w-5 h-5 mr-2" />
                                 {isSeeding ? 'Seeding Database...' : 'Seed 600 Standard Questions'}
                             </button>
                         </div>
                     </div>
                )}

                {activeTab === 'results' && (
                    <div className="space-y-5">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Candidate Exam Results</h3>
                                <p className="text-sm text-slate-500">View and download completed exam results.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={downloadCSV} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center">
                                    <Download className="w-4 h-4 mr-2" /> Download CSV
                                </button>
                            </div>
                        </div>
                        {loadingResults ? (
                            <div className="py-8 text-center text-slate-500">Loading results...</div>
                        ) : results.length === 0 ? (
                            <div className="py-8 text-center text-slate-500">No results found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Reg No</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Score</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Percentage</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-center">Violations</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((result) => (
                                            <tr key={result.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="py-3 px-4 text-sm text-slate-800">{result.candidate_id}</td>
                                                <td className="py-3 px-4 text-sm text-slate-800">{result.candidate_name}</td>
                                                <td className="py-3 px-4 text-sm font-medium text-slate-800">{result.score} / {result.total_points}</td>
                                                <td className="py-3 px-4 text-sm text-slate-600">{result.percentage}%</td>
                                                <td className="py-3 px-4 text-sm text-center">
                                                    {(result.security_stats?.tabSwitches > 0 || result.security_stats?.rightClicks > 0 || result.security_stats?.copyPasted > 0) ? (
                                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full" title={`Tabs: ${result.security_stats?.tabSwitches || 0}, Clicks: ${result.security_stats?.rightClicks || 0}, Copy/Paste: ${result.security_stats?.copyPasted || 0}`}>
                                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                                            Flagged
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                                                            Clean
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-right flex justify-end gap-3">
                                                    <button onClick={() => setPrintCandidate(result)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Print Performance Slip">
                                                        <Printer className="w-4 h-4 inline" />
                                                    </button>
                                                    <button onClick={() => setDeletingResultId(result.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete Result">
                                                        <Trash2 className="w-4 h-4 inline" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Printable Report Overlay */}
      {printCandidate && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:absolute print:inset-0 print:bg-white print:p-0 print:z-[100] print:block print:overflow-visible print:w-full">
             <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200 print:shadow-none print:border-none print:rounded-none print:max-w-none print:w-full print:p-0">
                 {/* Report Header */}
                 <div className="bg-slate-900 text-white p-6 flex justify-between items-center print:bg-white print:text-black print:border-b print:border-slate-300">
                     <div>
                         <h2 className="text-xl font-bold tracking-tight text-red-500 print:text-slate-950">Official CBT Examination Slip</h2>
                         <p className="text-xs text-slate-400 print:text-slate-600">Generated on {new Date(printCandidate.created_at || Date.now()).toLocaleDateString()}</p>
                     </div>
                     <button 
                         onClick={() => setPrintCandidate(null)} 
                         className="text-slate-400 hover:text-white px-3 py-1 border border-slate-700 rounded-lg text-sm transition-colors print:hidden"
                     >
                         Close
                     </button>
                 </div>

                 <div className="p-8 space-y-6">
                     {/* Candidate Profile */}
                     <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-6">
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Candidate Name</p>
                             <p className="text-lg font-bold text-slate-800">{printCandidate.candidate_name}</p>
                         </div>
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Registration Number</p>
                             <p className="text-lg font-mono font-bold text-slate-800">{printCandidate.candidate_id}</p>
                         </div>
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Examination Title</p>
                             <p className="text-slate-700 font-semibold">{printCandidate.exam_title || 'N/A'}</p>
                         </div>
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Subject Identifier</p>
                             <p className="text-slate-700 font-semibold">{printCandidate.subject || 'General'}</p>
                         </div>
                     </div>

                     {/* Score & Analytics */}
                     <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-6">
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center print:bg-white print:border-slate-200">
                             <p className="text-xs text-slate-400 font-medium uppercase">Percentage Score</p>
                             <p className="text-2xl font-bold text-slate-900 mt-1">{printCandidate.percentage}%</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center print:bg-white print:border-slate-200">
                             <p className="text-xs text-slate-400 font-medium uppercase">Raw Score</p>
                             <p className="text-2xl font-bold text-slate-900 mt-1">{printCandidate.score} / {printCandidate.total_points}</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center print:bg-white print:border-slate-200">
                             <p className="text-xs text-slate-400 font-medium uppercase">Time Spent</p>
                             <p className="text-2xl font-bold text-slate-900 mt-1">
                                 {printCandidate.time_spent_seconds ? `${Math.floor(printCandidate.time_spent_seconds / 60)}m ${printCandidate.time_spent_seconds % 60}s` : 'N/A'}
                             </p>
                         </div>
                     </div>

                     {/* Question Breakdown Details */}
                     <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-6">
                         <div className="text-center">
                             <p className="text-xs text-slate-400 font-medium uppercase">Correct Answers</p>
                             <p className="text-lg font-bold text-green-600">{printCandidate.correct_count ?? 'N/A'}</p>
                         </div>
                         <div className="text-center">
                             <p className="text-xs text-slate-400 font-medium uppercase">Incorrect Answers</p>
                             <p className="text-lg font-bold text-red-650">{printCandidate.incorrect_count ?? 'N/A'}</p>
                         </div>
                         <div className="text-center">
                             <p className="text-xs text-slate-400 font-medium uppercase">Unanswered Questions</p>
                             <p className="text-lg font-bold text-slate-500">{printCandidate.unanswered_count ?? 'N/A'}</p>
                         </div>
                     </div>

                     {/* Security & Integrity Audit */}
                     <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 print:bg-white print:border-slate-200">
                         <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Integrity & Proctoring Audit</h4>
                         <div className="grid grid-cols-3 gap-4 text-center">
                             <div>
                                 <p className="text-xs text-slate-400 font-medium">Tab Switches</p>
                                 <p className={`text-base font-bold mt-1 ${(printCandidate.security_stats?.tabSwitches || 0) > 0 ? 'text-red-650 font-extrabold animate-pulse' : 'text-slate-750 font-semibold'}`}>
                                     {printCandidate.security_stats?.tabSwitches || 0}
                                 </p>
                             </div>
                             <div>
                                 <p className="text-xs text-slate-400 font-medium">Right Clicks</p>
                                 <p className="text-base font-bold text-slate-750 mt-1">{printCandidate.security_stats?.rightClicks || 0}</p>
                             </div>
                             <div>
                                 <p className="text-xs text-slate-400 font-medium">Copy/Pastes</p>
                                 <p className="text-base font-bold text-slate-750 mt-1">{printCandidate.security_stats?.copyPasted || 0}</p>
                             </div>
                         </div>
                         {((printCandidate.security_stats?.tabSwitches || 0) > 0) && (
                             <div className="mt-4 p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-100 flex items-center gap-2 print:border-none print:bg-white print:text-red-700">
                                 <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                 <span>Warning: Candidate violated proctoring rules by exiting the tab {printCandidate.security_stats.tabSwitches} time(s).</span>
                             </div>
                         )}
                     </div>

                     {/* Official Signoff Area (Print only) */}
                     <div className="hidden print:flex justify-between items-end pt-12">
                         <div>
                             <div className="w-40 border-b border-black"></div>
                             <p className="text-xs font-medium text-slate-600 mt-1">Invigilator Signature</p>
                         </div>
                         <div className="text-right">
                             <div className="w-40 border-b border-black ml-auto"></div>
                             <p className="text-xs font-medium text-slate-600 mt-1">DITM Seal / stamp</p>
                         </div>
                     </div>
                     
                     {/* Print trigger button */}
                     <div className="flex justify-end pt-4 print:hidden">
                         <button 
                             onClick={() => window.print()}
                             className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow"
                         >
                             <Printer className="w-4 h-4" />
                             Trigger Printer Check
                         </button>
                     </div>
                 </div>
             </div>
         </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      {deletingResultId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-red-50 p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Delete Candidate Result</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Are you sure you want to delete this examination result? This action is permanent and cannot be undone.
                </p>
                <div className="mt-2 text-xs font-mono text-slate-500 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                  Result ID: <span className="font-semibold text-slate-700">{deletingResultId}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setDeletingResultId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors disabled:opacity-55"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteResult}
                disabled={isDeleting}
                className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-55"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
