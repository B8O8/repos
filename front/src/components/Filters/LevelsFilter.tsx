import React from 'react'
import CustomSelect, { LabelsWithValues } from './CustomSelect'

interface Props {
    value: string
    handleChange: (e: any) => void
}

function LevelsFilter(props: Props) {
    const {value, handleChange} = props
    const menuItems: LabelsWithValues[] = [
        {
            label: "Level 1",
            value: "1",
        },
        {
            label: "Level 2",
            value: "2",
        },
        {
            label: "Level 3",
            value: "3",
        },
        {
            label: "Level 4",
            value: "4",
        },
        {
            label: "Level 5",
            value: "5",
        },
        {
            label: "Level 6",
            value: "6",
        },
        {
            label: "Level 7",
            value: "7",
        },
        {
            label: "Level 8",
            value: "8",
        },
        {
            label: "Level 9",
            value: "9",
        },
        {
            label: "Level 10",
            value: "10",
        },

    ]
    return (
        <CustomSelect 
            menuItems={menuItems}
            label='Levels'
            name='levelsFilter'
            value={value}
            handleChange={handleChange}
        />
    )
}

export default LevelsFilter
