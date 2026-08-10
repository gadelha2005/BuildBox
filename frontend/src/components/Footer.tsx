export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <span>
          &copy; {new Date().getFullYear()} BuildBox — Ferragens, ferramentas e
          materiais
        </span>
        <span>Elétrica · Hidráulica · Ferramentas · Tintas</span>
      </div>
    </footer>
  );
}
