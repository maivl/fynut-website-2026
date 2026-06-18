export default function NavBar() {
  return (
    <nav class="fynut-nav" id="mainNav" aria-label="Primary">
      <a
        href="#hero"
        class="font-display-thin text-lg tracking-widest"
        style={{ color: "var(--text-primary)" }}
      >
        FYNUT
      </a>
      <div class="flex items-center">
        <a href="#philosophy" class="nav-link">
          Philosophy
        </a>
        <a href="#experience" class="nav-link">
          Experience
        </a>
        <a href="#products" class="nav-link">
          Products
        </a>
        <a href="#details" class="nav-link">
          Details
        </a>
      </div>
    </nav>
  );
}
