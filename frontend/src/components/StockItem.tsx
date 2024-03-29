import React, {useEffect, useState} from "react";
import {useAuth} from "../auth/AuthProvider";
import {Stock} from "../model/StockModel";
import {deleteStock, updateStock, searchStock, getStock} from "../service/ApiService";
import "./StockItem.css";
import arrow from "../pictures/refresh_arrow_4502.png";
import edit from "../pictures/pencil.png";
import save from "../pictures/SaveButton.png";
import deleteIcon from "../pictures/deleteIcon.png"



interface  StockItemProps {
    stock: Stock
    value: number
    getAllStocks: () => void
}

export default function StockItem (props: StockItemProps) {

    const {token} = useAuth()
    const [share,setShare] = useState("")
    const [purchaseValue,setPurchaseValue] = useState("")
    const [editMode, setEditMode] = useState(false)
    const [editMode2, setEditMode2] = useState(false)
    const [error, setError] = useState("")
    const [price, setPrice] = useState("")
    const [newDate, setNewDate] = useState("")

    useEffect(() => {
        setEditMode(false)
        setEditMode2(false)
    }, [price, newDate]);


    const editShares = (stock: Stock) => {
        if(share.length){
            updateStock( {
                id: stock.id,
                symbol: stock.symbol,
                name: stock.name,
                close: stock.close,
                date: stock.date,
                shares: share,
                purchase: stock.purchase
            }, token)
            .then(() => props.getAllStocks())
            setShare("")
            setEditMode(false)
            setError("")
        }
        else{
            setEditMode(false)
            setTimeout(() => {
                    setError("")
                }, 5000
            )
        }
    }

    const editPurchase = (stock: Stock) => {
        if(purchaseValue.length && purchaseValue.valueOf().toString() !== "0"){
            updateStock( {
                id: stock.id,
                symbol: stock.symbol,
                name: stock.name,
                close: stock.close,
                date: stock.date,
                shares: stock.shares,
                purchase: purchaseValue
            }, token)
                .then(() => props.getAllStocks())
            setPurchaseValue("")
            setEditMode2(false)
            setError("")
        }
        else if(purchaseValue){
            setError("Value must be greater then 0!")
            setEditMode2(false)
            setTimeout(() => {
                    setError("")
                }, 5000
            )
        } else {
            setEditMode2(false)
        }
    }

    const RefreshDataStock = async (stock: Stock) => {
        const stockData = await searchStock(props.stock.symbol, token);

        if (stockData.close && stockData.date) {
            const updatedStock = {
                id: stock.id,
                symbol: stock.symbol,
                name: stockData.name,
                close: stockData.close.toString(),
                date: stockData.date.toString(),
                shares: stock.shares,
                purchase: stock.purchase,
            };
            await updateStock(updatedStock, token);
            await getStock(updatedStock.id, token);
            setNewDate(stockData.date.toString());
            setPrice(stockData.close.toString());
        }
    }


    const deleteFunction = (stock: Stock) => {
        deleteStock(stock.id, token)
            .then( () => {props.getAllStocks()})
    }

    const product = (price : string, quantity : string) => {
        return (parseFloat(price) * parseFloat(quantity)).toFixed(2)
    }

    const profit = (purchase : string, price: string, share : string) => {
        return ((parseFloat(price) - parseFloat(purchase)) * parseFloat(share)).toFixed(2)
    }

    const splitDate = (date: string) => {
        return date.split("",10)
    }

    return(
        <div>
                <h4 className={"StockItem"}>
                    <img src={(arrow)} alt={"what?"} className={"arrow"} title="Refresh"  onClick={() => RefreshDataStock(props.stock)}/>
                    <img src={deleteIcon} alt={"who"} className={"delete-icon"} title="Delete" onClick={() => {window.confirm('Are you sure you want to delete this?') && deleteFunction(props.stock)}}/>
                    <p>Name:    {props.stock.name}</p>
                    <p>Symbol:    {props.stock.symbol}</p>
                    {price.length>1
                    ?
                    <p>Price:   {price}$</p>
                    :
                    <p>Price:   {props.stock.close}$</p>}
                    {newDate?
                      <p>Date:    {splitDate(newDate)}</p>
                    : <p>Date:    {splitDate(props.stock.date)}</p>
                    }
                    <p>Shares:  {props.stock.shares}
                    <img src={(edit)} alt={"what?"} className={"edit"} title="Edit"  onClick={() => setEditMode(true)}/>
                        {editMode?
                            <div style={{display: "inline"}}>
                                <input className={"Input"} type="text" placeholder={"Shares"} value={share} onChange={ev => setShare(ev.target.value)}/>
                                <img src={(save)} alt={"what?"} className={"save-icon"} title="Save"  onClick={() => editShares(props.stock)}/>
                             </div>: null
                        }
                    </p>
                    <p>Value to date:   {product(props.stock.close, props.stock.shares)}$</p>
                    <p>Value of purchase:  {props.stock.purchase}$
                        <img src={(edit)} alt={"what?"} className={"edit"} title="Edit"  onClick={() => setEditMode2(true)}/>
                        {editMode2?
                            <div style={{display: "inline"}}>
                                <input className={"Input"} type="text" placeholder={"Price"} value={purchaseValue} onChange={ev => setPurchaseValue(ev.target.value)}/>
                                <img src={(save)} alt={"what?"} className={"save-icon"} title="Save"  onClick={() => editPurchase(props.stock)}/>
                            </div>: null
                        }
                    </p>
                    {props.stock.purchase
                        ?
                    <p>Profit: {profit(props.stock.purchase, props.stock.close, props.stock.shares)}$</p>
                        : null
                    }
                    <p>{error}</p>
                </h4>
        </div>
    )
}