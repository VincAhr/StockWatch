import React, {useState} from "react";
import {useAuth} from "../auth/AuthProvider";
import {Stock} from "../model/StockModel";
import {deleteStock, postShares} from "../service/ApiService";
import "./StockItem.css";


interface  StockItemProps {
    stock: Stock
    value: number
    updateStock: () => void
}

export default function StockItem (props: StockItemProps) {

    const {token} = useAuth()
    const [share,setShare] = useState("")
    const [editMode, setEditMode] = useState(false)
    const [error, setError] = useState("")


    const editShares = (stock: Stock) => {
        if(share.length>0){
            postShares( {
                id: stock.id,
                symbol: stock.symbol,
                close: stock.close,
                date: stock.date,
                shares: share
            }, token)
            .then(() => props.updateStock())
            setShare("")
            setEditMode(false)
            setError("")
        }
        else{
            setError("Shares must be greater then 0!")
            setEditMode(false)
        }
    }

    const deleteFunction = (stock: Stock) => {
        deleteStock(stock.id, token)
            .then( () => {props.updateStock()})
    }

    const product = (price : string, quantity : string) => {
        return (parseFloat(price) * parseFloat(quantity)).toFixed(2)
    }

    const splitDate = (date: string) => {
        return date.split("",10)
    }

    return(
        <div>
                <h4 className={"StockItem"}>
                    <p>Name:    {props.stock.symbol}</p>
                    <p>Price:   {props.stock.close} $</p>
                    <p>Date:    {splitDate(props.stock.date)}</p>
                    <p>Shares:  {props.stock.shares}</p>
                    <p>Value:   {product(props.stock.close, props.stock.shares)} $</p>
                    {editMode
                            ?
                            <div>
                                <input className={"Input-Save"} type="text" placeholder={"edit quantitiy"} value={share} onChange={ev => setShare(ev.target.value)}/>
                                <button className={"Button-Save"} onClick={() => editShares(props.stock)}> save </button>
                            </div>
                            :
                            <div> <button className={"Button-Edit"} style={{display: "inline"}} onClick={() => setEditMode(true)} > edit shares </button> {error} </div>
                    }
                    <button className={"Button-Delete" } style={{display: "inline"}} onClick={() => deleteFunction(props.stock)} > delete stock </button>
                </h4>
        </div>
    )
}