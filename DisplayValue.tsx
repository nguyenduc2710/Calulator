import React, { useState } from "react";
import { Typography } from 'antd';

interface PROPS {
    displayVal: string,
}

export default function DisplayValue(props:PROPS) {
    const { Title } = Typography;
    return (
        <div className="display-value">
            <Title level={2} className='screen'>{props.displayVal}</Title>
        </div>
    )
}