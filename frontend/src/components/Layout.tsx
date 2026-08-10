import type { ReactNode } from "react";
import { Header } from "./header/Header";
import { Footer } from "./footer/Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <Header />
      <main className="container layout__main">{children}</main>
      <Footer />
    </div>
  );
}
