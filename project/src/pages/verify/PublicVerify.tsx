import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, CheckCircle, Download, FileText, Calendar, Building, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const PublicVerify = () => {
  const { certificateId } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null); // 'valid', 'invalid', 'revoked'
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verifyCert = async () => {
      try {
        // Use Vite's env variable or fallback to localhost
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/verify/${certificateId}`);
        if (res.data.isValid) {
          setData(res.data.data);
          setStatus('valid');
        } else {
          setStatus(res.data.status?.toLowerCase() === 'revoked' ? 'revoked' : 'invalid');
          setErrorMsg(res.data.message);
        }
      } catch (error) {
        setStatus('invalid');
        setErrorMsg(error.response?.data?.message || 'Certificate Not Found');
      } finally {
        setLoading(false);
      }
    };
    
    if (certificateId) verifyCert();
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Verifying Certificate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">LearnKins Verification</h1>
          <p className="text-slate-500 mt-2">Official Certificate Verification Portal</p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'valid' && data && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden"
            >
              {/* Status Header */}
              <div className="bg-emerald-500 px-6 py-8 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 pattern-dots opacity-30"></div>
                <ShieldCheck className="w-20 h-20 mx-auto mb-4 text-emerald-100" />
                <h2 className="text-3xl font-bold">Verified Certificate</h2>
                <p className="text-emerald-100 mt-2 text-lg">This certificate is authentic and valid.</p>
              </div>

              {/* Certificate Details */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Student Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-primary-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">Name</p>
                          <p className="font-semibold text-slate-900">{data.studentName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-primary-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">University</p>
                          <p className="font-semibold text-slate-900">{data.university || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Internship Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-primary-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">Title & Domain</p>
                          <p className="font-semibold text-slate-900">{data.internshipTitle}</p>
                          <p className="text-sm text-slate-600">{data.internshipDomain}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">Duration</p>
                          <p className="font-semibold text-slate-900">{data.duration}</p>
                          <p className="text-xs text-slate-500">{new Date(data.startDate).toLocaleDateString()} - {new Date(data.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Certificate ID</p>
                      <p className="font-mono text-lg font-bold text-slate-900">{data.certificateId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Issue Date</p>
                      <p className="font-semibold text-slate-900">{new Date(data.issueDate).toLocaleDateString()}</p>
                    </div>
                    {data.pdfUrl && (
                      <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${data.pdfUrl}`} target="_blank" rel="noreferrer" className="btn-primary flex items-center gap-2">
                        <Download className="w-5 h-5" /> Download PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
                <span>Verified Count: {data.verificationCount}</span>
                <span>Last Verified: {data.lastVerifiedDate ? new Date(data.lastVerifiedDate).toLocaleString() : 'Just now'}</span>
              </div>
            </motion.div>
          )}

          {status === 'invalid' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card overflow-hidden">
               <div className="bg-red-500 px-6 py-12 text-center text-white">
                <ShieldAlert className="w-24 h-24 mx-auto mb-4 text-red-100" />
                <h2 className="text-3xl font-bold mb-2">Certificate Not Found</h2>
                <p className="text-red-100 text-lg">{errorMsg}</p>
              </div>
            </motion.div>
          )}

          {status === 'revoked' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card overflow-hidden">
               <div className="bg-amber-500 px-6 py-12 text-center text-white">
                <ShieldAlert className="w-24 h-24 mx-auto mb-4 text-amber-100" />
                <h2 className="text-3xl font-bold mb-2">Certificate Revoked</h2>
                <p className="text-amber-100 text-lg">This certificate is no longer valid as it has been revoked by LearnKins.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PublicVerify;
