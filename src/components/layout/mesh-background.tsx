/** 动态 mesh gradient 背景层：三个彩色光斑缓慢漂移（纯 CSS，见 globals.css） */
export function MeshBackground() {
  return (
    <div className="mesh-bg" aria-hidden>
      <div className="mesh-blob mesh-blob-1" />
      <div className="mesh-blob mesh-blob-2" />
      <div className="mesh-blob mesh-blob-3" />
    </div>
  );
}
