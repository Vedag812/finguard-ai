// ==================== FONT & GLOBAL STYLES ====================
export function FontImport() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #070707; overflow-x: hidden; }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #0A0A0A; }
      ::-webkit-scrollbar-thumb { background: #F97316; border-radius: 4px; }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideInRight { from { opacity: 0; transform: translateX(110%); } to { opacity: 1; transform: translateX(0); } }
      @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      @keyframes tickerScroll { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
      @keyframes countUp { from { opacity: 0; } to { opacity: 1; } }
      @keyframes barFill { from { width: 0%; } to { width: var(--target-width); } }
    ` }} />
  )
}
