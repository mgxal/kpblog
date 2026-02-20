export default function Navbar() {
  return (
    <nav style={{
      position: "fixed",
      top: 20,
      right: 40
    }}>
      <a href="/">Portfolio</a>{" "}
      <a href="/projects">Projekty</a>{" "}
      <a href="/stack">Stack</a>{" "}
      <a href="/blog">Blog</a>{" "}
      <a href="/contact">Kontakt</a>
    </nav>
  );
}