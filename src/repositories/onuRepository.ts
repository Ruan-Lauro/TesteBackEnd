import { OntData, PrismaClient } from "@prisma/client";
import { OnuRepository } from "../interfaces/onuInterfaces";

const prisma = new PrismaClient();

export class onuRepository {
  async getOnu(): Promise<OntData[]> {
    try {
      return await prisma.ontData.findMany();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  
  async getUserSn(sn: string): Promise<OntData | null> {
    try {
      return await prisma.ontData.findUnique({
        where: {
          sn: sn,
        },
      });
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }

  async createOnu({ slot, port, ont_id, sn, state, origin}: Pick<OntData, "slot" | "port" | "ont_id" | "sn" | "state" | "origin">): Promise<OntData> {
    try {
      return await prisma.ontData.create({
        data: {
          slot,
          port,
          ont_id,
          sn,
          state,
          origin
        },
      });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async updateOnu(sn: string, { ont_id, origin, port, slot, state }: OntData): Promise<OntData | null> {
    return await prisma.ontData.update({
      where: {
        sn: sn,
      },
      data: {
        ont_id,
        origin,
        port,
        slot,
        state
      }
    })
  }

}