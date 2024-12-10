export interface OrderTicket {
    id: number;
    title: string;
    price: string;
    oldPrice?: number;
    description?: string;
    imageUrl?: string;
    paymentId?: string;
    isDelete?: boolean;
    count?: number;
    email?: string;
  }