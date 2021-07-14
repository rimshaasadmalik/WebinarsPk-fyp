export interface Payment {
    _id?: string;
    userId?: string;
    code?: string;
    vendor?: string;
    customer?: string;
    paymentType?: string;
    name?: string;
    description?: string;
    credit?: string;
    debit?: string;
    status?: string;
}
