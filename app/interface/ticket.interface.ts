export interface Ticket {
    id: number;
    title: string;
    price: string;
    oldPrice?: number;
    description?: string;
    imageUrl?: string;
    isDelete?: boolean;
  }