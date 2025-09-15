export interface Todo {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  content: string;
}

export interface ImageState {
  src: string;
  loading: boolean;
}