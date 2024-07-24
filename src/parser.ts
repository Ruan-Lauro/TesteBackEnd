import fs from 'fs';
import path from 'path';

export interface ONUInfo {
    slot: string;
    port: string;
    ont_id: string;
    sn: string;
    state: string | null;
}



export const parseHuawei = (filePath: string): ONUInfo[] => {
    const data: ONUInfo[] = [];
    

    const lines = filePath.split('\n');

    const newList = lines.slice(8);
 
    const regex = /(\d+)\/\s*(\d+)\/(\d+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/;

    for (let line of newList) {
        
        const match = line.match(regex);
        
        if(match == null){
            break
        }

        const element = {
            slot: match[2],
            port: match[3],
            ont_id: match[4],
            sn: match[5],
            state: match[7]
        }

        data.push(element)
        
    }

    return data;
};

export const parseZteSns = (filePath: string): ONUInfo[] => {
    const data: ONUInfo[] = [];
    

    const lines = filePath.split('\n');
    const regex = /gpon-onu_(\d+)\/(\d+)\/(\d+):(\d+)\s+(\S+)\s+sn\s+SN:(\S+)\s+(\S+)/;

    const newLines = lines.slice(2)

    for (const line of newLines) {
        const match = line.match(regex);
        if(match == null){
            break
        }

        const element = {
            slot: match[2],
            port: match[3],
            ont_id: match[4],
            sn: match[6],
            state: null
        }
        data.push(element)
       
    }
   

    return data;
};

export const parseZteState = (filePath: string, zteData: ONUInfo[]): ONUInfo[] => {

    const zteDataN: ONUInfo[] = []
    const lines = filePath.split('\n');
    const regex = /^(\d+)\/(\d+)\/(\d+):(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)$/;
    const newLines = lines.splice(3)

    for (const line of newLines) {
        const match = line.match(regex);
        if (match) {
          let entry = zteData.find(value=> value.ont_id == match[4])
          if(match[7]==="working"){
            const element = {
                slot: entry?.slot!,
                port: entry?.port!,
                ont_id: entry?.ont_id!,
                sn: entry?.sn!,
                state: "online"
              }
              zteDataN.push(element)
          }else{
            const element = {
                slot: entry?.slot!,
                port: entry?.port!,
                ont_id: entry?.ont_id!,
                sn: entry?.sn!,
                state: "offline"
              }
              zteDataN.push(element)
          }
          
         
        }
    }

    return zteDataN;
};
