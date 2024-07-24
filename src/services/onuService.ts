import { OntData} from "@prisma/client";
import { HttpResponse } from "../interfaces/interfaces";

import {parseHuawei, parseZteSns, ONUInfo, parseZteState} from "../parser";

const multer = require('multer');

import { OnuRepository, OnuService } from "../interfaces/onuInterfaces";

import { onuRepository } from "../repositories/onuRepository";

interface data {
    type : string,
    data: string | dataZTE  
}

interface dataZTE{
    dataOne: string,
    dataTwo: string,
}



export class onuService implements OnuService {

    constructor(
        private readonly onuRepository: onuRepository
      ) {}

  async getOnu(): Promise<HttpResponse<OntData[]>>{
    try {
      const onus = await this.onuRepository.getOnu();
      if(!onus) return {
        statusCode: 404,
        body: "Onu not found."
      }
      
      return {
        statusCode: 200,
        body: onus
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: `Error: ${error}`
      }
    }
  }
  
  
  async createOnu(data: data): Promise<HttpResponse<string>> {
    try {
        
      if(data.type === "Huawei" && typeof data.data == "string"){
        const Huawei = parseHuawei(data.data)
        Huawei.map(valueHuawei=>{
            const element:OntData = {
                id: 1,
                ont_id: valueHuawei.ont_id,
                port: parseInt(valueHuawei.port),
                slot: parseInt(valueHuawei.slot),
                sn: valueHuawei.sn,
                state: valueHuawei.state!,
                origin: "Huawei",
            }
            this.addOnu(element)
           
        })
    }else if(data.type === "ZTE" && typeof data.data !== "string"){
        let zteData: ONUInfo[] = parseZteSns(data.data.dataOne);
        zteData = parseZteState(data.data.dataTwo, zteData);
        if(zteData.length !== 0){
          zteData.map(valueZTE=>{
            const element:OntData = {
                id: 1,
                ont_id: valueZTE.ont_id,
                port: parseInt(valueZTE.port),
                slot: parseInt(valueZTE.slot),
                sn: valueZTE.sn,
                state: valueZTE.state!,
                origin: "ZTE",
            }
            this.addOnu(element)
            
        })
        }else return{
          statusCode: 404,
          body: "Onu Empty."
        }
    }

      return {
        statusCode: 201,
        body: "Onu created successfully."
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: `Error: ${error}`
      }
    }
  }

  async addOnu(
    data: OntData
  ): Promise<HttpResponse<Omit<OntData, "slot" | "port" | "ont_id" | "sn" | "state" | "origin">>> {
    try {
      const onuExists = await this.onuRepository.getUserSn(data.sn);
      if(onuExists){
          this.updateUser(data.sn, data)
      };

      await this.onuRepository.createOnu(data)

      return {
        statusCode: 201,
        body: "One created successfully in add.",
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: `Error: ${error}`,
      };
    }
  }

  async updateUser(
    sn:string,
    dataUser: OntData
  ): Promise<HttpResponse<Omit<OntData,"slot" | "port" | "ont_id" | "sn" | "state" | "origin">>> {
    try {
      const onuExists = await this.onuRepository.getUserSn(dataUser.sn);
      if(!onuExists)     return {
        statusCode: 400,
        body: "Onu no exists.",
      };
      

      const fields: (keyof Pick<
        OntData,
       "slot" | "port" | "ont_id" | "sn" | "state" | "origin"
      >)[] = ["slot", "port","ont_id", "sn", "state","origin"];
      for (const field of fields) {
        if (!dataUser[field]) {
          dataUser[field] = onuExists[field] as never;
        }
      }

      await this.onuRepository.updateOnu(sn, dataUser);

      return {
        statusCode: 200,
        body: "Onu updated successfully.",
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: `Error: ${error}`,
      };
    }
  }
}