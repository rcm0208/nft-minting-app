'use client';

export default function Footer() {
  return (
    <footer className="border-t sticky top-full">
      <div className="container h-16 flex justify-between items-center">
        <p>&copy; {new Date().getFullYear()} rcm0208</p>
      </div>
    </footer>
  );
}
