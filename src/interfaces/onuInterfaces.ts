import { OntData } from "@prisma/client"
import { HttpResponse } from "./interfaces";

interface data {
    type : string,
    data: string
}

export interface OnuRepository {
  getOnu: () => Promise<OntData[]>;
  createOnu: (data:data) => Promise<string>;
}

export interface OnuService {
  getOnu: () => Promise<HttpResponse<OntData []>>;
  createOnu: (data:data) => Promise<HttpResponse<string>>;
}

