import Script from "next/script";

export default function ThemeScript() {
  const code = `
  (function(){
    try {
      const t = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (t === 'dark' || (!t && prefersDark)) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch(e) {}
  })();
  `;
  return <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: code }} />;
}
