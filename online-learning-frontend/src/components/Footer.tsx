export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between gap-6">
        <p>© {new Date().getFullYear()} Inter. All rights reserved.</p>
        <div className="flex gap-6 text-sm">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
}
