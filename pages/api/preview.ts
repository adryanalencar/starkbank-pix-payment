// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse, Route } from 'next'
import starkbank from 'starkbank'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    // get brcode query string
    let brcode = req.query.brcode
    let project = new starkbank.Project({
        environment:  process.env.enviroment || "",
        id:  process.env.projectId || "",
        privateKey: process.env.privateKey || ""
    }); 


    starkbank.user = project
    let previews = [] as any[]

    try {
        previews = await starkbank.paymentPreview.create([
            new starkbank.PaymentPreview({ 
                id: brcode as string,
                scheduled: undefined
            }),
        ]);
    } catch (error) {
        console.log(error)
    }
    

    res.status(200).json({ previews })
}
