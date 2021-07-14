export interface Request {
    _id?: string;
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    response?: string;
    city?: string;
    zip?: number;
    isResponded?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
}
