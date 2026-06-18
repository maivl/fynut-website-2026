"use client";

export default function NavBar() {
  return (
    <nav className="fynut-nav" id="mainNav" aria-label="Primary">
      <a
        href="#hero"
        className="font-display-thin text-lg tracking-widest"
        style={{ color: "var(--text-primary)" }}
      >
        FYNUT
      </a>
      <div className="flex items-center">
        <a href="#philosophy" className="nav-link">
          Philosophy
        </a>
        <a href="#experience" className="nav-link">
          Experience
        </a>
        <a href="#products" className="nav-link">
          Products
        </a>
        <a href="#details" className="nav-link">
          Details
        </a>
      </div>
    </nav>
  );
}
