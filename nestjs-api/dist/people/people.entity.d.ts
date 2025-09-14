export declare class People {
    id: number;
    name: string;
    last_name: string;
    father_id: number;
    spouse_id: number;
    father: People;
    children: People[];
    spouse: People;
    spouseOf: People[];
    createdAt: Date;
    updatedAt: Date;
}
