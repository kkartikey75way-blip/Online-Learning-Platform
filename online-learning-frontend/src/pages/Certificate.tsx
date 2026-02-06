import { useEffect, useState, useRef } from "react";
import { getMyCertificates } from "../services/certificate.service";
import { toPng } from "html-to-image";
import download from "downloadjs";
import CertificateTemplate from "../components/CertificateTemplate";
import { HiOutlineAcademicCap, HiArrowDownTray, HiOutlineEye, HiOutlineXMark } from "react-icons/hi2";

export default function Certificates() {
  const [certs, setCerts] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    getMyCertificates().then(setCerts);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.name) setUserName(user.name);
  }, []);

  const handleDownload = async () => {
    if (!certRef.current || !selectedCert) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(certRef.current, {
        cacheBust: true,
        width: 800,
        height: 600,
      });
      download(dataUrl, `Certificate-${selectedCert.course.title.replace(/\s+/g, "-")}.png`);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download certificate. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-3 rounded-xl text-white">
          <HiOutlineAcademicCap size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-500">View and download your earned credentials</p>
        </div>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-dashed border-gray-300">
          <div className="text-gray-400 mb-4 flex justify-center">
            <HiOutlineAcademicCap size={64} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">No certificates yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">
            Finish a course 100% to earn your official certificate of completion.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <HiOutlineAcademicCap size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{c.course.title}</h3>
              <p className="text-sm text-gray-500 mb-6">Issued on {new Date(c.issuedAt || c.issueDate).toLocaleDateString()}</p>

              <button
                onClick={() => setSelectedCert(c)}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl font-semibold hover:bg-black transition-colors"
              >
                <HiOutlineEye size={18} /> View Certificate
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-[850px] w-full relative animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Certificate Preview</h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HiOutlineXMark size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content - Template */}
            <div className="p-6 bg-gray-100 overflow-hidden flex justify-center">
              <div className="shadow-2xl scale-[0.8] origin-center sm:scale-100">
                <CertificateTemplate
                  ref={certRef}
                  studentName={userName}
                  courseTitle={selectedCert.course.title}
                  date={new Date(selectedCert.issuedAt || selectedCert.issueDate).toLocaleDateString()}
                  credentialId={selectedCert.credentialId || selectedCert._id.substring(0, 8).toUpperCase()}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-6 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>Downloading...</>
                ) : (
                  <>
                    <HiArrowDownTray size={20} /> Download PNG
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN TEMPLATE FOR DOWNLOAD (In case modal scaling affects quality) */}
      <div className="fixed left-[-9999px] top-[-9999px]">
        {selectedCert && (
          <CertificateTemplate
            ref={certRef}
            studentName={userName}
            courseTitle={selectedCert.course.title}
            date={new Date(selectedCert.issuedAt || selectedCert.issueDate).toLocaleDateString()}
            credentialId={selectedCert.credentialId || selectedCert._id.substring(0, 8).toUpperCase()}
          />
        )}
      </div>
    </div>
  );
}
