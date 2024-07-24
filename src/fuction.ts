import path from 'path';
import { parseHuawei, parseZteSns, parseZteState, ONUInfo } from './parser';

const huaweiFile = path.join(__dirname, '../inputs/OntInfo - Huawei.txt');
const zteSnsFile = path.join(__dirname, '../inputs/OntInfo - ZTE - SNs.txt');
const zteStateFile = path.join(__dirname, '../inputs/OntInfo - ZTE - SNs - State.txt');
const zteStateFileT = path.join(__dirname, '../inputs/OntInfo - ZTE - SNs - State - One.txt');

const huaweiData: ONUInfo[] = parseHuawei(huaweiFile);
let zteData: ONUInfo[] = parseZteSns(zteSnsFile);
zteData = parseZteState(zteStateFileT, zteData);


const allData: ONUInfo[] = [...huaweiData, ...zteData];


allData.map(value=>{
    console.log(value)
})


