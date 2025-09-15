import { request } from "./http";

export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

/**
 * 取得圖片清單
 * @param page 頁碼 (從 1 開始)
 * @param limit 每頁數量，預設 10
 */
export const getPicsumList = (page: number, limit = 10) => {
  return request<PicsumImage[]>({
    url: `/v2/list`,
    method: "GET",
    params: { page, limit },
    baseURL: "https://picsum.photos",
  });
};

/**
 * 取得單張圖片資訊
 * @param id 圖片 ID
 */
export const getPicsumById = (id: number) => {
  return request<PicsumImage>({
    url: `/id/${id}/info`,
    method: "GET",
    baseURL: "https://picsum.photos",
  });
};

/**
 * 取得單張隨機圖片 (直接回傳圖片 URL，不是 JSON)
 * @param width 圖片寬度
 * @param height 圖片高度
 */
export const getRandomImageUrl = (width: number, height: number) => {
  return `https://picsum.photos/${width}/${height}`;
};

/**
 * 取得指定 ID 的圖片 (直接回傳圖片 URL，不是 JSON)
 * @param id 圖片 ID
 * @param width 圖片寬度
 * @param height 圖片高度
 */
export const getImageUrlById = (id: number, width: number, height: number) => {
  return `https://picsum.photos/id/${id}/${width}/${height}`;
};