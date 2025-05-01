interface SquareProps {
    value: string | null,
    setSquareValue: () => void
}

const Square = ({ value, setSquareValue }: SquareProps) => {
    return (
        <button
            onClick={setSquareValue}
            style = {{
                color: value ? '#e642f5' : '#282c34',
            }}
        >
            {value || '-'}
        </button>
    )
}

export default Square