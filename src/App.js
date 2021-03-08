import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import React from 'react'
import InterpretationWall from './app/InterpretationWall'

const App = () => {
    const { d2 } = useD2()

    if (!d2) {
        return null
    }

    return <InterpretationWall d2={d2} />
}

export default App
