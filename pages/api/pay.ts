// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse, Route } from 'next'
import starkbank from 'starkbank'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    // get brcode query string
    let brcode = req.body.brcode
    let taxId = req.body.taxId
    let project = new starkbank.Project({
        environment:  process.env.enviroment || "",
        id:  process.env.projectId || "",
        privateKey: process.env.privateKey || ""
    }); 


    starkbank.user = project
    let payments = [] as any[]

    try {
        payments = await starkbank.brcodePayment.create([
            {
                brcode: brcode,
                taxId: taxId,
                description: "vercel-payment"
            },
        ]);
    } catch (error) {
        
    }
    

    res.status(200).json({ payments })
}
