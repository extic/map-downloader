export type DownloadData = {
  zoomLevel: number;
  startRow: number;
  startCol: number;
  endRow: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  endCol: number;
  mapName: string;
  mapType: string;
  posLeft: number,
  posTop: number,
  cropLeft?: number,
  cropTop?: number,
  cropWidth?: number;
  cropHeight?: number;
};
