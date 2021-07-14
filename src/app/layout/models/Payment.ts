export interface Payment {
    _id?: string;
    userId?: string;
    code?: string;
    vendor?: string;
    customer?: string;
    paymentType?: string;
    name?: string;
    description?: string;
    credit?: number;
    debit?: number;
    net?: number;
    status?: string;
    settled?: boolean;
}
