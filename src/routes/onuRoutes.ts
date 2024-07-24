import { Request, Response, Router } from "express";
import path from 'path';
import multer from 'multer';

// Models
import { Onu } from "../models/Onu";

// Services and Repositories
import { onuRepository } from "../repositories/onuRepository";
import { onuService } from "../services/onuService";

const storage = multer.memoryStorage();
const upload = multer({ storage });

interface data {
  type: string;
  data: string | dataZTE;
}

interface dataZTE {
  dataOne: string;
  dataTwo: string;
}

interface Files {
  [fieldname: string]: Express.Multer.File[] | undefined;
}

const router = Router();

const repositoryOnu = new onuRepository();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { statusCode, body } = await new onuService(repositoryOnu).getOnu();
    res.status(statusCode).json(body);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", upload.fields([{ name: 'dataOne' }, { name: 'dataTwo' }, { name: 'file' }]), async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    let data: data = { type, data:""};

    const files: Files = req.files as Files;

    if (type === 'Huawei') {
      if (files['file'] && Array.isArray(files['file'])) {
        const file = files['file'][0];
        const fileContent = file.buffer.toString('utf-8');
        data.data = fileContent!;
      } else {
        return res.status(400).json({ error: 'Arquivo Huawei não enviado' });
      }
    } else if (type === 'ZTE') {
      const dataOneFile = files['dataOne'] && Array.isArray(files['dataOne']) ? files['dataOne'][0] : null;
      const dataTwoFile = files['dataTwo'] && Array.isArray(files['dataTwo']) ? files['dataTwo'][0] : null;

      if (dataOneFile && dataTwoFile) {
        const dataOneContent = dataOneFile.buffer.toString('utf-8');
        const dataTwoContent = dataTwoFile.buffer.toString('utf-8');

        //Verificar se não é o mesmo arquivo ou se tem a mesma estrutura
        if((dataOneContent.includes("Channel") && dataTwoContent.includes("Channel")) || (dataOneContent.includes("Channel") == false && dataTwoContent.includes("Channel") == false)){
          if(dataOneContent.includes("Channel") && dataTwoContent.includes("Channel")){
            return res.status(400).json({ error: 'Arquivos ZTE iguais ou com mesmo'});
          }else{
            return res.status(400).json({ error: 'Arquivos ZTE faltando o complemento' });
          };
        };

        //O primeiro é o que não tem Channel, para que eu consiga ler o arquivo correto
        if(dataOneContent.includes("Channel")){
          data.data = { dataOne: dataTwoContent!, dataTwo: dataOneContent! };
        }else{
          data.data = { dataOne: dataOneContent!, dataTwo: dataTwoContent! };
        };
      } else {
        return res.status(400).json({ error: 'Arquivos ZTE não enviados' });
      };
    } else {
      return res.status(400).json({ error: 'Tipo inválido' });
    };
    const { statusCode, body } = await new onuService(repositoryOnu).createOnu(data);
    res.status(statusCode).json(body);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: error });
  }
});

export default router;


