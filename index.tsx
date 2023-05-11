import React, { useEffect, useState } from "react";
import Button from "./Button";
import DisplayValue from "./DisplayValue";
import { Main } from "./handleLogic";
import { Typography } from "antd";
import './calculator.css';
import './gradient.css';

export default function () {
    const { Title } = Typography;
    const [displayVal, setDisplayVal] = useState({
        display: '0'
    });
    let buttons = Array.from(document.getElementsByClassName('cal-btn'));

    function tempFunc(btnVal: string) {
        setDisplayVal(prevState => {
            const screenVal: string = prevState.display;
            return {
                ...prevState,
                display: Main({ btnVal, screenVal })
            }
        })
    }

    useEffect(() => {
        buttons = Array.from(document.getElementsByClassName('cal-btn'));
        const delBtn = document.getElementsByClassName('badge');
        buttons.push(delBtn[0]);
        buttons.forEach(item => {
            const value = item.innerHTML;
            item.addEventListener('click', () => tempFunc(value))
            return (
                item.removeEventListener('click', () => tempFunc(value))
            )
        })
    }, [])

    return (
        <div className="wrapper">
            <div className='container'>
                <Title level={2}>My Computer</Title>

                <div className="calculator position-relative">
                    <DisplayValue displayVal={displayVal.display} />
                    <Button />
                    <button data-del className="position-absolute translate-middle badge rounded-pill bg-danger">
                        Del
                    </button>
                </div>
            </div>
        </div>
    )
}