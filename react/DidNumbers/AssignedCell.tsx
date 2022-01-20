import * as React from 'react';
import { Colors } from '../../styles/Colors';

type AssignedCellProps = {
    text: string;
    decore?: boolean;
};

const AssignedCell: React.FC<AssignedCellProps> = ({
    text,
    decore = false,
}) => {
    const style = decore ? { color: Colors.Gray } : {};
    return <span style={style}>{text}</span>;
};

export default AssignedCell;
