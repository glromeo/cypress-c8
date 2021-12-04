import React, {useState} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {TextField} from "@mui/material";
import {add} from "./add";

export default function App() {
    const [left, setLeft] = useState<number | undefined>(undefined);
    const [right, setRight] = useState<number | undefined>(undefined);
    const [result, setResult] = useState<number | undefined>(undefined);
    return (
        <Card sx={{minWidth: 275}}>
            <CardContent>
                <div className="flex-column">
                    <div className="flex-row">
                        <TextField id="left" value={left} onChange={({target}) => {
                            let value = parseFloat(target.value);
                            if (!isNaN(value)) {
                                setLeft(value);
                            } else {
                                setLeft(undefined);
                            }
                        }}/>
                        <div style={{padding: "1rem", fontSize: "4rem"}}>+</div>
                        <TextField id="right" value={right} onChange={({target}) => {
                            let value = parseFloat(target.value);
                            if (!isNaN(value)) {
                                setRight(value);
                            } else {
                                setRight(undefined);
                            }
                        }}/>
                        <div style={{padding: "1rem", fontSize: "4rem"}}>=</div>
                        <TextField id="result" value={result} onChange={value => console.log(value)}/>
                    </div>
                    <div className="flex-row">
                        <div className="filler"/>
                        <Button variant="contained" style={{margin: "3rem"}} onClick={() => {
                            setResult(add(left, right));
                        }}>Calculate</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
