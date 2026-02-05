import { useEffect, useState } from "react";
import { getMyCertificates } from "../services/certificate.service";

export default function Certificates() {
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    getMyCertificates().then(setCerts);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        My Certificates
      </h1>

      {certs.map((c) => (
        <div key={c._id} className="bg-white p-4 mb-3">
          🎓 {c.course.title}
        </div>
      ))}
    </div>
  );
}
