import React, { useState, useRef, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import StarkLogo from "@/images/logo.png";
import Image from "next/image";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Popup = withReactContent(Swal)

export default function Scan() {
  const [data, setData] = useState("");
  const [using, setUsing] = useState(false)
  const pay = async (brCode: string, taxId: string) => {
    const response = await fetch("/api/pay", {
      method: "POST",
      body: JSON.stringify({brcode: brCode, taxId: taxId}),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const json = await response.json()
    const payments = json.payments

    return payments.length > 0
  }

  const getBrCodeData = async () => {
    if(data.length > 0){
      const response = await fetch(`/api/preview?brcode=${data}`)
      const json = await response.json()
      if(json.previews.length > 0 && !using){
        setUsing(true)
        let preview = json.previews[0]

        if (preview.payment.status != "created"){
          Popup.fire({
            title: <h2>QrCode inválido!</h2>,
            icon: "error",
          })
        }

        Popup.fire({
          title: <h2>QRCode Preview</h2>,
          html: <div>
            <p><b>Nome: </b> {preview.payment.name}</p>
            <p><b>Valor: </b> R${(preview.payment.amount / 100).toFixed(2)}</p>
          </div>,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Pagar",
          showConfirmButton: true,
          showCancelButton: true,
        }).then(async (result) => {
          if(result.isConfirmed){
            const payed = await pay(preview.id as string, preview.payment.taxId as string)
            if(payed){
              Popup.fire({
                title: <h2>Pago com sucesso!</h2>,
                icon: "success",
              })
            }else{
              Popup.fire({
                title: <h2>Falha ao pagar!</h2>,
                icon: "error",
              })
            }
          }
        })
        setUsing(false)
      }
      
    }
    setData("")
  }


  useEffect(() => {
    getBrCodeData()
  }, [data])


  return (
    <div
      style={{
        backgroundColor: "#F7F9FA",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: '50px',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image 
          src={StarkLogo}
          alt={"Logo"}
          height={40}
        />
      </div>
      <QrReader
        onResult={(result: any, error: any) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }

        }
        }
        constraints={{ facingMode: "environment" }}
        videoStyle={{
          borderRadius: "10px"
        }}
      />
    </div>
  );
}