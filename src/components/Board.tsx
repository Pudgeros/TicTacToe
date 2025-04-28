import Square from './Square'
import {useEffect, useState} from 'react'

type Player = 'X' | 'O' | null

function Board() {

    const [squares, setSquares] = useState<Player[]>(Array(9).fill(null))
    const [isNextX, setIsNextX] = useState<boolean>(true)

    const [scoreX, setScoreX] = useState<number>(
        parseInt(sessionStorage.getItem('scoreX') ?? '0')
    )
    const [scoreO, setScoreO] = useState<number>(
        parseInt(sessionStorage.getItem('scoreO') ?? '0')
    )
    const [winner, setWinner] = useState<Player>(null)
    const [info, setInfo] = useState<string>('Next -> X')

    const [nextRoundTime, setNextRoundTime] = useState<number | null>(null)

    const checkWinner = (newSquares: Player[]) => {
        const winnerCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ]
        for (let combinations of winnerCombinations) {
            let [a, b, c] = combinations
            if (newSquares[a] === newSquares[b] && newSquares[a] === newSquares[c]) {
                return newSquares[a]
            }
        }
    }

    const setSquareValue = (i: number) => {
        if (squares[i] || winner) {
            return
        }

        isNextX ? setInfo('Next -> O') : setInfo('Next -> X')

        let newSquares = squares.slice()
        newSquares[i] = (isNextX) ? 'X' : 'O'
        setIsNextX(!isNextX)
        setSquares(newSquares)

        const isWinner = checkWinner(newSquares)
        const isGameOver = newSquares.every((square) => square !== null)

        if (isWinner) {
            setWinner(isWinner)
            setInfo(`Winner: ${isWinner}`)
        }

        else if (isGameOver) {
            setNextRoundTime(5)
            setInfo(`Draw`)
        }
    }


    useEffect(() => {
        if (winner === 'X') {
            setScoreX(scoreX + 1)
        }
        else if (winner === 'O') {
            setScoreO(scoreO + 1)
        }

        winner && setNextRoundTime(5)
    }, [winner])

    useEffect(() => {
        sessionStorage.setItem('scoreX', scoreX.toString())
    }, [scoreX])

    useEffect(() => {
        sessionStorage.setItem('scoreO', scoreO.toString())
    }, [scoreO])

    useEffect(() => {
        if (nextRoundTime === null) {
            return
        }

        if (nextRoundTime === 0) {
            setSquares(Array(9).fill(null))
            setWinner(null)
            setInfo('Next -> X')
            setIsNextX(true)
            setNextRoundTime(null)
            return
        }

        const timer = setTimeout(() => {
            setNextRoundTime(nextRoundTime => nextRoundTime! - 1)
        }, 1000)
        return () => {clearTimeout(timer)}
    }, [nextRoundTime])

    return (
        <div>
            <h1>{info}</h1>
            <h2>
                X: {scoreX} <br />
                O: {scoreO}
            </h2>
            {squares.map((square, index) => {
                return (
                    <span key={index}>
                        <Square value={square} setSquareValue={() => setSquareValue(index)} />
                        {(index === 2 || index === 5) && <br />}
                    </span>
                )
            })}
            {(winner || info === 'Draw') && (
                <h3>
                    The next round is in ... {nextRoundTime}
                </h3>
            )}
        </div>
    )
}

export default Board