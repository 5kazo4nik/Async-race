export function createSvg(color: string, classes?: string[]): HTMLElement {
  const svgObject = document.createElement('object');

  svgObject.data = './img/car_gdhlhrosi4v1..svg';
  svgObject.type = 'image/svg+xml';

  if (classes) svgObject.classList.add(...classes);

  svgObject.onload = (): void => {
    const svgDoc = svgObject.contentDocument;
    if (!svgDoc) return;
    const svgElement = svgDoc.querySelector('svg');
    if (!svgElement) return;
    const path = svgElement.querySelector<SVGPathElement>('.true-fill');
    if (path) path.style.fill = color;
  };
  return svgObject;
}
