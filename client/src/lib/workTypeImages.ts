import masonImage from '@assets/stock_images/indian_construction__4ecb5fb6.jpg';
import electricianImage from '@assets/stock_images/indian_electrician_w_20a693ed.jpg';
import plumberImage from '@assets/stock_images/indian_plumber_fixin_f0afe3d9.jpg';
import carpenterImage from '@assets/stock_images/indian_carpenter_woo_3fa9777c.jpg';
import painterImage from '@assets/stock_images/indian_painter_paint_07ed92cf.jpg';
import helperImage from '@assets/stock_images/construction_helper__83e95c9a.jpg';

export const workTypeImages: Record<string, string> = {
  mason: masonImage,
  electrician: electricianImage,
  plumber: plumberImage,
  carpenter: carpenterImage,
  painter: painterImage,
  helper: helperImage,
  // Default fallback
  default: masonImage,
};

export function getWorkTypeImage(jobTitle: string): string {
  const normalizedTitle = jobTitle.toLowerCase();
  
  // Check for keywords in job title
  if (normalizedTitle.includes('mason') || normalizedTitle.includes('brick') || normalizedTitle.includes('plaster')) {
    return workTypeImages.mason;
  }
  if (normalizedTitle.includes('electric') || normalizedTitle.includes('wiring')) {
    return workTypeImages.electrician;
  }
  if (normalizedTitle.includes('plumb') || normalizedTitle.includes('pipe')) {
    return workTypeImages.plumber;
  }
  if (normalizedTitle.includes('carpenter') || normalizedTitle.includes('wood')) {
    return workTypeImages.carpenter;
  }
  if (normalizedTitle.includes('paint')) {
    return workTypeImages.painter;
  }
  if (normalizedTitle.includes('helper') || normalizedTitle.includes('labour')) {
    return workTypeImages.helper;
  }
  
  return workTypeImages.default;
}
