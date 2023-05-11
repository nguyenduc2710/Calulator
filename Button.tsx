import React, { useState } from "react";
import { Col, Row } from 'antd';

interface PROPS{
}

export default function Button(props: PROPS) {
    const buttons: string[] = 
        ["(", ")", "%", "/",
        "7", "8", "9", "*",
        "4", "5", "6", "-",
        "1", "2", "3", "+",
        "AC", "0", ".", "="];
    const displayBtn = buttons.map(btn => {
        return (
            <Col key={btn} span={6} style={{display: 'flex', justifyContent: 'center'}}>
                <button className="cal-btn">{btn}</button>
            </Col>
        )
    })
    return (
        <div className='calculator-actions'>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                {displayBtn}
            </Row>
        </div>
    )
};
